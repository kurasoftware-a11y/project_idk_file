(function () {
  "use strict";
  const regions = {
    all: { name: "世界全体", english: "Global view", lat: 25, lng: 35, altitude: 2.5 },
    asia: { name: "アジア", english: "Asia", lat: 32, lng: 120, altitude: 1.6 },
    europe: { name: "ヨーロッパ", english: "Europe", lat: 50, lng: 8, altitude: 1.4 },
    africa: { name: "アフリカ", english: "Africa", lat: 7, lng: 16, altitude: 1.6 },
    northAmerica: { name: "北アメリカ", english: "North America", lat: 35, lng: -105, altitude: 1.7 },
    southAmerica: { name: "南アメリカ", english: "South America", lat: -17, lng: -65, altitude: 1.7 },
    other: { name: "その他の地域", english: "Other locations", lat: 0, lng: 150, altitude: 2.5 }
  };
  const countryRegions = { JP: "asia", GB: "europe", IE: "europe", SI: "europe", GH: "africa", US: "northAmerica", BO: "southAmerica", CO: "southAmerica", BR: "southAmerica", CL: "southAmerica" };
  const radians = Math.PI / 180;
  function center(points) {
    const sum = points.reduce((s, p) => [s[0] + Math.cos(p.lat * radians) * Math.cos(p.lng * radians), s[1] + Math.cos(p.lat * radians) * Math.sin(p.lng * radians), s[2] + Math.sin(p.lat * radians)], [0, 0, 0]);
    return { lat: Math.atan2(sum[2], Math.hypot(sum[0], sum[1])) / radians, lng: Math.atan2(sum[1], sum[0]) / radians };
  }
  function distance(a, b) {
    const cosine = Math.sin(a.lat * radians) * Math.sin(b.lat * radians) + Math.cos(a.lat * radians) * Math.cos(b.lat * radians) * Math.cos((a.lng - b.lng) * radians);
    return Math.acos(Math.min(1, Math.max(-1, cosine))) / radians;
  }
  function countriesFrom(records) {
    const countries = new Map();
    records.forEach(record => {
      if (!record.countryCode || !Array.isArray(record.coordinates)) return;
      const [lng, lat] = record.coordinates;
      if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
      if (!countries.has(record.countryCode)) countries.set(record.countryCode, {
        code: record.countryCode, numeric: String(record.countryNumeric || "").padStart(3, "0"),
        name: record.countryNameJa || record.countryName, english: record.countryName || record.countryCode,
        region: countryRegions[record.countryCode] || "other", records: []
      });
      countries.get(record.countryCode).records.push(record);
    });
    return [...countries.values()].map(country => ({ ...country, ...center(country.records.map(r => ({ lng: r.coordinates[0], lat: r.coordinates[1] }))) }));
  }
  function clustersFrom(countries, angularThreshold) {
    const groups = [];
    countries.forEach(country => {
      const group = groups.find(g => g.members.every(member => distance(member, country) < angularThreshold));
      if (group) { group.members.push(country); Object.assign(group, center(group.members)); }
      else groups.push({ ...center([country]), members: [country] });
    });
    return groups.map(group => ({ ...group, count: group.members.reduce((n, c) => n + c.records.length, 0), key: group.members.map(c => c.code).sort().join("-") }));
  }
  globalThis.IDK_GLOBE_MODEL = { regions, countriesFrom, clustersFrom };
})();
