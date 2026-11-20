// READ-ONLY export of the public DGCA chapter samples used by scripts/gen-routes.mjs.
//
//   node scripts/export-dgca-samples.mjs        -> scripts/data/dgca-samples.json
//
// It runs SELECTs against the local EarnWings Postgres through `docker exec psql`
// with default_transaction_read_only=on, so the session physically cannot write.
// The output file is committed: the site build never needs the database.
//
// Per chapter it keeps: the title, the topic headings of our own notes (to write a
// short overview), content counts, the question count, and up to 5 sample
// questions from the whole EarnWings bank (every question is our own). Quality
// filters only: samples come from the open practice tiers ('bank', 'prep', 'easy');
// the 'test' tier is the mock-exam reserve and is never published. Questions with a
// figure, whose wording points at a figure, or that lean on another question
// ("in Q31", "the previous question") are skipped, because a page cannot show what
// they depend on. Questions with the fullest explanations (a why-each-option-is-wrong
// layer, then a longer explanation) are preferred.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONTAINER = process.env.EW_PG_CONTAINER || "infra-postgres-1";
const psql = (sql) =>
  execFileSync(
    "docker",
    ["exec", "-e", "PGOPTIONS=-c default_transaction_read_only=on", CONTAINER,
      "psql", "-U", "earnwings", "-d", "earnwings", "-At", "-v", "ON_ERROR_STOP=1", "-c", sql],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  ).trim();

// Guard: refuse to run if the session is somehow not read-only.
if (psql("show default_transaction_read_only") !== "on") {
  console.error("export-dgca-samples: session is not read-only, aborting");
  process.exit(1);
}

const subjects = JSON.parse(psql(`
  select coalesce(json_agg(x order by x."order"), '[]') from (
    select s.id, s.code, s.title, s."order" from subjects s
  ) x`));

const chapters = JSON.parse(psql(`
  select coalesce(json_agg(x order by x.subject_id, x."order", x.number), '[]') from (
    select c.id, c.subject_id, c.number, c.title, c."order",
      (select count(*) from questions q where q.chapter_id = c.id) as questions,
      (select count(*) from content_items i where i.chapter_id = c.id and i.kind = 'visual') as visuals,
      (select count(*) from content_items i where i.chapter_id = c.id and i.kind = 'flowchart') as flowcharts
    from chapters c
  ) x`));

// Headings of the chapter notes, in document order (h2 = part, h3 = topic).
const headRows = JSON.parse(psql(`
  select coalesce(json_agg(x), '[]') from (
    select i.chapter_id, r.n, r.m[1] as lvl, r.m[2] as text
    from content_items i
    cross join lateral regexp_matches(i.html, '<h([23])[^>]*>([^<]{2,160})', 'g') with ordinality as r(m, n)
    where i.kind = 'notes'
  ) x`));

const qRows = JSON.parse(psql(`
  select coalesce(json_agg(x), '[]') from (
    select q.id, q.chapter_id, q.prompt, q.options, q.answer_index, q.explanation, q.difficulty, q.tier,
      q.details->'why_wrong' as why_wrong, q.details->>'exam_tip' as exam_tip,
      q.details->>'syllabus_ref' as syllabus_ref,
      row_number() over (partition by q.chapter_id
        order by case when q.details->'why_wrong' is not null then 0 else 1 end,
                 case when length(coalesce(q.explanation, '')) >= 140 then 0 else 1 end,
                 case q.tier when 'bank' then 0 when 'prep' then 1 else 2 end, q.id) as rn
    from questions q
    where q.figure is null
      and q.tier in ('bank', 'prep', 'easy')
      -- must stand alone (same idea as core app/question_hygiene.py)
      and q.prompt !~* '((in|from|as|of|see|per|refer to|given in|used in)\\s+Q\\.?\\s?[0-9]{1,3}\\M|using the same (condition|scenario|data|value|figure|information|detail)|questions? (no\\.? ?)?[0-9]{1,3}\\M|(previous|preceding|earlier|next|following) question|same as above)'
      and json_array_length(q.options) = 4
      and length(q.prompt) between 25 and 340
      and length(coalesce(q.explanation, '')) between 60 and 900
      and q.prompt !~* '(figure|diagram|shown|the above|the below|following table|picture|image|exhibit)'
  ) x where x.rn <= 40`));

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

