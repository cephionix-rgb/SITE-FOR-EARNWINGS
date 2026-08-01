// Post-build: emit a real static HTML file per client-side route so GitHub Pages
// serves each with HTTP 200 (not the 404.html fallback), AND bake unique SEO
// meta (title, description, canonical, og/twitter) into each one so crawlers and
// social scrapers see the right tags without executing JS.
//
// For every route we emit BOTH forms so either URL returns 200 with no redirect:
//   dist/about.html          -> served for /about   (clean URL, no trailing slash)
//   dist/about/index.html    -> served for /about/  (trailing slash)
// Plus dist/404.html as the SPA fallback for any genuinely unknown path.
//
// Keep ROUTES in sync with the <case "/x"> routes in src/App.tsx. Titles are
// under 60 chars, descriptions 150-160, and every title contains "EARNWINGS".
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import {
  HERO_H1,
  HERO_H1_BRAND,
  HERO_INTRO,
  HERO_CTA,
} from "../src/content/hero.js";
import { FEATURES_H1, FEATURES_INTRO } from "../src/content/features.js";
import { FAQ, FAQ_FEATURED } from "../src/content/faq.js";
import { GLOSSARY, GLOSSARY_H1, GLOSSARY_INTRO } from "../src/content/glossary.js";
import { RESEARCH, RESEARCH_DISCLAIMER, RESEARCH_H1, RESEARCH_INTRO } from "../src/content/research.js";
import { REGIONS, REGIONS_FOOTNOTE, REGIONS_H2, REGIONS_INTRO } from "../src/content/regions.js";
import { PROBLEMS, WHY_H1, WHY_INTRO } from "../src/content/whyEarnwings.js";
import {
  GC_FAQ,
  GC_H1,
  GC_HONESTY,
  GC_INTRO,
  INCLUDED,
  SYLLABUS,
} from "../src/content/groundClasses.js";

const DIST = "dist";
const INDEX = join(DIST, "index.html");
const ORIGIN = "https://earnwings.org";

// Stable @ids so the blocks below form ONE connected entity graph instead of
// three unrelated islands. Without these, nothing tells Google (or the models
// grounded on its index) that the Organization, the WebSite and the app are the
// same thing — which is what "knowing about EARNWINGS" actually means.
const ORG_ID = `${ORIGIN}/#organization`;
const SITE_ID = `${ORIGIN}/#website`;
const APP_ID = `${ORIGIN}/#app`;


