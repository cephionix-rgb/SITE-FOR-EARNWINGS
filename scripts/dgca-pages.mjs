// Public DGCA sample-question pages: /dgca, /dgca/<subject>, /dgca/<subject>/<chapter>.
//
// Built at postbuild by scripts/gen-routes.mjs from scripts/data/dgca-samples.json,
// a READ-ONLY export of our own question bank (scripts/export-dgca-samples.mjs).
// For every page this returns the route meta, a crawlable text shell, its JSON-LD,
// and a small JSON file the React page (src/pages/DgcaPage.tsx) renders from, so the
// shell and the page always show the same words.
//
// Only samples are public (up to 5 per chapter); the full chapter stays in the app. That
// keeps the owner's rule intact: the study content is what a plan buys.
//
// OWNER RULE: never publish how many questions a chapter or subject has in the app. The
// export carries the counts (they drive which chapters get pages); nothing here may print
// them, put them in a data file or in JSON-LD. The overall "15,000+" line is allowed.
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Chapters with an Interactive note in the app (scripts/sync-interactive.mjs, from the
// app's registry), keyed "SUBJECT:chapter".
const INTERACTIVE = JSON.parse(readFileSync(join("src", "content", "interactiveNotes.json"), "utf8")).chapters;
const interactiveFor = (code, number) => INTERACTIVE[`${code}:${number}`] || [];

/** Per-subject: URL slug, short name, DGCA paper and an original one-paragraph intro. */
const SUBJECTS = {
  MET1: { slug: "aviation-meteorology-1", short: "Meteorology", paper: "Aviation Meteorology",
    intro: "How the atmosphere works and how it makes weather: pressure, temperature, density, humidity, wind, cloud, stability, fog, icing, thunderstorms, fronts, jet streams and the climate of India." },
  MET2: { slug: "aviation-meteorology-2", short: "Met Reports", paper: "Aviation Meteorology",
    intro: "The weather products a pilot actually reads: the station model, METAR, SPECI and TREND, TAF, route forecasts, and the documents and briefing you get before a flight." },
  ELEC: { slug: "electrics-and-electronics", short: "Electrics", paper: "Technical General",
    intro: "Aircraft electrical systems from first principles: DC circuits, switches and protection, batteries, generators and alternators, AC power, transformers, motors, semiconductors and logic gates." },
  GNAV: { slug: "general-navigation", short: "Navigation", paper: "Air Navigation",
    intro: "Position, direction and time on a round Earth: latitude and longitude, great circles and rhumb lines, magnetism, the navigation computer, the 1 in 60 rule, charts and their projections, and plotting." },
  INAV: { slug: "instruments", short: "Instruments", paper: "Air Navigation",
    intro: "How flight instruments sense and show what the aircraft is doing: the pitot-static instruments, compasses, gyros, inertial systems, radio altimeter, FMS, GPWS and ACAS." },
  MASS: { slug: "mass-balance-and-flight-planning", short: "Mass & Balance", paper: "Technical General",
    intro: "Loading an aircraft safely and planning the fuel: masses and limits, centre-of-gravity calculations, and the point of equal time and the point of no return." },
  PERF: { slug: "aircraft-performance", short: "Performance", paper: "Technical General",
    intro: "What the aircraft can do on the day: the definitions, then take-off, climb, cruise, descent and landing, and how weight, altitude, temperature and wind change each one." },
  PWR: { slug: "powerplant", short: "Powerplant", paper: "Technical General",
    intro: "Piston engines and gas turbines: how they make power, their fuel, ignition, lubrication and cooling, propellers, thrust and reverse thrust, APUs and bleed air." },
  POF: { slug: "principles-of-flight", short: "Principles of Flight", paper: "Technical General",
    intro: "Why an aircraft flies: airflow, lift and drag, the stall, high-lift devices, stability and control, flight mechanics, high-speed flight, limitations, windshear and propellers." },
  REGS: { slug: "air-regulations", short: "Air Regulations", paper: "Air Regulations",
    intro: "The rules you fly under: ICAO and Indian regulations, rules of the air, air traffic services, aeronautical information, aerodromes, search and rescue, licensing, security and human performance." },
  RNAV: { slug: "radio-navigation", short: "Radio Navigation", paper: "Air Navigation (radio aids)",
    intro: "Radio waves and the aids built on them: propagation and antennae, VDF, ADF, VOR, ILS, DME, radar and SSR, weather radar, area navigation, EFIS and GNSS." },
  RTR: { slug: "radio-telephony", short: "Radio Telephony", paper: "RTR(A) Part 1",
    intro: "Radio telephony for the RTR(A) licence: radio basics, standard phraseology, call structure, ground and departure calls, distress and urgency, emergencies and communication failure." },
};

/** Display fixes for chapter titles that are truncated or generic in the database.
 *  The database is not touched; these only change what the public page shows. */
const TITLE_FIX = {
  162: "The Navigation Computer - Distance, Speed, Time and Conversions",
  165: "The Navigation Computer - Calculation of Heading and Ground Speed",
  166: "The Navigation Computer - Multi-drift Winds and Wind Components",
  215: "Take-off Forces: Thrust, Drag and Take-off Speed",
  267: "Signals, Cruising Levels and Navigation Lights",
  268: "Air Traffic Services and Airspace",
  271: "ATS Surveillance: Radar, SSR and ADS-B",
  272: "Aeronautical Information Services",
  273: "Search and Rescue",
  274: "Aerodrome Lights and Visual Aids",
  275: "Instrument Departure Procedures (ICAO Doc 8168)",
  278: "Safety Rules and Prohibitions",
  281: "Operational Hazards and Emergencies",
  285: "ICAO Annex 17 and the Aircraft (Security) Rules, 2011",
  286: "Aviation Medicine: Fits, Faints and Vision",
  287: "Human Performance and the SHEL Model",
};
const cleanTitle = (c) =>
  (TITLE_FIX[c.id] || c.title).replace(/\s*\.+$/, "").replace(/\bCompas$/, "Compass").replace(/\s+/g, " ").trim();

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const fmt = (n) => Number(n).toLocaleString("en-IN");
const listJoin = (xs) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/[\s,;:.-]+\S*$/, "")}…`);

/** The short original overview, written from our notes' topic headings. */
function overview(ch, subj) {
  const t = ch.topics;
  const firstThree = listJoin(t.slice(0, 3));
  const more = t.length > 3 ? ` It goes on to ${t.length - 3} more topics, listed below.` : "";
  const parts = [`notes`, `a one-page summary`, `a flowchart`];
  if (ch.visuals > 0) parts.push(`${ch.visuals} visual notes`);
  if (ch.interactive.length) parts.push(`an interactive note`);
  return (
    `${ch.title} is chapter ${ch.number} of ${subj.title} in the EarnWings DGCA CPL course, examined in the DGCA ${subj.paper} paper. ` +
    `It starts with ${firstThree}.${more} ` +
    `In the app it is taught through ${listJoin(parts)}, with a practice question bank in which every question has an explanation.`
  );
}

export function buildDgca({ ORIGIN, esc, exportFile = join("scripts", "data", "dgca-samples.json"), downloadUrl }) {
  const raw = JSON.parse(readFileSync(exportFile, "utf8"));
  const routes = {};
  const data = {};

  const subjects = raw.subjects.map((s) => {
    const meta = SUBJECTS[s.code];
    if (!meta) throw new Error(`dgca-pages: no SUBJECTS entry for ${s.code}`);
    const used = new Set();
    const chapters = s.chapters.map((c) => {
      const title = cleanTitle(c);
      let slug = slugify(title) || `chapter-${c.number}`;
      while (used.has(slug)) slug = `${slug}-${c.number}`;
      used.add(slug);
      return { ...c, title, slug, interactive: interactiveFor(s.code, c.number) };
    });
    return { code: s.code, title: s.title, ...meta, chapters };
  });

  const totalQ = subjects.reduce((n, s) => n + s.chapters.reduce((m, c) => m + c.questions, 0), 0);
  const totalCh = subjects.reduce((n, s) => n + s.chapters.length, 0);
  const updated = new Date(`${raw.exportedAt}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const crumbs = (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${ORIGIN}${path}` })),
  });
  const HOME = ["Home", "/"];
  const HUB = ["DGCA sample questions", "/dgca"];

  const toolsHtml =
    `<h2>Free tools</h2><ul>` +
    `<li><a href="${ORIGIN}/live">Live 3D airports</a>: real traffic at 8 Indian airports, free for everyone.</li>` +
    `<li><a href="${ORIGIN}/aviation-glossary">Aviation glossary</a>: ground-school terms in plain English.</li>` +
    `<li><a href="${ORIGIN}/guide">Pilot Guide</a>: medicals, eGCA, Pariksha exams and the RTR licence, checked against official sources.</li>` +
    `<li>In the free app: METAR, TAF and NOTAM decoders, weather radar and NavCalc essentials.</li></ul>`;

  // ── hub: /dgca ──────────────────────────────────────────────────────────────
  const hubIndex = {
    updated,
    totalChapters: totalCh,
    subjects: subjects.map((s) => ({
      slug: s.slug, title: s.title, short: s.short, paper: s.paper, intro: s.intro,
      chapters: s.chapters.map((c) => ({ slug: c.slug, number: c.number, title: c.title, samples: c.samples.length, interactive: c.interactive.length > 0 })),
    })),
  };
  data["dgca-data/index.json"] = hubIndex;
  routes.dgca = {
    title: "DGCA CPL Sample Questions by Chapter, Free | EARNWINGS",
    description: `Free DGCA CPL sample questions with answers and explanations for all ${totalCh} chapters of ${subjects.length} subjects, from Meteorology to RTR. Practise the full 15,000+ question bank in the free app.`,
    ogTitle: "DGCA CPL sample questions, chapter by chapter | EARNWINGS",
    ogDescription: `Sample questions with answers and explanations for all ${totalCh} DGCA chapters.`,
    crumbLabel: "DGCA sample questions",
    breadcrumb: [HOME, HUB],
    lean: true,
    priority: "0.8",
    shell:
      `<h1>DGCA CPL sample questions, chapter by chapter</h1>` +
      `<p>Every chapter of the EarnWings DGCA CPL course has a free public page with a short overview and sample questions from our own question bank, with answers and explanations. ${totalCh} chapters, ${subjects.length} subjects, 15,000+ questions in the app.</p>` +
      subjects.map((s) => `<h2><a href="${ORIGIN}/dgca/${s.slug}">${esc(s.title)}</a></h2><p>${esc(s.intro)} DGCA paper: ${esc(s.paper)}.</p>`).join("") +
      toolsHtml,
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "DGCA CPL subjects",
        itemListElement: subjects.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, url: `${ORIGIN}/dgca/${s.slug}` })),
      },
    ],
  };

  // ── subject hubs and chapter pages ─────────────────────────────────────────
  for (const s of subjects) {
    const sPath = `/dgca/${s.slug}`;
    const sTitle = clip(`${s.title}: DGCA Sample Questions | EARNWINGS`, 70);
    routes[`dgca/${s.slug}`] = {
      title: sTitle,
      description: clip(`Free DGCA ${s.title} sample questions for all ${s.chapters.length} chapters, with answers and explanations. ${s.intro}`, 158),
      ogTitle: `${s.title}: DGCA sample questions`,
      ogDescription: `${s.chapters.length} chapters with free sample questions and explanations.`,
      crumbLabel: s.title,
      breadcrumb: [HOME, HUB, [s.title, sPath]],
      lean: true,
      priority: "0.7",
      shell:
        `<h1>${esc(s.title)}: DGCA sample questions</h1><p>${esc(s.intro)}</p>` +
        `<p>Examined in the DGCA ${esc(s.paper)} paper. ${s.chapters.length} chapters, each with its full question bank in the app.</p>` +
        `<ol>${s.chapters.map((c) => `<li><a href="${ORIGIN}${sPath}/${c.slug}">${esc(c.title)}</a>${c.interactive.length ? " (interactive note in the app)" : ""}</li>`).join("")}</ol>` +
        toolsHtml,
      ld: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${s.title} chapters`,
          itemListElement: s.chapters.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: `${ORIGIN}${sPath}/${c.slug}` })),
        },
      ],
    };

    s.chapters.forEach((c, i) => {
      const cPath = `${sPath}/${c.slug}`;
      const prev = s.chapters[i - 1];
      const next = s.chapters[i + 1];
      const ov = overview(c, s);
      const samples = c.samples;
      const title =
        `${c.title}: DGCA ${s.short} Questions | EARNWINGS`.length <= 66
          ? `${c.title}: DGCA ${s.short} Questions | EARNWINGS`
          : `${clip(c.title, 44)}: DGCA Questions | EARNWINGS`;
      const page = {
        updated,
        subject: { slug: s.slug, title: s.title, short: s.short, paper: s.paper },
        chapter: { slug: c.slug, number: c.number, title: c.title, visuals: c.visuals },
        interactive: c.interactive,
        overview: ov,
        topics: c.topics.slice(0, 8),
        samples: samples.map((q) => ({
          prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation,
          whyWrong: q.whyWrong, examTip: q.examTip, syllabusRef: q.syllabusRef,
        })),
        prev: prev ? { slug: prev.slug, title: prev.title } : null,
        next: next ? { slug: next.slug, title: next.title } : null,
      };
      data[`dgca-data/${s.slug}/${c.slug}.json`] = page;

      const qHtml = samples
        .map(
          (q, k) =>
            `<h3>Question ${k + 1}</h3><p>${esc(q.prompt)}</p><ol type="A">${q.options.map((o) => `<li>${esc(o)}</li>`).join("")}</ol>` +
            `<p>Answer: ${LETTERS[q.answer]}. ${esc(q.options[q.answer])}. ${esc(q.explanation)}</p>` +
            (q.examTip ? `<p>Exam tip: ${esc(q.examTip)}</p>` : ""),
        )
        .join("");
      const ld = [];
      // Quiz markup only where the page really shows multiple-choice questions with
      // their answers; a chapter with no publishable sample gets none.
      if (samples.length) {
        ld.push({
          "@context": "https://schema.org",
          "@type": "Quiz",
          "@id": `${ORIGIN}${cPath}#quiz`,
          name: `${c.title}: DGCA ${s.title} sample questions`,
          about: { "@type": "Thing", name: c.title },
          educationalLevel: "DGCA Commercial Pilot Licence (CPL) ground exam",
          inLanguage: "en-IN",
          isAccessibleForFree: true,
          publisher: { "@id": `${ORIGIN}/#organization` },
          hasPart: samples.map((q, k) => ({
            "@type": "Question",
            eduQuestionType: "Multiple choice",
            position: k + 1,
            text: q.prompt,
            acceptedAnswer: {
              "@type": "Answer",
              position: q.answer + 1,
              text: q.options[q.answer],
              answerExplanation: { "@type": "Comment", text: q.explanation },
            },
            suggestedAnswer: q.options
              .map((o, j) => ({ o, j }))
              .filter(({ j }) => j !== q.answer)
              .map(({ o, j }) => ({ "@type": "Answer", position: j + 1, text: o })),
          })),
        });
      }
      routes[cPath.slice(1)] = {
        title,
        description: clip(
          `Free DGCA ${s.title} sample questions on ${c.title}, with answers and explanations. What the chapter covers, and the full chapter question bank in the free EarnWings app.`,
          158,
        ),
        ogTitle: `${c.title}: DGCA sample questions`,
        ogDescription: clip(`${samples.length} free sample questions with explanations. ${ov}`, 200),
        crumbLabel: c.title,
        breadcrumb: [HOME, HUB, [s.title, sPath], [c.title, cPath]],
        lean: true,
        priority: "0.6",
        shell:
          `<h1>${esc(c.title)}</h1><p>DGCA ${esc(s.title)}, chapter ${c.number}. Updated ${esc(updated)}.</p><p>${esc(ov)}</p>` +
          `<h2>What this chapter covers</h2><ul>${page.topics.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` +
          (c.interactive.length
            ? `<h2>Interactive note available in the app</h2><p>Explore this chapter with a live, hands-on figure: ${esc(listJoin(c.interactive))}.</p>`
            : "") +
          (samples.length
            ? `<h2>Sample questions with answers</h2>${qHtml}`
            : `<h2>Sample questions</h2><p>This chapter's questions are built around drawings, so they are in the app, where the figures can be shown.</p>`) +
          `<p><a href="${esc(downloadUrl)}">Download free to practise the full chapter question bank</a></p>` +
          toolsHtml +
          (prev ? `<p>Previous chapter: <a href="${ORIGIN}${sPath}/${prev.slug}">${esc(prev.title)}</a></p>` : "") +
          (next ? `<p>Next chapter: <a href="${ORIGIN}${sPath}/${next.slug}">${esc(next.title)}</a></p>` : ""),
        ld,
      };
    });
  }

  return { routes, data, stats: { subjects: subjects.length, chapters: totalCh, questions: totalQ, updated } };
}
