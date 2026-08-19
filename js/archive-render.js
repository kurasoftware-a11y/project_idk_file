(function () {
  "use strict";

  const archive = Array.isArray(window.IDK_ARCHIVE)
    ? [...window.IDK_ARCHIVE].sort((a, b) =>
        String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
      )
    : [];
  const itemsPerPage = Math.max(1, Number(window.IDK_ARCHIVE_SETTINGS?.itemsPerPage) || 6);
  const imageInterval = Math.max(1000, Number(window.IDK_ARCHIVE_SETTINGS?.imageInterval) || 5000);
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const slideshowTimers = new Map();

  const grid = document.getElementById("archive-grid");
  const archiveMode = grid?.dataset.archiveMode || "infinite";
  const isPreview = archiveMode === "preview";
  const previewCount = Math.max(1, Number(grid?.dataset.previewCount) || 3);
  const searchInput = document.getElementById("archive-search");
  const filterSelect = document.getElementById("archive-filter");
  const filteredCountElements = document.querySelectorAll("[data-filtered-count]");
  const loadedCountElements = document.querySelectorAll("[data-loaded-count]");
  const emptyState = document.getElementById("archive-empty");
  const archiveLoad = document.getElementById("archive-load");
  const loadMoreButton = document.getElementById("archive-load-more");
  const archiveEnd = document.getElementById("archive-end");
  const archiveSentinel = document.getElementById("archive-sentinel");
  const modal = document.getElementById("archive-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = modal.querySelector("[data-modal-close]");
  const protocolModal = document.getElementById("protocol-modal");
  const protocolOpenButtons = document.querySelectorAll("[data-protocol-open]");
  const protocolClose = protocolModal?.querySelector("[data-protocol-close]");

  const initialParams = new URLSearchParams(window.location.search);
  const state = {
    batch: Math.max(1, Number.parseInt(initialParams.get("batch") || initialParams.get("page"), 10) || 1),
    query: "",
    category: "all"
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);

  const pad = (value, size = 2) => String(value).padStart(size, "0");

  function getImages(item) {
    const value = item.image ?? item.images;
    const images = Array.isArray(value) ? value : [value];
    return images.filter((image) => typeof image === "string" && image.trim());
  }

  function getImagePosition(item, index) {
    const configured = Array.isArray(item.imagePosition)
      ? item.imagePosition[index]
      : item.imagePosition;
    const normalized = String(configured ?? "center").trim().toLowerCase();
    return ["top", "center", "bottom"].includes(normalized) ? normalized : "center";
  }

  function safeExternalUrl(value) {
    if (!value) return "";

    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  function createImageMarkup(item, { detail = false, firstOnly = false } = {}) {
    const images = firstOnly ? getImages(item).slice(0, 1) : getImages(item);
    const alt = detail ? `${item.nameJa}の拡大画像` : item.nameJa;

    return images.map((image, index) => {
      const imagePosition = detail ? getImagePosition(item, index) : "center";
      const imagePositionPercent = { top: "0%", center: "50%", bottom: "100%" }[imagePosition];

      return `
      <img
        class="archive-slideshow__image${index === 0 ? " is-active is-revealing" : ""}"
        src="${escapeHtml(image)}"
        alt="${index === 0 ? escapeHtml(alt) : ""}"
        ${index === 0 ? "" : 'aria-hidden="true"'}
        ${detail ? "" : 'loading="lazy"'}
        ${detail ? `data-image-position="${imagePosition}" style="object-position: 50% ${imagePositionPercent}"` : ""}
        decoding="async"
      >
    `;
    }).join("");
  }

  function createImageCounter(item) {
    const imageCount = getImages(item).length;
    if (imageCount < 2) return "";
    return `<span class="archive-slideshow__counter" aria-hidden="true"><span data-slide-current>01</span> / ${pad(imageCount)}</span>`;
  }

  function restartScan(slideshow) {
    const scan = slideshow.querySelector(".record-detail__scan");
    if (!scan) return;
    scan.classList.remove("is-playing");
    void scan.offsetWidth;
    scan.classList.add("is-playing");
  }

  function advanceSlideshow(slideshow) {
    if (document.hidden) return;

    const images = [...slideshow.querySelectorAll(".archive-slideshow__image")];
    if (images.length < 2) return;

    const currentIndex = images.findIndex((image) => image.classList.contains("is-active"));
    const nextIndex = (Math.max(0, currentIndex) + 1) % images.length;

    images.forEach((image, index) => {
      const active = index === nextIndex;
      image.classList.toggle("is-active", active);
      image.classList.remove("is-revealing");
      image.setAttribute("aria-hidden", String(!active));
      image.alt = active ? slideshow.dataset.imageAlt || "" : "";
    });

    images[nextIndex].classList.add("is-revealing");
    const counter = slideshow.querySelector("[data-slide-current]");
    if (counter) counter.textContent = pad(nextIndex + 1);
    restartScan(slideshow);
  }

  function startSlideshows(container) {
    if (prefersReducedMotion) return;

    container.querySelectorAll("[data-slideshow]").forEach((slideshow) => {
      if (slideshow.querySelectorAll(".archive-slideshow__image").length < 2) return;
      const timer = window.setInterval(() => advanceSlideshow(slideshow), imageInterval);
      slideshowTimers.set(slideshow, timer);
    });
  }

  function stopSlideshows(container) {
    slideshowTimers.forEach((timer, slideshow) => {
      if (!container.contains(slideshow)) return;
      window.clearInterval(timer);
      slideshowTimers.delete(slideshow);
    });
  }

  function createInstagramLink(item) {
    const instagramUrl = safeExternalUrl(item.instagram);
    if (!instagramUrl) return "";

    const url = new URL(instagramUrl);
    const handle = url.pathname.split("/").filter(Boolean)[0];
    const label = handle ? `@${handle}` : "Instagram";

    return `
      <a class="record-detail__instagram" href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer">
        <span class="record-detail__instagram-icon" aria-hidden="true"></span>
        <span>${escapeHtml(label)}</span>
        <span class="record-detail__instagram-arrow" aria-hidden="true">↗</span>
      </a>
    `;
  }

  function initializeCategories() {
    if (!filterSelect) return;

    const categories = new Map();
    archive.forEach((item) => categories.set(item.category, item.categoryLabel));

    [...categories.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], "en"))
      .forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label.toUpperCase();
        filterSelect.append(option);
      });
  }

  function getFilteredArchive() {
    const query = state.query.trim().toLocaleLowerCase("ja");

    return archive.filter((item) => {
      const matchesCategory = state.category === "all" || item.category === state.category;
      const searchable = [
        item.id,
        item.name,
        item.nameJa,
        item.categoryLabel,
        item.location,
        item.summary,
        item.summaryEn,
        item.description,
        item.descriptionEn,
        ...(item.traits || [])
      ].join(" ").toLocaleLowerCase("ja");

      return matchesCategory && (!query || searchable.includes(query));
    });
  }

  function createCard(item, index) {
    return `
      <article class="archive-card" style="--card-delay:${index * 70}ms">
        <button class="archive-card__button" type="button" data-record-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.nameJa)}の詳細を表示">
          <span class="archive-card__media archive-slideshow" data-image-alt="${escapeHtml(item.nameJa)}">
            ${createImageMarkup(item, { firstOnly: true })}
            <span class="archive-card__reticle" aria-hidden="true"></span>
            <span class="archive-card__number">FILE ${escapeHtml(item.id)}</span>
            <span class="archive-card__risk archive-card__risk--${escapeHtml(item.risk)}">${escapeHtml(item.riskLabel)}</span>
            <span class="archive-card__inspect">Inspect file <span aria-hidden="true">↗</span></span>
          </span>
          <span class="archive-card__body">
            <span class="archive-card__taxonomy">${escapeHtml(item.categoryLabel)} / ${escapeHtml(item.status)}</span>
            <strong>${escapeHtml(item.name)}</strong>
            <span class="archive-card__japanese">${escapeHtml(item.nameJa)}</span>
            <span class="archive-card__location">${escapeHtml(item.location)} <i></i> ${escapeHtml(item.recorded)}</span>
          </span>
        </button>
      </article>
    `;
  }

  function updateUrl(recordId) {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("page");

      if (!isPreview && state.batch > 1) url.searchParams.set("batch", state.batch);
      else url.searchParams.delete("batch");

      if (recordId) url.searchParams.set("record", recordId);
      else url.searchParams.delete("record");

      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (_) {
      // file:// など履歴APIを利用できない環境でも表示は継続する。
    }
  }

  function renderArchive({ append = false, reset = false } = {}) {
    const filtered = getFilteredArchive();
    const totalBatches = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    if (reset) state.batch = 1;
    state.batch = Math.min(Math.max(1, state.batch), totalBatches);

    const visibleLimit = isPreview ? previewCount : state.batch * itemsPerPage;
    const currentItems = filtered.slice(0, visibleLimit);
    const renderedCount = append ? grid.children.length : 0;
    const newItems = currentItems.slice(renderedCount);

    if (append) {
      grid.insertAdjacentHTML("beforeend", newItems.map((item, index) => createCard(item, renderedCount + index)).join(""));
    } else {
      stopSlideshows(grid);
      grid.innerHTML = currentItems.map(createCard).join("");
    }

    startSlideshows(grid);
    grid.hidden = currentItems.length === 0;
    emptyState.hidden = currentItems.length !== 0;

    filteredCountElements.forEach((element) => {
      element.textContent = pad(filtered.length);
    });
    loadedCountElements.forEach((element) => {
      element.textContent = pad(currentItems.length);
    });

    const hasMore = !isPreview && currentItems.length < filtered.length;
    if (archiveLoad) archiveLoad.hidden = filtered.length === 0;
    if (loadMoreButton) {
      loadMoreButton.disabled = !hasMore;
      loadMoreButton.setAttribute("aria-disabled", String(!hasMore));
    }
    if (archiveSentinel) archiveSentinel.hidden = !hasMore;
    if (archiveEnd) archiveEnd.hidden = filtered.length === 0 || hasMore;

    updateUrl();
  }

  function loadNextBatch() {
    if (isPreview) return;

    const filtered = getFilteredArchive();
    if (state.batch * itemsPerPage >= filtered.length) return;

    state.batch += 1;
    renderArchive({ append: true });
  }

  function updateProtocolUrl(isOpen) {
    try {
      const url = new URL(window.location.href);
      if (isOpen) {
        url.searchParams.set("protocol", "open");
        if (url.hash === "#protocol") url.hash = "";
      } else {
        url.searchParams.delete("protocol");
      }
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (_) {
      // file:// など履歴APIを利用できない環境でも表示は継続する。
    }
  }

  function resetProtocolScroll() {
    if (!protocolModal) return;
    protocolModal.scrollTop = 0;
    const protocolContent = protocolModal.querySelector(".protocol-section");
    if (protocolContent) protocolContent.scrollTop = 0;
  }

  function openProtocol() {
    if (!protocolModal) return;
    if (protocolModal.open) return;
    if (modal.open) closeRecord();

    document.body.classList.add("modal-open");
    if (typeof protocolModal.showModal === "function") protocolModal.showModal();
    else protocolModal.setAttribute("open", "");

    resetProtocolScroll();
    window.requestAnimationFrame(resetProtocolScroll);
    updateProtocolUrl(true);
  }

  function closeProtocol() {
    if (!protocolModal) return;
    if (protocolModal.open && typeof protocolModal.close === "function") protocolModal.close();
    else protocolModal.removeAttribute("open");

    document.body.classList.remove("modal-open");
    updateProtocolUrl(false);
  }

  function resetRecordScroll() {
    modal.scrollTop = 0;
    modalContent.scrollTop = 0;

    const recordDetail = modalContent.querySelector(".record-detail");
    if (recordDetail) {
      recordDetail.scrollTop = 0;
      recordDetail.scrollLeft = 0;
    }
  }

  function openRecord(item) {
    stopSlideshows(modalContent);
    const imageCount = getImages(item).length;

    modalContent.innerHTML = `
      <article class="record-detail">
        <div class="record-detail__visual archive-slideshow" ${imageCount > 1 ? "data-slideshow" : ""} data-image-alt="${escapeHtml(item.nameJa)}の拡大画像">
          ${createImageMarkup(item, { detail: true })}
          <span class="record-detail__scan is-playing" aria-hidden="true"></span>
          <p>Visual record / ${escapeHtml(item.id)}</p>
          ${createImageCounter(item)}
        </div>
        <div class="record-detail__content">
          <div class="record-detail__topline">
            <span>FILE // ${escapeHtml(item.id)}</span>
            <span class="archive-card__risk archive-card__risk--${escapeHtml(item.risk)}">${escapeHtml(item.riskLabel)}</span>
          </div>
          <p class="record-detail__taxonomy">${escapeHtml(item.categoryLabel)} / ${escapeHtml(item.status)}</p>
          <h2 id="modal-title">${escapeHtml(item.name)}</h2>
          <p class="record-detail__ja">${escapeHtml(item.nameJa)}</p>
          ${createInstagramLink(item)}
          <div class="record-detail__summary record-detail__bilingual">
            <p lang="ja">${escapeHtml(item.summary)}</p>
            ${item.summaryEn ? `<p class="record-detail__english" lang="en"><span>EN</span>${escapeHtml(item.summaryEn)}</p>` : ""}
          </div>
          <div class="record-detail__description record-detail__bilingual">
            <p lang="ja">${escapeHtml(item.description)}</p>
            ${item.descriptionEn ? `<p class="record-detail__english" lang="en"><span>EN</span>${escapeHtml(item.descriptionEn)}</p>` : ""}
          </div>
          <dl class="record-detail__meta">
            <div><dt>Location</dt><dd>${escapeHtml(item.location)}</dd></div>
            <div><dt>Recorded</dt><dd>${escapeHtml(item.recorded)}</dd></div>
            <div><dt>Status</dt><dd>${escapeHtml(item.status)}</dd></div>
          </dl>
          <div class="record-detail__traits">
            ${(item.traits || []).map((trait) => `<span>${escapeHtml(trait)}</span>`).join("")}
          </div>
        </div>
      </article>
    `;

    startSlideshows(modalContent);

    updateUrl(item.id);
    document.body.classList.add("modal-open");

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");

    resetRecordScroll();
    window.requestAnimationFrame(resetRecordScroll);
  }

  function closeRecord() {
    stopSlideshows(modalContent);
    if (modal.open && typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");

    document.body.classList.remove("modal-open");
    updateUrl();
  }

  searchInput?.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderArchive({ reset: true });
  });

  filterSelect?.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderArchive({ reset: true });
  });

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-record-id]");
    if (!trigger) return;
    const item = archive.find((record) => record.id === trigger.dataset.recordId);
    if (item) openRecord(item);
  });

  loadMoreButton?.addEventListener("click", loadNextBatch);

  protocolOpenButtons.forEach((button) => {
    button.addEventListener("click", openProtocol);
  });
  protocolClose?.addEventListener("click", closeProtocol);
  protocolModal?.addEventListener("click", (event) => {
    if (event.target === protocolModal) closeProtocol();
  });
  protocolModal?.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    updateProtocolUrl(false);
  });

  modalClose.addEventListener("click", closeRecord);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeRecord();
  });
  modal.addEventListener("close", () => {
    stopSlideshows(modalContent);
    document.body.classList.remove("modal-open");
    updateUrl();
  });

  document.querySelectorAll("[data-total-records]").forEach((element) => {
    element.textContent = pad(archive.length, 3);
  });

  initializeCategories();
  renderArchive();

  if (!isPreview && archiveSentinel && "IntersectionObserver" in window) {
    const loadObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadNextBatch();
    }, { rootMargin: "320px 0px" });

    loadObserver.observe(archiveSentinel);
  }

  const requestedRecord = initialParams.get("record");
  if (initialParams.get("protocol") === "open" || window.location.hash === "#protocol") {
    openProtocol();
  } else if (requestedRecord) {
    const item = archive.find((record) => record.id === requestedRecord);
    if (item) openRecord(item);
  }
})();