const ROUTES = {
  features: {
    title: "Features — Flight Planning, RT & AI Captain | EARNWINGS",
    description:
      "Explore EARNWINGS features: flight planning on real airways, a voice RT trainer, an AI Captain grounded in your notes, and full DGCA mock exams with analytics.",
    ogTitle: "EARNWINGS Features — Flight Planning, RT & AI Captain",
    ogDescription:
      "Flight planning on real airways, a voice RT trainer, an AI Captain and full DGCA mock exams.",
  },
  "dgca-ground-classes": {
    title: "DGCA Ground Classes Online — CPL & ATPL | EARNWINGS",
    description:
      "Self-paced DGCA ground classes for CPL and ATPL in one app: 12 modules and 202 chapters as visual notes, video lectures, 10,000+ MCQs, timed mock papers and an AI instructor.",
    ogTitle: "DGCA Ground Classes Online — CPL & ATPL Ground School App",
    ogDescription:
      "The full DGCA ground syllabus as notes, video lectures, question banks and timed mock papers — study between flying slots.",
  },
  "why-earnwings": {
    title: "Why EARNWINGS — 24 Gaps in DGCA Ground School",
    description:
      "The 24 gaps every DGCA CPL and ATPL cadet hits in ground school — scattered notes, unmarked question banks, paper flight planning, no RT practice — and how EARNWINGS closes each one.",
    ogTitle: "Why EARNWINGS — 24 Gaps in DGCA Ground School",
    ogDescription:
      "Every gap DGCA ground school leaves you to solve alone, and the part of EARNWINGS that closes it.",
  },
  research: {
    title: "The Evidence Behind EARNWINGS — Research & Data",
    description:
      "Published research on pilot demand and how people actually learn — Boeing's 2044 outlook, Dunlosky et al. on study techniques, Roediger & Karpicke on retrieval practice — and what we built in response. None of it is ours; all of it is cited.",
    ogTitle: "The Evidence Behind EARNWINGS",
    ogDescription:
      "Third-party research on pilot demand and effective learning, cited in full, and what we built in response.",
  },
  faq: {
    title: "FAQ — DGCA Ground Classes & Exam Prep | EARNWINGS",
    description:
      "26 straight answers about EARNWINGS: which DGCA subjects are covered, how the mock exams work, what the AI Captain does, flight planning and RT practice, and how to get early access.",
    ogTitle: "EARNWINGS FAQ — Everything Student Pilots Ask",
    ogDescription:
      "Straight answers on the ground classes, mock exams, AI Captain, flight planning and early access.",
  },
  "aviation-glossary": {
    title: "Aviation & DGCA Glossary — 66 Terms | EARNWINGS",
    description:
      "FTO, CPL, ATPL, METAR, TAF, NOTAM, QNH, VOR, RNAV, W&B — 66 aviation and DGCA terms every student pilot meets in ground school, explained in plain English.",
    ogTitle: "Aviation & DGCA Glossary for Student Pilots",
    ogDescription:
      "66 terms from ground school — licences, navigation, weather, airspace and radio telephony — in plain English.",
  },
  about: {
    title: "About EARNWINGS — Built With DGCA Instructors",
    description:
      "How EARNWINGS is built: with a DGCA Chief Ground Instructor, a flight instructor and student pilots preparing for CPL and ATPL exams in India right now.",
    ogTitle: "About EARNWINGS — Built With DGCA Instructors",
    ogDescription:
      "Built with a DGCA Chief Ground Instructor, a flight instructor and student pilots.",
  },
  privacy: {
    title: "Privacy Policy | EARNWINGS",
    description:
      "Read the EARNWINGS privacy policy: what data we collect when you join the waitlist, how we use and protect it, and the choices you have over your information.",
    ogTitle: "Privacy Policy | EARNWINGS",
    ogDescription: "How EARNWINGS collects, uses and protects your waitlist data.",
  },
  terms: {
    title: "Terms of Service | EARNWINGS",
    description:
      "The EARNWINGS terms of service: the rules for using our DGCA prep website and waitlist while we prepare for launch. Please read them before you sign up.",
    ogTitle: "Terms of Service | EARNWINGS",
    ogDescription: "The rules for using the EARNWINGS website and waitlist.",
  },
  copyright: {
    title: "Copyright & Intellectual Property | EARNWINGS",
    description:
      "EARNWINGS — the app, the notes, the logo, the screens and the way information is presented inside it — is the exclusive property of Cephionix. Our IP notice in plain language.",
    ogTitle: "This is our work. All of it. | EARNWINGS",
    ogDescription:
      "The EARNWINGS app, notes, screens and presentation are the exclusive property of Cephionix.",
  },
};

if (!existsSync(INDEX)) {
  console.error(`gen-routes: ${INDEX} not found — run "vite build" first.`);
  process.exit(1);
}

