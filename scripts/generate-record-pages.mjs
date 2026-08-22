import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");

globalThis.window = {};
await import(new URL("../js/archive-data.js", import.meta.url));

const records = globalThis.window.IDK_ARCHIVE;
if (!Array.isArray(records) || records.length === 0) {
  throw new Error("Archive data could not be loaded.");
}

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;"
})[character]);

function getImages(record) {
  const images = Array.isArray(record.image) ? record.image : [record.image];
  return images.filter(Boolean);
}

function getImagePosition(record, index) {
  const position = Array.isArray(record.imagePosition)
    ? record.imagePosition[index]
    : record.imagePosition;
  return ["top", "center", "bottom"].includes(position) ? position : "center";
}

function getPngDimensions(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  if (buffer.toString("ascii", 1, 4) !== "PNG") return {};
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function createImages(record) {
  return getImages(record).map((image, index) => {
    const { width, height } = getPngDimensions(image);
    const active = index === 0;
    return `
            <img
              class="archive-slideshow__image${active ? " is-active" : ""}"
              src="../../${escapeHtml(image)}"
              alt="${active ? escapeHtml(`${record.nameJa}の観測画像`) : ""}"
              width="${width}"
              height="${height}"
              data-image-position="${getImagePosition(record, index)}"
              ${active ? 'fetchpriority="high"' : 'loading="lazy" aria-hidden="true"'}
              decoding="async"
            >`;
  }).join("");
}

function createIndicators(record) {
  const count = getImages(record).length;
  if (count < 2) return "";
  return `
            <div class="archive-slideshow__indicators" role="group" aria-label="表示画像を選択">
${Array.from({ length: count }, (_, index) => `              <button class="archive-slideshow__indicator${index === 0 ? " is-active" : ""}" type="button" data-slide-index="${index}" aria-label="画像 ${index + 1} / ${count} を表示" aria-current="${index === 0}"><span aria-hidden="true"></span></button>`).join("\n")}
            </div>`;
}

function createPage(record, index) {
  const previous = records[(index - 1 + records.length) % records.length];
  const next = records[(index + 1) % records.length];
  const title = `${record.nameJa}（${record.name}）｜未確認生命体観測記録｜IDK FILE`;
  const description = `${record.summary} IDK FILEに収蔵されたフィクション観測記録。`;
  const recordedDate = String(record.recorded).replaceAll(".", "-");

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#050807">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <title>${escapeHtml(title)}</title>
    <link rel="icon" type="image/png" sizes="32x32" href="../../assets/favicon-32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../assets/favicon-16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/apple-touch-icon.png">
    <link rel="preload" as="image" href="../../${escapeHtml(getImages(record)[0])}">
    <link rel="stylesheet" href="../../css/style.css?v=20260822-1">
    <script src="../../js/record-page.js?v=20260822-1" defer></script>
  </head>
  <body class="record-page">
    <a class="skip-link" href="#record-content">観測記録へ移動</a>

    <header class="site-header">
      <a class="brand" href="../../index.html" aria-label="IDK FILE トップへ">
        <img class="brand__icon" src="../../assets/idk-icon-64.png" alt="" width="64" height="64">
        <span class="brand__name">IDK FILE</span>
        <span class="brand__division">XENO ARCHIVE</span>
      </a>
      <nav class="site-nav" aria-label="メインナビゲーション">
        <a href="../../index.html?about=open">About</a>
        <a href="../../index.html#archive" aria-current="page">Archive</a>
        <a href="../../contact.html">Contact</a>
      </nav>
      <div class="system-status" aria-label="アーカイブ稼働中">
        <span class="system-status__light" aria-hidden="true"></span>
        System online
      </div>
    </header>

    <main class="record-page__main" id="record-content">
      <nav class="record-page__breadcrumb" aria-label="パンくずリスト">
        <ol>
          <li><a href="../../index.html">IDK FILE</a></li>
          <li><a href="../../index.html#archive">Archive</a></li>
          <li aria-current="page">${escapeHtml(record.nameJa)}</li>
        </ol>
      </nav>

      <article class="record-detail record-detail--page">
        <div class="record-detail__visual archive-slideshow" data-record-slideshow data-image-alt="${escapeHtml(record.nameJa)}の拡大画像">
${createImages(record)}
          <span class="record-detail__scan is-playing" aria-hidden="true"></span>
          <p>Visual record / ${escapeHtml(record.id)}</p>${createIndicators(record)}
        </div>
        <div class="record-detail__content">
          <div class="record-detail__topline">
            <span>FILE // ${escapeHtml(record.id)}</span>
            <span class="archive-card__risk archive-card__risk--${escapeHtml(record.risk)}">${escapeHtml(record.riskLabel)}</span>
          </div>
          <p class="record-detail__taxonomy">${escapeHtml(record.categoryLabel)} / ${escapeHtml(record.status)}</p>
          <h1>${escapeHtml(record.name)}</h1>
          <p class="record-detail__ja">${escapeHtml(record.nameJa)}</p>
          <section class="record-detail__summary record-detail__bilingual" aria-labelledby="summary-${escapeHtml(record.id)}">
            <h2 class="sr-only" id="summary-${escapeHtml(record.id)}">観測概要</h2>
            <p lang="ja">${escapeHtml(record.summary)}</p>
            ${record.summaryEn ? `<p class="record-detail__english" lang="en"><span>EN</span>${escapeHtml(record.summaryEn)}</p>` : ""}
          </section>
          <section class="record-detail__description record-detail__bilingual" aria-labelledby="description-${escapeHtml(record.id)}">
            <h2 class="sr-only" id="description-${escapeHtml(record.id)}">観測記録詳細</h2>
            <p lang="ja">${escapeHtml(record.description)}</p>
            ${record.descriptionEn ? `<p class="record-detail__english" lang="en"><span>EN</span>${escapeHtml(record.descriptionEn)}</p>` : ""}
          </section>
          <dl class="record-detail__meta">
            <div><dt>Location</dt><dd>${escapeHtml(record.location)}</dd></div>
            <div><dt>Recorded</dt><dd><time datetime="${escapeHtml(recordedDate)}">${escapeHtml(record.recorded)}</time></dd></div>
            <div><dt>Status</dt><dd>${escapeHtml(record.status)}</dd></div>
          </dl>
          <div class="record-detail__traits" aria-label="個体特性">
            ${(record.traits || []).map((trait) => `<span>${escapeHtml(trait)}</span>`).join("\n            ")}
          </div>
          <aside class="record-page__disclaimer">
            本記録は、伝承・未確認情報・思弁的生物学から着想を得たフィクション・ドキュメンテーションです。
          </aside>
        </div>
      </article>

      <nav class="record-page__pager" aria-label="前後の観測記録">
        <a href="../${escapeHtml(previous.slug)}/"><span>← Previous record</span><strong>${escapeHtml(previous.nameJa)} / ${escapeHtml(previous.name)}</strong></a>
        <a href="../${escapeHtml(next.slug)}/"><span>Next record →</span><strong>${escapeHtml(next.nameJa)} / ${escapeHtml(next.name)}</strong></a>
      </nav>
    </main>

    <footer class="site-footer">
      <a class="brand brand--footer" href="../../index.html">
        <img class="brand__icon" src="../../assets/idk-icon-64.png" alt="" width="64" height="64">
        <span class="brand__name">IDK FILE</span>
      </a>
      <div class="site-footer__meta">
        <p>Independent unidentified lifeform archive.</p>
        <p class="site-footer__copyright">&copy; <time datetime="2026">2026</time> IDK FILE. All rights reserved.</p>
      </div>
      <a class="site-footer__action" href="../../index.html#archive">Return to archive</a>
    </footer>
  </body>
</html>
`;
}

for (const [index, record] of records.entries()) {
  if (!record.slug) throw new Error(`Record ${record.id} is missing a slug.`);
  const outputDirectory = path.join(projectRoot, "archive", record.slug);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, "index.html"), createPage(record, index), "utf8");
}

console.log(`Generated ${records.length} record pages.`);
