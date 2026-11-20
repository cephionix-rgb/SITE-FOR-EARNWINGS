// Interactive notes: which DGCA chapters have one, read from the app's own catalogue.
//
// Source of truth: the app's src/app/components/interactive/registry.ts, keyed by
// (subject code, chapter number). Runs before every build and writes
// src/content/interactiveNotes.json, which the site copy, the feature sections and the
// /dgca chapter pages read. When the app source is not next to this repo (CI, Vercel),
// the committed JSON is kept as it is, so the build never fails over it.
//
// Honest copy: the site says "every chapter" only once every chapter is registered;
// until then it gives the real number (see src/lib/interactive.ts).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APP = process.env.EW_APP_DIR || join("..", "EARNWINGS Student App");
const REG = join(APP, "src", "app", "components", "interactive", "registry.ts");
const SYL = join(APP, "src", "app", "components", "interactive", "syllabus.json");
const OUT = join("src", "content", "interactiveNotes.json");

if (!existsSync(REG)) {
  console.log(`[interactive] ${REG} not found; keeping ${OUT} as committed.`);
  process.exit(0);
}

const src = readFileSync(REG, "utf8");
const body = src.slice(src.indexOf("EXPLAINERS"), src.indexOf("export function"));
const explainers = [];
for (const block of body.split(/\n  \{\n/).slice(1)) {
  const id = /id:\s*"([^"]+)"/.exec(block)?.[1];
  const title = /title:\s*"((?:[^"\\]|\\.)*)"/.exec(block)?.[1];
  if (!id || !title) continue;
  const chapters = [...block.matchAll(/ch\("([A-Z0-9]+)",\s*(\d+)\)/g)].map((m) => [m[1], Number(m[2])]);
  explainers.push({ id, title: title.replace(/\\"/g, '"'), chapters });
}
const keys = [...new Set(explainers.flatMap((e) => e.chapters.map(([s, n]) => `${s}:${n}`)))].sort();
const totalChapters = existsSync(SYL) ? JSON.parse(readFileSync(SYL, "utf8")).length : 202;

// Per chapter, the explainer titles that open from it (home chapter first, as in the app).
const byChapter = {};
for (const k of keys) {
  const [s, n] = k.split(":");
  const home = explainers.filter((e) => e.chapters[0][0] === s && e.chapters[0][1] === Number(n));
  const also = explainers.filter((e) => !home.includes(e) && e.chapters.some(([a, b]) => a === s && b === Number(n)));
  byChapter[k] = [...home, ...also].map((e) => e.title);
}

const out = {
  syncedAt: new Date().toISOString().slice(0, 10),
  explainerCount: explainers.length,
  chapterCount: keys.length,
  totalChapters,
  chapters: byChapter,
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`[interactive] ${explainers.length} explainers on ${keys.length} of ${totalChapters} chapters -> ${OUT}`);
