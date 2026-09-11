(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("from") === "globe") {
    const returnUrl = new URL("../../globe.html", window.location.href);
    const country = params.get("country");
    const region = params.get("region");
    if (/^[A-Z]{2}$/.test(country || "")) returnUrl.searchParams.set("country", country);
    if (["asia", "europe", "africa", "northAmerica", "southAmerica", "other"].includes(region)) returnUrl.searchParams.set("region", region);
    const returnLink = document.createElement("a");
    returnLink.className = "record-page__globe-return";
    returnLink.href = returnUrl.href;
    returnLink.textContent = "← 地球儀へ戻る";
    document.querySelector(".record-page__breadcrumb")?.before(returnLink);
    document.querySelectorAll(".record-page__pager a").forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set("from", "globe");
      if (country) url.searchParams.set("country", country);
      if (region) url.searchParams.set("region", region);
      link.href = url.href;
    });
  }

  const slideshow = document.querySelector("[data-record-slideshow]");
  if (!slideshow) return;

  const images = [...slideshow.querySelectorAll(".archive-slideshow__image")];
  const controls = [...slideshow.querySelectorAll("[data-slide-index]")];
  if (images.length < 2) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  let activeIndex = 0;
  let timer = null;

  function show(index) {
    activeIndex = ((index % images.length) + images.length) % images.length;
    images.forEach((image, imageIndex) => {
      const active = imageIndex === activeIndex;
      image.classList.toggle("is-active", active);
      image.setAttribute("aria-hidden", String(!active));
    });
    controls.forEach((control, controlIndex) => {
      const active = controlIndex === activeIndex;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-current", String(active));
    });
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    if (!reducedMotion && !document.hidden) {
      timer = window.setInterval(() => show(activeIndex + 1), 5000);
    }
  }

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      show(Number.parseInt(control.dataset.slideIndex, 10));
      start();
    });
  });

  document.addEventListener("visibilitychange", start);
  show(0);
  start();
})();
