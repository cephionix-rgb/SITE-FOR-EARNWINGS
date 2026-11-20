// Builds the downloadable Pilot Guide PDFs from the SAME content module the
// pages use (src/content/guides.js), via the print template at /guide-print.
//
//   npm run guides:pdf
//
// 1. vite build into .pdf-build/ (a throwaway folder, not dist/)
// 2. serve it locally, open /guide-print in headless Chromium
// 3. print a full-bleed cover (no header/footer) and the body (branded header,
//    footer with page numbers, clickable links), A4
// 4. join cover + body with pdf-lib, set the PDF metadata
// 5. write public/guides/<name>.pdf and public/guides/manifest.json (with a hash
//    of the guide content, so `npm run build` can warn when the PDFs are stale)
//
// Needs the Playwright Chromium browser: `npx playwright install chromium`.
import { execSync } from "node:child_process";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { GUIDES, GUIDE_HUB, LAST_CHECKED } from "../src/content/guides.js";

const OUT_BUILD = ".pdf-build";
const OUT_DIR = join("public", "guides");
const PORT = Number(process.env.GUIDE_PDF_PORT || 4319);

console.log("guides:pdf: building the site into", OUT_BUILD);
execSync(`npx vite build --outDir ${OUT_BUILD} --emptyOutDir --logLevel warn`, { stdio: "inherit" });

// Minimal static server with SPA fallback (no extra dependency).
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json", ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  let file = join(OUT_BUILD, decodeURIComponent(url.pathname));
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(OUT_BUILD, "index.html");
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));
const BASE = `http://localhost:${PORT}`;

// The header logo is embedded once per page, so keep it tiny (32 px is plenty
// for a 14 px mark at print resolution).
const logo = `data:image/png;base64,${(await sharp("public/assets/logo-mark-96.png").resize(32).png({ compressionLevel: 9, palette: true }).toBuffer()).toString("base64")}`;
const header = (title) => `
<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:8.5px;color:#5B6B8C;padding:0 14mm;display:flex;align-items:center;gap:6px;-webkit-print-color-adjust:exact">
  <img src="${logo}" style="width:14px;height:14px;border-radius:50%"/>
  <span style="font-weight:700;letter-spacing:.06em"><span style="color:#C9981F">EARN</span><span style="color:#1B3A7A">WINGS</span></span>
  <span style="color:#9aa8c4">|</span><span>${title}</span>
  <span style="margin-left:auto">earnwings.org/guide</span>
</div>`;
const footer = `
<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:8.5px;color:#5B6B8C;padding:0 14mm;display:flex;align-items:center;border-top:0">
  <span>Free guide by EarnWings. Last checked ${LAST_CHECKED}. Not affiliated with DGCA; always confirm on the official page.</span>
  <span style="margin-left:auto;font-weight:700;color:#1B3A7A">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

const targets = [
  ...GUIDES.map((g) => ({ g: g.slug, title: g.title, file: g.pdf.split("/").pop(), subject: g.summary })),
  {
    g: "all",
    title: "The complete Pilot Guide",
    file: GUIDE_HUB.pdf.split("/").pop(),
    subject: "Become a pilot in India: pathway, medicals, eGCA, Pariksha exams, RTR and a beginner glossary.",
  },
];

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
const manifest = { contentHash: "", lastChecked: LAST_CHECKED, generated: new Date().toISOString(), files: {} };

async function render(g, part, opts) {
  await page.goto(`${BASE}/guide-print?g=${g}&part=${part}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__printReady === true, null, { timeout: 20000 });
  await page.emulateMedia({ media: "print" });
  return page.pdf({ format: "A4", printBackground: true, ...opts });
}

for (const t of targets) {
  const cover = await render(t.g, "cover", { margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: "1" });
  const body = await render(t.g, "body", {
    displayHeaderFooter: true,
    headerTemplate: header(t.title),
    footerTemplate: footer,
    margin: { top: "18mm", bottom: "17mm", left: "14mm", right: "14mm" },
  });
  const out = await PDFDocument.create();
  for (const src of [cover, body]) {
    const doc = await PDFDocument.load(src);
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  out.setTitle(`${t.title}: EarnWings Pilot Guide`);
  out.setAuthor("EarnWings (Cephionix)");
  out.setSubject(t.subject);
  out.setKeywords(["DGCA", "pilot", "India", "EarnWings", "Pilot Guide"]);
  out.setCreator("earnwings.org/guide");
  out.setProducer("EarnWings guides:pdf");
  const bytes = await out.save();
  writeFileSync(join(OUT_DIR, t.file), bytes);
  manifest.files[t.file] = { pages: out.getPageCount(), bytes: bytes.length };
  console.log(`  ${t.file}  ${out.getPageCount()} pages  ${(bytes.length / 1024).toFixed(0)} KB`);
}

// pdf-lib's copyPages keeps link annotations, but internal (#anchor) links in
// the joined file point into the original body document; external links (the
// official sources) are what matter and they survive intact.
manifest.contentHash = createHash("sha256").update(JSON.stringify({ GUIDES, GUIDE_HUB, LAST_CHECKED })).digest("hex").slice(0, 16);
writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

await browser.close();
server.close();
rmSync(OUT_BUILD, { recursive: true, force: true });
console.log("guides:pdf: done ->", OUT_DIR);