const base = readFileSync(INDEX, "utf8");
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ── Inline the stylesheet ───────────────────────────────────────────────────
// Vite links one ~10 KB (gzipped) stylesheet in <head>. It is render-blocking:
// nothing paints until that extra round trip completes, which PageSpeed measured
// at ~190 ms on Slow 4G and flagged as ~300 ms of savings. At this size it is
// cheaper to ship the CSS inside the HTML than to fetch it, so the page can
// paint from the very first response.
function inlineCss(html) {
  const link = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
  if (!link) return html;
  const cssPath = join(DIST, link[1].replace(/^\//, ""));
  if (!existsSync(cssPath)) {
    console.warn(`gen-routes: stylesheet not found for inlining: ${cssPath}`);
    return html;
  }
  const css = readFileSync(cssPath, "utf8");
  // `</style>` inside the CSS would close the tag early — escape defensively.
  return html.replace(link[0], `<style>${css.replace(/<\/style>/gi, "<\\/style>")}</style>`);
}

function pageHtml(route, m) {
  const url = `${ORIGIN}/${route}`;
  const swap = (html, re, value) => {
    if (!re.test(html)) {
      console.warn(`gen-routes: pattern not found for /${route}: ${re}`);
      return html;
    }
    return html.replace(re, value);
  };
  let html = inlineCss(base);
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`);
  html = swap(
    html,
    /(<meta name="description" content=")[\s\S]*?("\s*\/>)/,
    `$1${esc(m.description)}$2`,
  );
  html = swap(html, /(<link rel="canonical" href=")[\s\S]*?("\s*\/>)/, `$1${url}$2`);
  html = swap(html, /(<meta property="og:url" content=")[\s\S]*?("\s*\/>)/, `$1${url}$2`);
  html = swap(
    html,
    /(<meta property="og:title" content=")[\s\S]*?("\s*\/>)/,
    `$1${esc(m.ogTitle)}$2`,
  );
  html = swap(
    html,
    /(<meta property="og:description" content=")[\s\S]*?("\s*\/>)/,
    `$1${esc(m.ogDescription)}$2`,
  );
  html = swap(
    html,
    /(<meta name="twitter:title" content=")[\s\S]*?("\s*\/>)/,
    `$1${esc(m.ogTitle)}$2`,
  );
  html = swap(
    html,
    /(<meta name="twitter:description" content=")[\s\S]*?("\s*\/>)/,
    `$1${esc(m.ogDescription)}$2`,
  );
  return html;
}

// SPA fallback for unmatched paths (empty root, like the original shell).
copyFileSync(INDEX, join(DIST, "404.html"));

// ── Crawlable content shells ────────────────────────────────────────────────
// EVERY route ships the real text of its page inside #root, built from the SAME
// content modules the React components render, so it is not cloaking — React
// replaces it on mount. Previously only / and /features had a shell and the rest
// served an empty div: a crawler that did not execute the JS saw a blank page,
// which is the difference between being indexed for this content and not.
const hidden = (inner) =>
  '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);border:0;padding:0;margin:-1px;">' +
  inner +
  "</div>";

const faqBlock = (items) =>
  items.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join("");

/** FAQPage schema built from the SAME items rendered on the page. */
const faqLdFor = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

/** Breadcrumbs: Home › <page>, so search results show the site structure. */
const breadcrumbLd = (route, name) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
    { "@type": "ListItem", position: 2, name, item: `${ORIGIN}/${route}` },
  ],
});

const SHELLS = {
  features:
    `<h1>${FEATURES_H1[0]}<span>${FEATURES_H1[1]}</span>${FEATURES_H1[2]}</h1>` +
    `<p>${esc(FEATURES_INTRO)}</p>` +
    faqBlock(FAQ_FEATURED),

  "dgca-ground-classes":
    `<h1>${esc(GC_H1[0])}${esc(GC_H1[1])}</h1>` +
    `<p>${esc(GC_INTRO)}</p>` +
    `<p>${esc(GC_HONESTY)}</p>` +
    `<h2>${SYLLABUS.length} modules, ${SYLLABUS.reduce((n, s) => n + s.chapters, 0)} chapters, in exam order</h2>` +
    "<ul>" +
    SYLLABUS.map((s) => `<li>${esc(s.name)} — ${s.chapters} chapters</li>`).join("") +
    "</ul>" +
    "<h2>Everything a student pilot needs for the ground exams</h2>" +
    INCLUDED.map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.body)}</p>`).join("") +
    faqBlock(GC_FAQ),

  "why-earnwings":
    `<h1>${esc(WHY_H1[0])}${esc(WHY_H1[1])}</h1>` +
    `<p>${esc(WHY_INTRO)}</p>` +
    PROBLEMS.map(
      (p) => `<h2>${esc(p.title)}</h2><p>${esc(p.body)}</p><p>${esc(p.fix)}</p>`,
    ).join(""),

  research:
    `<h1>${esc(RESEARCH_H1[0])}${esc(RESEARCH_H1[1])}</h1>` +
    `<p>${esc(RESEARCH_INTRO)}</p>` +
    `<p>${esc(RESEARCH_DISCLAIMER)}</p>` +
    RESEARCH.map(
      (r) =>
        `<h2>${esc(r.headline)}</h2><p>${esc(r.finding)}</p>` +
        `<p>Source: ${esc(r.authors)} (${esc(r.year)}). ${esc(r.source)}. ${esc(r.url)}</p>`,
    ).join(""),

  faq:
    "<h1>Everything you want to know about EARNWINGS</h1>" +
    faqBlock(FAQ),

  "aviation-glossary":
    `<h1>${esc(GLOSSARY_H1[0])}${esc(GLOSSARY_H1[1])}</h1>` +
    `<p>${esc(GLOSSARY_INTRO)}</p>` +
    GLOSSARY.map(
      (g) => `<h2>${esc(g.term)}${g.full ? ` (${esc(g.full)})` : ""}</h2><p>${esc(g.def)}</p>`,
    ).join(""),

  about:
    "<h1>Built by pilots-in-training, for pilots-in-training</h1>" +
    "<p>EARNWINGS is the all-in-one training cockpit for the next generation of Indian aviators — where ground school, flight planning, radio telephony and DGCA exam prep finally live in one place. It is built and owned by Cephionix.</p>" +
    `<h2>${esc(REGIONS_H2)}</h2><p>${esc(REGIONS_INTRO)}</p>` +
    REGIONS.map((r) => `<h3>${esc(r.code)} — ${esc(r.region)}</h3><p>${esc(r.note)}</p>`).join("") +
    `<p>${esc(REGIONS_FOOTNOTE)}</p>`,
};

/** Human-readable crumb label per route. */
const CRUMB = {
  features: "Features",
  "dgca-ground-classes": "DGCA Ground Classes",
  "why-earnwings": "Why EARNWINGS",
  research: "Research & Evidence",
  faq: "FAQ",
  "aviation-glossary": "Aviation Glossary",
  about: "About",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  copyright: "Copyright & IP",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "EARNWINGS",
    // The brand is one word, but people type it as two and an unrelated
    // "Earn Wings" seller already ranks for that. Declaring the variants tells
    // Google they are the same entity.
    alternateName: ["Earn Wings", "EarnWings", "EARNWINGS by Cephionix"],
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/assets/logo-512.png`,
    description:
      "EARNWINGS is a DGCA CPL and ATPL study app for student pilots in India — online ground classes, question banks, mock exams, flight planning and radio-telephony practice.",
    areaServed: { "@type": "Country", name: "India" },
    // EARNWINGS is the product; Cephionix is the company that owns it.
    // Keep in sync with COMPANY_NAME in src/lib/siteConfig.ts.
    parentOrganization: { "@type": "Organization", name: "Cephionix" },
    sameAs: [
      "https://www.instagram.com/flywithearnwings/",
      "https://www.youtube.com/@flywithearnwings",
    ],
    // Keep in sync with CONTACT_EMAIL / SUPPORT_EMAIL in src/lib/siteConfig.ts.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@earnwings.org",
      },
      {
        "@type": "ContactPoint",
        contactType: "general enquiries",
        email: "hello@earnwings.org",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: "EARNWINGS",
    url: `${ORIGIN}/`,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID },
    about: { "@id": ORG_ID },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: "EARNWINGS",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android, Web, macOS, Windows",
    description:
      "Student pilot app for DGCA CPL and ATPL: online ground classes, 10,000+ practice questions, timed mock exams, real-airway flight planning, an RT trainer and an AI Captain.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/PreOrder",
    },
  },
];

for (const [route, m] of Object.entries(ROUTES)) {
  let html = pageHtml(route, m);

  const shell = SHELLS[route];
  if (shell) {
    html = html.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${hidden(shell)}</div>`,
    );
  }

  // Every page states what it is and which site/organisation it belongs to, so
  // a crawler landing on a sub-page can still resolve the entity behind it
  // rather than seeing an orphaned document.
  const scripts = [
    ld({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${ORIGIN}/${route}#webpage`,
      url: `${ORIGIN}/${route}`,
      name: m.title,
      description: m.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
    }),
    ld(breadcrumbLd(route, CRUMB[route] || route)),
    // The site-wide graph on EVERY page: a crawler (or a model) that lands
    // directly on a sub-page can then resolve who publishes it without having
    // to have fetched the homepage first.
    ld(jsonLd),
  ];
  // FAQPage schema lives on /faq only — /features shows a short subset visually
  // but duplicating the same Q&A markup on two URLs is exactly what Google's FAQ
  // guidance warns against.
  if (route === "faq") scripts.push(ld(faqLdFor(FAQ)));
  if (route === "research") {
    // citation[] makes the attribution machine-readable: these are works we
    // reference, explicitly not works we authored.
    scripts.push(
      ld({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${ORIGIN}/research#evidence`,
        url: `${ORIGIN}/research`,
        name: "The evidence behind EARNWINGS",
        publisher: { "@id": ORG_ID },
        citation: RESEARCH.map((r) => ({
          "@type": "CreativeWork",
          name: r.source,
          author: { "@type": "Organization", name: r.authors },
          datePublished: r.year,
          url: r.url,
        })),
      }),
    );
  }
  if (route === "aviation-glossary") {
    scripts.push(
      ld({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": `${ORIGIN}/aviation-glossary#glossary`,
        name: "Aviation & DGCA Glossary",
        description: GLOSSARY_INTRO,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
        hasDefinedTerm: GLOSSARY.map((g) => ({
          "@type": "DefinedTerm",
          name: g.full ? `${g.term} (${g.full})` : g.term,
          description: g.def,
          inDefinedTermSet: `${ORIGIN}/aviation-glossary#glossary`,
        })),
      }),
    );
  }
  if (route === "dgca-ground-classes") {
    scripts.push(ld(faqLdFor(GC_FAQ)));
    // Course is the type that maps onto what a student searching "DGCA ground
    // classes" is looking for. Everything here is factual: no price (not
    // finalised), no rating (no reviews), no provider claim beyond Cephionix.
    scripts.push(
      ld({
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${ORIGIN}/dgca-ground-classes#course`,
        name: "DGCA CPL & ATPL Ground School",
        description: GC_INTRO,
        url: `${ORIGIN}/dgca-ground-classes`,
        inLanguage: "en-IN",
        provider: { "@id": ORG_ID },
        educationalLevel: "Commercial Pilot Licence (CPL) and Airline Transport Pilot Licence (ATPL) ground subjects",
        teaches: SYLLABUS.map((x) => x.name),
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          inLanguage: "en-IN",
        },
      }),
    );
  }
  html = html.replace("</head>", `    ${scripts.join("\n    ")}\n  </head>`);

  writeFileSync(join(DIST, `${route}.html`), html); // /about   -> 200
  mkdirSync(join(DIST, route), { recursive: true });
  writeFileSync(join(DIST, route, "index.html"), html); // /about/ -> 200
}

