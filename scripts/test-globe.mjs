import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = vm.createContext({});
context.window = context;
for (const filename of ["archive-data.js", "globe-model.js"]) {
  vm.runInContext(fs.readFileSync(new URL(`../js/${filename}`, import.meta.url), "utf8"), context);
}
const { countriesFrom, clustersFrom } = context.IDK_GLOBE_MODEL;
const records = context.IDK_ARCHIVE;
const countries = countriesFrom(records);

test("country grouping includes every archive record exactly once", () => {
  assert.equal(countries.reduce((sum, country) => sum + country.records.length, 0), records.length);
  assert.equal(countries.find(country => country.code === "JP").records.length, 4);
  assert.equal(countries.length, 10);
  assert.equal(new Set(countries.flatMap(country => country.records.map(record => record.id))).size, records.length);
});

test("clustering nearby countries preserves counts and separates on zoom", () => {
  const europe = countries.filter(country => country.region === "europe");
  const worldView = clustersFrom(europe, 23);
  const closeView = clustersFrom(europe, 2);
  assert.equal(worldView.length, 1);
  assert.equal(worldView[0].count, 3);
  assert.equal(closeView.length, 3);
  for (const threshold of [2, 5, 10, 15, 23, 35]) {
    const groups = clustersFrom(countries, threshold);
    assert.equal(groups.reduce((sum, group) => sum + group.count, 0), records.length);
    assert.equal(new Set(groups.flatMap(group => group.members.map(country => country.code))).size, countries.length);
  }
});

test("missing and invalid coordinates cannot break the globe", () => {
  const invalid = [null, [], [0, NaN], [0, 91], [181, 0], ["0", 0]];
  const result = countriesFrom(invalid.map(coordinates => ({ ...records[0], coordinates })));
  assert.equal(result.length, 0);
});

test("country centers across the date line stay near their observations", () => {
  const sample = countriesFrom([
    { ...records[0], coordinates: [179, 10] },
    { ...records[0], id: "test", coordinates: [-179, 10] }
  ]);
  assert.ok(Math.abs(sample[0].lng) > 179);
  assert.ok(Math.abs(sample[0].lat - 10) < 1);
});

test("all record routes, thumbnails and new page assets exist", () => {
  for (const record of records) {
    assert.ok(fs.existsSync(new URL(`../archive/${record.slug}/index.html`, import.meta.url)), record.slug);
    const images = Array.isArray(record.image) ? record.image : [record.image];
    for (const image of images) assert.ok(fs.existsSync(new URL(`../${image}`, import.meta.url)), image);
  }
  const page = fs.readFileSync(new URL("../globe.html", import.meta.url), "utf8");
  for (const match of page.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"?]+)(?:\?[^"]*)?"/g)) {
    assert.ok(fs.existsSync(new URL(`../${match[1]}`, import.meta.url)), match[1]);
  }
});
