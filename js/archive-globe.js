(function () {
  "use strict";

  const archiveSection = document.getElementById("archive");
  const globeElement = document.getElementById("archive-globe");
  const globeShell = archiveSection?.querySelector("[data-globe-shell]");
  const orbitReadout = archiveSection?.querySelector("[data-orbit-readout]");
  const grid = document.getElementById("archive-grid");
  if (!archiveSection || !globeElement || !globeShell || !grid) return;

  const GLOBE_SCRIPT = "https://cdn.jsdelivr.net/npm/globe.gl@2.46.2/dist/globe.gl.min.js";
  const TOPOJSON_SCRIPT = "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js";
  const COUNTRIES_DATA = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

  const archive = Array.isArray(window.IDK_ARCHIVE) ? window.IDK_ARCHIVE : [];
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const records = archive
    .filter((item) => Array.isArray(item.coordinates) && item.coordinates.length === 2 && item.countryCode)
    .map((item) => ({
      ...item,
      lng: Number(item.coordinates[0]),
      lat: Number(item.coordinates[1])
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
  const recordsById = new Map(records.map((item) => [item.id, item]));
  const activeCountryNumbers = new Map(
    records.map((item) => [String(item.countryNumeric || "").padStart(3, "0"), item.countryCode])
  );

  let globe = null;
  let countryFeatures = [];
  let activeRecordId = null;
  let initialized = false;
  let ready = false;
  let rotationResumeTimer = 0;
  let pulseClearTimer = 0;
  let globeVisible = false;

  function syncAnimation() {
    if (!globe || !ready) return;
    if (globeVisible && !document.hidden && !document.body.classList.contains("modal-open")) {
      globe.resumeAnimation();
    } else {
      globe.pauseAnimation();
    }
  }

  function loadScript(src, globalName) {
    if (window[globalName]) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.append(script);
    });
  }

  function supportsWebGl() {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch (_) {
      return false;
    }
  }

  function resizeGlobe() {
    if (!globe) return;
    const width = Math.max(320, Math.round(globeElement.clientWidth));
    const height = Math.max(420, Math.round(globeElement.clientHeight));
    globe.width(width).height(height);
  }

  function getActiveRecord() {
    return activeRecordId ? recordsById.get(activeRecordId) || null : null;
  }

  function refreshGlobeLayers() {
    if (!globe) return;
    const activeRecord = getActiveRecord();

    globe
      .polygonCapColor((feature) => {
        const countryCode = feature.archiveCountryCode;
        if (!countryCode) return "rgba(66, 82, 75, 0.025)";
        if (countryCode === activeRecord?.countryCode) return "rgba(185, 255, 79, 0.34)";
        return "rgba(185, 255, 79, 0.075)";
      })
      .polygonSideColor((feature) => feature.archiveCountryCode
        ? "rgba(185, 255, 79, 0.07)"
        : "rgba(34, 48, 43, 0.01)")
      .polygonStrokeColor((feature) => feature.archiveCountryCode
        ? "rgba(185, 255, 79, 0.3)"
        : "rgba(108, 130, 121, 0.075)")
      .polygonAltitude((feature) => feature.archiveCountryCode === activeRecord?.countryCode ? 0.014 : 0.005)
      .pointColor((item) => item.id === activeRecordId
        ? "rgba(235, 255, 204, 0.96)"
        : "rgba(185, 255, 79, 0.42)")
      .pointAltitude((item) => item.id === activeRecordId ? 0.06 : 0.018)
      .pointRadius((item) => item.id === activeRecordId ? 0.42 : 0.2);
  }

  function emitSinglePulse(record) {
    if (!globe || prefersReducedMotion) return;

    window.clearTimeout(pulseClearTimer);
    globe.ringsData([]);
    window.requestAnimationFrame(() => {
      if (!globe || activeRecordId !== record.id) return;
      globe.ringsData([{ ...record, pulseKey: Date.now() }]);
      pulseClearTimer = window.setTimeout(() => globe?.ringsData([]), 3600);
    });
  }

  function setActiveCard(recordId) {
    const record = recordsById.get(recordId);
    if (!record || record.id === activeRecordId) return;

    activeRecordId = record.id;
    if (orbitReadout) {
      orbitReadout.textContent = `FILE ${record.id} / ${String(record.countryName || record.countryCode).toUpperCase()}`;
    }
    grid.querySelectorAll(".archive-card.is-map-active").forEach((card) => {
      card.classList.remove("is-map-active");
    });
    grid.querySelector(`[data-record-id="${record.id}"]`)?.closest(".archive-card")?.classList.add("is-map-active");

    refreshGlobeLayers();
    emitSinglePulse(record);

    if (!globe || prefersReducedMotion) return;
    const orbit = globe.controls();
    orbit.autoRotate = false;
    globe.pointOfView(
      { lat: record.lat, lng: record.lng, altitude: coarsePointer ? 2.05 : 1.82 },
      prefersReducedMotion ? 0 : 950
    );

    window.clearTimeout(rotationResumeTimer);
    if (!prefersReducedMotion) {
      rotationResumeTimer = window.setTimeout(() => {
        if (globe) globe.controls().autoRotate = true;
      }, 4200);
    }
  }

  function resetActiveCard() {
    activeRecordId = null;
    if (orbitReadout) {
      orbitReadout.textContent = `GLOBAL SWEEP / ${String(records.length).padStart(3, "0")} SIGNALS`;
    }
    grid.querySelectorAll(".archive-card.is-map-active").forEach((card) => {
      card.classList.remove("is-map-active");
    });
    if (globe) globe.ringsData([]);
    refreshGlobeLayers();
  }

  function getRecordIdFromCard(card) {
    return card?.querySelector("[data-record-id]")?.dataset.recordId || "";
  }

  function resetRemovedCard() {
    if (activeRecordId && !grid.querySelector(`[data-record-id="${activeRecordId}"]`)) {
      resetActiveCard();
    }
  }

  grid.addEventListener("pointerover", (event) => {
    const card = event.target.closest(".archive-card");
    const recordId = getRecordIdFromCard(card);
    if (recordId) setActiveCard(recordId);
  });
  grid.addEventListener("focusin", (event) => {
    const card = event.target.closest(".archive-card");
    const recordId = getRecordIdFromCard(card);
    if (recordId) setActiveCard(recordId);
  });

  const gridObserver = new MutationObserver(resetRemovedCard);
  gridObserver.observe(grid, { childList: true });

  async function initializeGlobe() {
    if (initialized) return;
    initialized = true;

    if (!supportsWebGl()) {
      globeShell.hidden = true;
      return;
    }

    try {
      await Promise.all([
        loadScript(GLOBE_SCRIPT, "Globe"),
        loadScript(TOPOJSON_SCRIPT, "topojson")
      ]);

      const response = await fetch(COUNTRIES_DATA);
      if (!response.ok) throw new Error(`Country data request failed: ${response.status}`);
      const topology = await response.json();
      const world = window.topojson.feature(topology, topology.objects.countries);

      countryFeatures = world.features.map((feature) => {
        const numeric = String(feature.id ?? "").padStart(3, "0");
        feature.archiveCountryCode = activeCountryNumbers.get(numeric) || null;
        return feature;
      });

      globe = new window.Globe(globeElement, {
        animateIn: !prefersReducedMotion,
        rendererConfig: {
          antialias: !coarsePointer,
          alpha: true,
          powerPreference: coarsePointer ? "low-power" : "high-performance"
        }
      })
        .backgroundColor("rgba(0, 0, 0, 0)")
        .showAtmosphere(!coarsePointer)
        .atmosphereColor("#6f9d77")
        .atmosphereAltitude(0.11)
        .showGraticules(!coarsePointer)
        .globeCurvatureResolution(coarsePointer ? 8 : 6)
        .polygonCapCurvatureResolution(coarsePointer ? 9 : 7)
        .polygonsTransitionDuration(prefersReducedMotion ? 0 : 420)
        .pointLat("lat")
        .pointLng("lng")
        .pointResolution(coarsePointer ? 5 : 8)
        .pointsTransitionDuration(prefersReducedMotion ? 0 : 480)
        .ringLat("lat")
        .ringLng("lng")
        .ringAltitude(0.012)
        .ringColor(() => ["rgba(235, 255, 204, 0.9)", "rgba(185, 255, 79, 0.01)"])
        .ringResolution(coarsePointer ? 28 : 44)
        .ringMaxRadius(coarsePointer ? 3.2 : 4.6)
        .ringPropagationSpeed(coarsePointer ? 1.1 : 1.45)
        .ringRepeatPeriod(0)
        .enablePointerInteraction(false)
        .onGlobeReady(() => {
          ready = true;
          globeShell.classList.add("is-ready");
          syncAnimation();
        });

      const material = globe.globeMaterial();
      material.color?.set?.("#07100d");
      material.emissive?.set?.("#020705");
      material.emissiveIntensity = 0.34;
      material.shininess = 6;

      const renderer = globe.renderer();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1 : 1.6));
      renderer.domElement.style.pointerEvents = "none";

      const orbit = globe.controls();
      orbit.enabled = false;
      orbit.autoRotate = !prefersReducedMotion;
      orbit.autoRotateSpeed = 0.16;
      orbit.enableDamping = true;
      orbit.dampingFactor = 0.08;

      refreshGlobeLayers();
      globe.polygonsData(countryFeatures).pointsData(records);
      resizeGlobe();
      globe.pointOfView({ lat: 18, lng: 25, altitude: coarsePointer ? 2.75 : 2.35 }, 0);

      const resizeObserver = new ResizeObserver(resizeGlobe);
      resizeObserver.observe(globeElement);

      const visibilityObserver = new IntersectionObserver((entries) => {
        globeVisible = entries.some((entry) => entry.isIntersecting);
        syncAnimation();
      });
      visibilityObserver.observe(globeElement);

      document.addEventListener("visibilitychange", syncAnimation);
      const modalObserver = new MutationObserver(syncAnimation);
      modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      syncAnimation();
    } catch (error) {
      console.error("IDK archive globe initialization failed", error);
      globeShell.hidden = true;
    }
  }

  if ("IntersectionObserver" in window) {
    const loader = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      initializeGlobe();
    }, { rootMargin: "420px" });
    loader.observe(globeElement);
  } else {
    initializeGlobe();
  }
})();