// Home route only: inject a minimal, crawlable static shell of the hero (h1,
// intro, CTA) into #root. It is byte-identical to what React renders (built from
// the SAME src/content/hero.js the component uses) and React replaces it on
// mount, so it is not cloaking. Visually hidden so there is no flash of unstyled
// content before hydration.
const HERO_SHELL =
  '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);border:0;padding:0;margin:-1px;">' +
  `<h1>${HERO_H1[0]}<span>${HERO_H1[1]}</span><br/>${HERO_H1[2]}<span>${HERO_H1_BRAND}</span></h1>` +
  `<p>${HERO_INTRO}</p>` +
  `<a href="#waitlist">${HERO_CTA}</a>` +
  "</div>";
let home = inlineCss(base).replace(
  /<div id="root">\s*<\/div>/,
  `<div id="root">${HERO_SHELL}</div>`,
);
if (home === base) {
  console.warn("gen-routes: hero shell not injected (root div did not match)");
}

// Phase 3: structured data on the home page. No SearchAction (there is no site
// search) and no aggregateRating/review markup (there are no reviews) - both
// would be false signals / a manual-action risk.
const ldScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
home = home.replace("</head>", `    ${ldScript}\n  </head>`);

writeFileSync(INDEX, home);

// ── sitemap.xml ─────────────────────────────────────────────────────────────
// Generated from ROUTES rather than hand-maintained, so a new route can never
// be added to the site and silently left out of the sitemap (which is what had
// happened before — the file was last touched by hand).
const PRIORITY = {
  features: "0.8",
  "dgca-ground-classes": "0.8",
  "why-earnwings": "0.7",
  research: "0.7",
  faq: "0.7",
  "aviation-glossary": "0.7",
  about: "0.5",
  privacy: "0.3",
  terms: "0.3",
  copyright: "0.3",
};
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${ORIGIN}/`, priority: "1.0", changefreq: "weekly" },
  ...Object.keys(ROUTES).map((route) => ({
    loc: `${ORIGIN}/${route}`,
    priority: PRIORITY[route] || "0.5",
    changefreq: route === "privacy" || route === "terms" || route === "copyright" ? "yearly" : "monthly",
  })),
];
writeFileSync(
  join(DIST, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      )
      .join("\n") +
    "\n</urlset>\n",
);

console.log(
  `gen-routes: baked meta for ${Object.keys(ROUTES).length} routes + 404.html + ` +
    `${Object.keys(SHELLS).length + 1} content shells + JSON-LD + sitemap (${urls.length} urls)`,
);