// Boilerplate headings that are part of every note's template, not its topics.
const SKIP = /^(earnwings|why this exists|the core mechanism|deep concept|formulas|standard values|memory|mnemonic|cockpit reality|exam anatomy|trap\s*\d|pre-flight|in-flight|emergency|quick revision|summary|key takeaways|self[- ]test|practice|references)/i;

const heads = new Map();
for (const h of headRows) {
  if (!heads.has(h.chapter_id)) heads.set(h.chapter_id, []);
  heads.get(h.chapter_id).push({ n: h.n, lvl: Number(h.lvl), text: decode(h.text) });
}
function topicsFor(chId) {
  const hs = (heads.get(chId) || []).sort((a, b) => a.n - b.n);
  // Prefer the h3s inside the "Deep Concept Breakdown" part: those are the topics.
  const out = [];
  let inConcepts = false;
  for (const h of hs) {
    if (h.lvl === 2) { inConcepts = /concept/i.test(h.text); continue; }
    if (inConcepts && !SKIP.test(h.text)) out.push(h.text);
  }
  const list = out.length >= 3 ? out : hs.filter((h) => h.lvl === 3 && !SKIP.test(h.text)).map((h) => h.text);
  return [...new Set(list.map((t) => t.replace(/[:.]+$/, "")))].filter((t) => t.length <= 90).slice(0, 10);
}

const qs = new Map();
for (const q of qRows) {
  if (!qs.has(q.chapter_id)) qs.set(q.chapter_id, []);
  qs.get(q.chapter_id).push(q);
}
/** Up to 5 samples, spread across difficulty, deterministic (lowest id first). */
function samplesFor(chId) {
  const pool = (qs.get(chId) || []).sort((a, b) => a.rn - b.rn);
  const picked = [];
  const seen = new Set();
  for (const q of pool) { // one per difficulty first
    if (picked.length >= 5) break;
    if (!seen.has(q.difficulty)) { seen.add(q.difficulty); picked.push(q); }
  }
  for (const q of pool) { if (picked.length >= 5) break; if (!picked.includes(q)) picked.push(q); }
  return picked.sort((a, b) => a.difficulty - b.difficulty || a.id - b.id).map((q) => ({
    id: q.id,
    prompt: decode(q.prompt),
    options: q.options.map((o) => decode(String(o))),
    answer: q.answer_index,
    explanation: decode(q.explanation),
    whyWrong: Array.isArray(q.why_wrong) ? q.why_wrong.map((w) => (w ? decode(String(w)) : null)) : null,
    examTip: q.exam_tip ? decode(q.exam_tip) : null,
    syllabusRef: q.syllabus_ref || null,
  }));
}

const out = {
  exportedAt: new Date().toISOString().slice(0, 10),
  note: "Read-only export from the EarnWings question bank. Regenerate with node scripts/export-dgca-samples.mjs.",
  subjects: subjects.map((s) => ({
    id: s.id,
    code: s.code,
    title: s.title,
    chapters: chapters
      .filter((c) => c.subject_id === s.id)
      .map((c) => ({
        id: c.id,
        number: c.number,
        title: decode(c.title),
        questions: c.questions,
        visuals: c.visuals,
        flowcharts: c.flowcharts,
        topics: topicsFor(c.id),
        samples: samplesFor(c.id),
      })),
  })),
};

mkdirSync(join("scripts", "data"), { recursive: true });
writeFileSync(join("scripts", "data", "dgca-samples.json"), JSON.stringify(out, null, 1));
const chs = out.subjects.flatMap((s) => s.chapters);
// A few numbers the React pages show (bundled, so keep it tiny).
writeFileSync(
  join("src", "content", "dgcaMeta.json"),
  JSON.stringify({
    exportedAt: out.exportedAt,
    subjects: out.subjects.length,
    chapters: chs.length,
    questions: chs.reduce((n, c) => n + c.questions, 0),
  }, null, 2) + "\n",
);
console.log(
  `export-dgca-samples: ${out.subjects.length} subjects, ${chs.length} chapters, ` +
    `${chs.reduce((n, c) => n + c.samples.length, 0)} samples; ` +
    `chapters with <3 samples: ${chs.filter((c) => c.samples.length < 3).map((c) => c.id).join(",") || "none"}; ` +
    `chapters with <3 topics: ${chs.filter((c) => c.topics.length < 3).map((c) => c.id).join(",") || "none"}`,
);
