(function () {
  "use strict";
  const { regions, countriesFrom, clustersFrom } = window.IDK_GLOBE_MODEL;
  const records = [...(window.IDK_ARCHIVE || [])].sort((a, b) => Number(b.id) - Number(a.id));
  const countries = countriesFrom(records);
  const countryByCode = new Map(countries.map(c => [c.code, c]));
  const countryByNumeric = new Map(countries.map(c => [c.numeric, c]));
  const regionSelect = document.getElementById("globe-region");
  const countrySelect = document.getElementById("globe-country");
  const list = document.getElementById("globe-records");
  const viewport = document.getElementById("globe-viewport");
  const mount = document.getElementById("explorer-globe");
  const status = document.getElementById("globe-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const initial = new URLSearchParams(location.search);
  const state = { country: countryByCode.has(initial.get("country")) ? initial.get("country") : "all", region: Object.hasOwn(regions, initial.get("region")) ? initial.get("region") : "all" };
  if (state.country !== "all") state.region = countryByCode.get(state.country).region;
  let globe, ready = false, disposed = false, visible = true, markerKey = "", zoomTimer;
  let gestureStart, dragDistance = 0;
  const storageKey = "idk-globe-view";
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const pad = number => String(number).padStart(2, "0");
  const availableCountries = () => countries.filter(c => state.region === "all" || c.region === state.region);
  const selectionKey = () => `${state.region}/${state.country}`;
  function readSavedView() { try { return JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) { return null; } }
  function saveView() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ key: selectionKey(), pov: globe?.pointOfView(), scroll: list.scrollTop })); } catch (_) { /* Storage is optional. */ }
  }
  function updateUrl() {
    const url = new URL(location.href);
    if (state.region === "all") url.searchParams.delete("region"); else url.searchParams.set("region", state.region);
    if (state.country === "all") url.searchParams.delete("country"); else url.searchParams.set("country", state.country);
    history.replaceState(null, "", `${url.pathname}${url.search}`);
  }
  function renderCountries() {
    const options = availableCountries().sort((a, b) => a.name.localeCompare(b.name, "ja"));
    countrySelect.innerHTML = '<option value="all">すべての国</option>' + options.map(c => `<option value="${escape(c.code)}">${escape(c.name)} · ${c.records.length}件</option>`).join("");
    countrySelect.value = state.country;
    regionSelect.value = state.region;
  }
  function renderResults() {
    const selected = countryByCode.get(state.country);
    const visibleCodes = new Set(availableCountries().map(c => c.code));
    const filtered = records.filter(record => selected ? record.countryCode === selected.code : visibleCodes.has(record.countryCode));
    const title = selected?.name || (state.region === "all" ? "世界の観測記録" : regions[state.region].name);
    document.getElementById("globe-results-title").textContent = title;
    document.getElementById("globe-results-eyebrow").textContent = selected?.english || (state.region === "all" ? "All locations" : regions[state.region].english);
    document.getElementById("globe-results-count").textContent = pad(filtered.length);
    document.getElementById("globe-results-hint").textContent = selected ? "カードから観測記録を開けます。" : "国・マーカーから記録を絞り込めます。";
    document.getElementById("globe-announcement").textContent = `${title}、${filtered.length}件の記録`;
    document.getElementById("globe-readout").textContent = selected?.english || regions[state.region].english;
    list.innerHTML = filtered.map(record => {
      const source = Array.isArray(record.image) ? record.image[0] : record.image;
      const thumbnail = window.IDK_THUMBNAILS?.[source] || source;
      const position = [record.thumbnailPosition, record.imagePosition].map(p => Array.isArray(p) ? p[0] : p).find(p => ["top", "center", "bottom"].includes(p)) || "center";
      const params = new URLSearchParams({ from: "globe", region: state.region, country: state.country });
      return `<a class="atlas-record" href="archive/${encodeURIComponent(record.slug || record.id)}/?${params}" data-globe-record="${escape(record.id)}">
        <img src="${escape(thumbnail)}" alt="" width="96" height="134" loading="lazy" decoding="async" style="object-position:center ${position}">
        <span class="atlas-record__body"><span class="atlas-record__meta">FILE ${escape(record.id)} / ${escape(record.countryCode)}</span><strong>${escape(record.nameJa)}</strong><span class="atlas-record__summary">${escape(record.summary)}</span><span class="atlas-record__action">観測記録を開く <span aria-hidden="true">↗</span></span></span>
      </a>`;
    }).join("") || '<p class="atlas-results-hint">この地域の記録はまだありません。</p>';
    list.scrollTop = 0;
  }
  function refreshLayers() {
    if (!globe) return;
    globe.polygonCapColor(feature => {
      const country = countryByNumeric.get(String(feature.id).padStart(3, "0"));
      if (country?.code === state.country) return "rgba(185,255,79,.32)";
      if (country && (state.region === "all" || country.region === state.region)) return "rgba(185,255,79,.11)";
      return "rgba(79,105,87,.045)";
    }).polygonStrokeColor(feature => countryByNumeric.has(String(feature.id).padStart(3, "0")) ? "rgba(185,255,79,.4)" : "rgba(132,161,140,.15)");
    refreshMarkers();
  }
  function refreshMarkers() {
    if (!globe || disposed) return;
    const altitude = globe.pointOfView().altitude;
    // Increase the grouping radius on compact screens. Country selection also works via the select.
    const threshold = Math.max(2, (altitude - .25) * (viewport.clientWidth < 600 ? 9 : 6));
    const markerCountries = state.country === "all" ? availableCountries() : [countryByCode.get(state.country)];
    const groups = clustersFrom(markerCountries, threshold);
    const key = `${state.country}:${groups.map(g => g.key).join("|")}`;
    if (key === markerKey) return;
    markerKey = key;
    globe.htmlElementsData(groups);
  }
  function setView(pov, animate = true) {
    if (!globe) return;
    globe.pointOfView(pov, reducedMotion || !animate ? 0 : 650);
    window.clearTimeout(zoomTimer);
    zoomTimer = window.setTimeout(refreshMarkers, reducedMotion || !animate ? 0 : 700);
  }
  function select({ region = state.region, country = "all" }, { animate = true } = {}) {
    state.country = countryByCode.has(country) ? country : "all";
    state.region = state.country !== "all" ? countryByCode.get(state.country).region : Object.hasOwn(regions, region) ? region : "all";
    renderCountries(); renderResults(); updateUrl();
    markerKey = "";
    refreshLayers();
    const selected = countryByCode.get(state.country);
    setView(selected ? { lat: selected.lat, lng: selected.lng, altitude: 1.15 } : regions[state.region], animate);
  }
  function markerElement(group) {
    const button = document.createElement("button");
    const isCluster = group.members.length > 1;
    button.type = "button"; button.tabIndex = -1;
    button.className = `atlas-marker${isCluster ? " is-cluster" : ""}${group.members.some(c => c.code === state.country) ? " is-selected" : ""}`;
    button.title = `${group.members.map(c => c.name).join("・")} / ${group.count}件${isCluster ? " — 拡大して選択" : ""}`;
    button.setAttribute("aria-label", button.title);
    button.dataset.countries = group.key;
    const number = document.createElement("span"); number.textContent = group.count; button.append(number);
    let start;
    button.addEventListener("pointerdown", event => { event.stopPropagation(); start = { x: event.clientX, y: event.clientY }; });
    button.addEventListener("click", event => {
      event.stopPropagation();
      if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) return;
      if (isCluster) setView({ lat: group.lat, lng: group.lng, altitude: Math.max(.45, globe.pointOfView().altitude * .45) });
      else select({ country: group.members[0].code });
    });
    return button;
  }
  function syncAnimation() {
    if (!globe || !ready) return;
    if (visible && !document.hidden && !disposed) globe.resumeAnimation(); else globe.pauseAnimation();
  }
  function showFailure() {
    if (disposed) return;
    status.hidden = false;
    status.innerHTML = '<span class="atlas-kicker">Map unavailable</span><p>地球儀を表示できませんでした。上の地域・国名から、すべての記録を探せます。</p>';
    document.querySelectorAll(".atlas-map-controls button").forEach(button => { button.disabled = true; });
    document.getElementById("globe-gesture-hint").textContent = "地域・国名から選択できます";
    ready = false;
    globe?.pauseAnimation();
  }
  function loadScript(src, globalName) {
    if (window[globalName]) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const timer = setTimeout(() => reject(new Error("Map script timed out")), 15000);
      script.src = src; script.async = true; script.crossOrigin = "anonymous";
      script.onload = () => { clearTimeout(timer); window[globalName] ? resolve() : reject(new Error("Map library missing")); };
      script.onerror = () => { clearTimeout(timer); reject(new Error("Map script unavailable")); };
      document.head.append(script);
    });
  }
  async function initializeGlobe() {
    try {
      await Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/globe.gl@2.46.2/dist/globe.gl.min.js", "Globe"),
        loadScript("https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js", "topojson")
      ]);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      let topology;
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json", { signal: controller.signal });
        if (!response.ok) throw new Error("Map data unavailable");
        topology = await response.json();
      } finally { clearTimeout(timeout); }
      if (disposed) return;
      const features = window.topojson.feature(topology, topology.objects.countries).features;
      globe = new window.Globe(mount, { animateIn: false, rendererConfig: { antialias: !coarsePointer, alpha: true, powerPreference: "low-power" } })
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true).atmosphereColor("#53795e").atmosphereAltitude(.1)
        .showGraticules(false).globeCurvatureResolution(coarsePointer ? 8 : 6)
        .polygonsData(features).polygonAltitude(.006).polygonSideColor(() => "rgba(185,255,79,.025)")
        .polygonCapCurvatureResolution(coarsePointer ? 9 : 6).polygonsTransitionDuration(0)
        .polygonLabel(() => "")
        .onPolygonClick(feature => {
          if (dragDistance > 8) return;
          const country = countryByNumeric.get(String(feature.id).padStart(3, "0"));
          if (country) select({ country: country.code });
        })
        .htmlLat("lat").htmlLng("lng").htmlAltitude(.015).htmlElement(markerElement)
        .htmlTransitionDuration(0)
        .onZoom(() => { window.clearTimeout(zoomTimer); zoomTimer = window.setTimeout(refreshMarkers, 100); })
        .onGlobeReady(() => {
          ready = true; status.hidden = true;
          document.querySelectorAll(".atlas-map-controls button").forEach(button => { button.disabled = false; });
          syncAnimation();
        });
      const material = globe.globeMaterial();
      material.color.set("#09130e"); material.emissive.set("#020805"); material.emissiveIntensity = .4; material.shininess = 6;
      const renderer = globe.renderer();
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer ? 1.25 : 1.6));
      renderer.domElement.addEventListener("webglcontextlost", event => { event.preventDefault(); showFailure(); });
      const controls = globe.controls();
      controls.autoRotate = false; controls.enablePan = false; controls.enableDamping = true;
      controls.minDistance = globe.getGlobeRadius() * 1.45; controls.maxDistance = globe.getGlobeRadius() * 4.5;
      const resize = () => {
        globe.width(Math.max(1, viewport.clientWidth)).height(Math.max(1, viewport.clientHeight));
        markerKey = ""; refreshMarkers();
      };
      new ResizeObserver(resize).observe(viewport);
      new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); syncAnimation(); }).observe(viewport);
      resize(); refreshLayers();
      const saved = readSavedView();
      const selected = countryByCode.get(state.country);
      const pov = saved?.key === selectionKey() && validPov(saved.pov) ? saved.pov : selected ? { lat: selected.lat, lng: selected.lng, altitude: 1.15 } : regions[state.region];
      setView(pov, false);
    } catch (_) { showFailure(); }
  }
  function validPov(pov) { return pov && Number.isFinite(pov.lat) && Math.abs(pov.lat) <= 90 && Number.isFinite(pov.lng) && Number.isFinite(pov.altitude) && pov.altitude >= .45 && pov.altitude <= 3.5; }
  document.getElementById("globe-total").textContent = pad(records.length);
  document.getElementById("globe-country-total").textContent = pad(countries.length);
  Object.entries(regions).forEach(([value, region]) => {
    if (value !== "all" && countries.some(c => c.region === value)) regionSelect.add(new Option(region.name, value));
  });
  if (!countries.some(c => c.region === state.region) && state.region !== "all") state.region = "all";
  if (coarsePointer) document.getElementById("globe-gesture-hint").textContent = "スワイプで回転 · マーカーをタップ";
  regionSelect.addEventListener("change", () => select({ region: regionSelect.value }));
  countrySelect.addEventListener("change", () => select({ country: countrySelect.value }));
  document.getElementById("globe-reset").addEventListener("click", () => select({ region: "all" }));
  document.getElementById("globe-zoom-in").addEventListener("click", () => { if (globe) setView({ ...globe.pointOfView(), altitude: Math.max(.45, globe.pointOfView().altitude * .65) }); });
  document.getElementById("globe-zoom-out").addEventListener("click", () => { if (globe) setView({ ...globe.pointOfView(), altitude: Math.min(3.5, globe.pointOfView().altitude * 1.5) }); });
  mount.addEventListener("pointerdown", event => { gestureStart = { x: event.clientX, y: event.clientY }; dragDistance = 0; }, true);
  mount.addEventListener("pointermove", event => { if (gestureStart) dragDistance = Math.max(dragDistance, Math.hypot(event.clientX - gestureStart.x, event.clientY - gestureStart.y)); }, true);
  window.addEventListener("pointerup", () => { gestureStart = null; });
  window.addEventListener("pointercancel", () => { gestureStart = null; });
  list.addEventListener("click", event => { if (event.target.closest("[data-globe-record]")) saveView(); });
  document.addEventListener("visibilitychange", syncAnimation);
  window.addEventListener("pagehide", () => { saveView(); disposed = true; clearTimeout(zoomTimer); syncAnimation(); });
  window.addEventListener("pageshow", event => { if (event.persisted) { disposed = false; syncAnimation(); } });
  try {
    if (sessionStorage.getItem("idk-archive-return")) document.querySelector("[data-archive-return]").href = "index.html?resume=globe";
  } catch (_) { /* A regular archive link is always available. */ }
  renderCountries(); renderResults(); updateUrl();
  const saved = readSavedView();
  if (saved?.key === selectionKey() && Number.isFinite(saved.scroll)) list.scrollTop = saved.scroll;
  initializeGlobe();
})();
