(function () {
  "use strict";

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
