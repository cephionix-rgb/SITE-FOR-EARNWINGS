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
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { GUIDES, GUIDE_HUB, LAST_CHECKED, LAST_CHECKED_ISO, SCREENS_NOTE } from "../src/content/guides.js";
import { GUIDE_MENU, guideHref } from "../src/content/guideSlugs.js";
import { inlineToText as plain } from "../src/content/inline.js";
import { inlineToHtml, inlineToText } from "../src/content/inline.js";
import {
  TERMS,
  TERMS_STATUS,
  TERMS_UPDATED,
  CREDITS,
  CREDITS_INTRO,
} from "../src/content/legal.js";
import {
  HERO_H1,
  HERO_H1_BRAND,
  HERO_INTRO,
  HERO_CTA,
  HERO_FREE_LINE,
} from "../src/content/hero.js";
import { WHATS_NEW, WHATS_NEW_INTRO, WHATS_NEW_UPDATED, WHATS_NEW_UPDATED_ISO } from "../src/content/whatsNew.js";
import { HWC_H1, HWC_INTRO, HWC_NOT, HWC_SECTIONS, HWC_UPDATED, HWC_UPDATED_ISO } from "../src/content/howWeCheck.js";
import { buildDgca } from "./dgca-pages.mjs";
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

// The app downloads page, resolved the same way src/lib/siteConfig.ts does it:
// VITE_APP_DOWNLOAD_URL, else VITE_APP_HOST_URL + /downloads/. Vite reads the .env
// files itself; this Node script reads them by hand (later files win, like Vite).
const VITE_ENV = (() => {
  const env = {};
  for (const f of [".env", ".env.production", ".env.local", ".env.production.local"]) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*(VITE_[A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return { ...env, ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith("VITE_"))) };
})();
const APP_HOST = (VITE_ENV.VITE_APP_HOST_URL || "https://optimal-bufing-joshua-villas.trycloudflare.com").replace(/\/+$/, "");
const DOWNLOAD_URL = VITE_ENV.VITE_APP_DOWNLOAD_URL || `${APP_HOST}/downloads/`;
const SUPPORT = "support@earnwings.org"; // = SUPPORT_EMAIL in src/lib/siteConfig.ts
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
  account: {
    title: "Your account & plans | EARNWINGS",
    description:
      "Sign in to EARNWINGS to see your plan, your Fuel balance and everything you can add to it — Subject Pass, Trio Pass, Cadet Pro and Refuel packs.",
    ogTitle: "Your account & plans | EARNWINGS",
    ogDescription: "Sign in to manage your EARNWINGS plan and buy Fuel.",
    // Deliberately not indexed. It is a signed-in surface: there is nothing on it for
    // a search engine, and a pricing page ranking above the landing page would send
    // first-time visitors to a sign-in form instead of to the product.
    noindex: true,
  },

  features: {
    title: "Features — DGCA Prep, RT Practice & A320 Trainer | EARNWINGS",
    description:
      "Explore EARNWINGS: DGCA notes, interactive notes, question banks and timed mock papers, voice RT practice in real 3D airports, A320 and Cessna 172 trainers, and Captain Aezon.",
    ogTitle: "EARNWINGS Features — DGCA Prep, RT Practice & A320 Trainer",
    ogDescription:
      "DGCA mock exams, interactive notes, voice RT practice in 3D airports, an A320 flight-deck trainer and Captain Aezon.",
  },
  "dgca-ground-classes": {
    title: "DGCA Ground Classes Online — CPL & ATPL | EARNWINGS",
    description:
      "Self-paced DGCA ground classes for CPL and ATPL in one app: 12 modules and 202 chapters as visual notes, 15,000+ MCQs, timed mock papers and an AI instructor.",
    ogTitle: "DGCA Ground Classes Online — CPL & ATPL Ground School App",
    ogDescription:
      "The full DGCA ground syllabus as notes, flowcharts, question banks and timed mock papers — study between flying slots.",
  },
  "why-earnwings": {
    title: "Why EARNWINGS — 24 Gaps in DGCA Ground School",
    description:
      "The 24 gaps every DGCA CPL and ATPL cadet hits in ground school — scattered notes, unmarked question banks, no RT practice, no flight deck to rehearse on — and how EARNWINGS closes each one.",
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
      "26 straight answers about EARNWINGS: which DGCA subjects are covered, how the mock exams work, what Captain Aezon does, RT practice, and how to get early access.",
    ogTitle: "EARNWINGS FAQ — Everything Student Pilots Ask",
    ogDescription:
      "Straight answers on the ground classes, mock exams, Captain Aezon, RT practice and early access.",
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
  refunds: {
    title: "Refund and Cancellation Policy | EARNWINGS",
    description:
      "EARNWINGS refunds: website and Mac plans refunded in full within 7 days, unused boost Fuel pro rata. App Store and Play buys are refunded by Apple or Google.",
    ogTitle: "Refund and Cancellation Policy | EARNWINGS",
    ogDescription: "Ask within 7 days of paying. How much comes back, and how to ask.",
  },
  copyright: {
    title: "Copyright & Intellectual Property | EARNWINGS",
    description:
      "EARNWINGS — the app, the notes, the logo, the screens and the way information is presented inside it — is the exclusive property of Cephionix. Our IP notice in plain language.",
    ogTitle: "This is our work. All of it. | EARNWINGS",
    ogDescription:
      "The EARNWINGS app, notes, screens and presentation are the exclusive property of Cephionix.",
  },
  // The page Google Play's Data safety form asks for; the app links to it too.
  "delete-account": {
    title: "Delete your account | EARNWINGS",
    description:
      "How to delete your EARNWINGS account in the app or by email, what is deleted straight away, and what Cephionix must keep (invoices for 8 years under GST law).",
    ogTitle: "Delete your EARNWINGS account",
    ogDescription: "Delete your EARNWINGS account in the app or by email, and what is kept.",
  },
  support: {
    title: "Support | EARNWINGS",
    description:
      "Get help with EARNWINGS: email support@earnwings.org. We confirm within 24 hours and resolve within 15 days. FAQ links, purchases, account deletion and our Grievance Officer.",
    ogTitle: "EARNWINGS Support",
    ogDescription: "Email support, response times, common questions and our Grievance Officer.",
  },
};

// ── Pilot Guide routes (generated from src/content/guides.js) ────────────────
// The router and top-bar menu use the small list in guideSlugs.js; fail loudly
// if it ever drifts from the guides themselves.
{
  const a = GUIDES.map((g) => `${g.slug}:${g.navLabel}`).join("|");
  const b = GUIDE_MENU.map((g) => `${g.slug}:${g.label}`).join("|");
  if (a !== b) {
    console.error(`gen-routes: src/content/guideSlugs.js is out of sync with guides.js\n  guides: ${a}\n  menu:   ${b}`);
    process.exit(1);
  }
}
ROUTES.guide = {
  title: GUIDE_HUB.metaTitle,
  description: GUIDE_HUB.metaDescription,
  ogTitle: GUIDE_HUB.metaTitle,
  ogDescription: GUIDE_HUB.ogDescription,
};
// A guide may have a search-friendly top-level URL (guideHref). That URL is the
// canonical one: it is served, listed in the sitemap and used in JSON-LD, while
// /guide/<slug> is still served (200) with rel=canonical pointing at it.
for (const g of GUIDES) {
  const meta = {
    title: g.metaTitle,
    description: g.metaDescription,
    ogTitle: g.metaTitle,
    ogDescription: g.summary,
    guide: g.slug,
  };
  const canon = guideHref(g.slug).slice(1);
  ROUTES[`guide/${g.slug}`] = canon === `guide/${g.slug}` ? meta : { ...meta, canonical: canon };
  if (canon !== `guide/${g.slug}`) ROUTES[canon] = meta;
}
ROUTES.live = {
  title: "Live Aircraft at 8 Indian Airports in 3D, Free | EARNWINGS",
  description:
    "Watch real aircraft land and take off at 8 airports: Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, Jaipur, Chandigarh and Leh, in EarnWings 3D models. Free for all.",
  ogTitle: "Live at our 8 airports | EARNWINGS",
  ogDescription: "Real traffic from public ADS-B data in EarnWings' 3D airports: Delhi, Mumbai, Chennai, Bengaluru, Hyderabad, Jaipur, Chandigarh and Leh.",
};
ROUTES["whats-new"] = {
  title: "What's New in EarnWings: Changelog | EARNWINGS",
  description:
    "Every change to EarnWings that students can see, with the date it shipped: live 3D airports at 8 airports, Indian ATC voices for RT, A320 lesson videos, widgets and the Mac app.",
  ogTitle: "What's new in EarnWings",
  ogDescription: "The EarnWings changelog: every student-facing change, dated, newest first.",
};
ROUTES["how-we-check"] = {
  title: "How We Write and Check Our Content | EARNWINGS",
  description:
    "How EarnWings DGCA content is written and checked: syllabus references, automatic question checks, official sources for every guide, and how to report a mistake.",
  ogTitle: "How EarnWings writes and checks its content",
  ogDescription: "Our checks, our sources, and what happens when you report a mistake.",
};
ROUTES["report-exam-questions"] = {
  title: "Report the Questions You Saw in Your DGCA Exam | EARNWINGS",
  description:
    "Just sat a DGCA paper? Tell us the topics and questions you remember, in your own words. Student reports build an honest picture of what DGCA asks, session by session.",
  ogTitle: "Report what you saw in your DGCA exam",
  ogDescription: "Help the next batch: tell us the topics and questions you remember from your DGCA paper.",
};

// ── Public DGCA sample-question pages (scripts/dgca-pages.mjs) ───────────────
const DGCA = buildDgca({ ORIGIN, esc: (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), downloadUrl: DOWNLOAD_URL });
for (const [route, m] of Object.entries(DGCA.routes)) ROUTES[route] = m;
ROUTES.terms = {
  title: "Terms of Service | EARNWINGS",
  description:
    "The EarnWings terms of service in plain English (draft for legal review), plus every data source, 3D model, voice, font and library the app uses, with licences and attribution.",
  ogTitle: "Terms of Service | EARNWINGS",
  ogDescription: "Our terms in plain English, and the data and third-party material EarnWings is built on.",
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
  const url = `${ORIGIN}/${m.canonical || route}`;
  const swap = (html, re, value) => {
    if (!re.test(html)) {
      console.warn(`gen-routes: pattern not found for /${route}: ${re}`);
      return html;
    }
    return html.replace(re, value);
  };
  let html = inlineCss(base);
  // Lean pages (the generated DGCA pages and the new trust pages) never show the
  // hero film, so they skip its poster preloads: about 100 KB less per visit.
  if (m.lean) html = html.replace(/\s*<!--[^>]*?(?:LCP|Hero film)[\s\S]*?-->/g, "").replace(/\s*<link rel="preload" as="image"[^>]*hero-loop[^>]*>/g, "");
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
const breadcrumbLd = (route, name, isGuide = route.startsWith("guide/")) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: isGuide
    ? [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Pilot Guide", item: `${ORIGIN}/guide` },
        { "@type": "ListItem", position: 3, name, item: `${ORIGIN}/${route}` },
      ]
    : [
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
    "<p>EARNWINGS is the all-in-one training cockpit for the next generation of Indian aviators — where ground school, radio telephony, flight-deck practice and DGCA exam prep finally live in one place. It is built and owned by Cephionix.</p>" +
    `<h2>${esc(REGIONS_H2)}</h2><p>${esc(REGIONS_INTRO)}</p>` +
    REGIONS.map((r) => `<h3>${esc(r.code)} — ${esc(r.region)}</h3><p>${esc(r.note)}</p>`).join("") +
    `<p>${esc(REGIONS_FOOTNOTE)}</p>`,
};

// Guide shells: the full text of every guide, from the same module the pages
// and PDFs use.
const blockHtml = (b) => {
  const il = (t) => inlineToHtml(t, ORIGIN);
  switch (b.t) {
    case "p": return `<p>${il(b.text)}</p>`;
    case "h3": return `<h3>${esc(b.text)}</h3>`;
    case "ul": return `<ul>${b.items.map((x) => `<li>${il(x)}</li>`).join("")}</ul>`;
    case "steps":
      return `<ol>${b.items.map((x) => `<li><strong>${il(x.title)}</strong>${x.body ? ` ${il(x.body)}` : ""}${x.items ? `<ul>${x.items.map((y) => `<li>${il(y)}</li>`).join("")}</ul>` : ""}</li>`).join("")}</ol>`;
    case "table":
      return `<table><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${il(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    case "note": return `<aside><strong>${esc(b.title || "Note")}</strong> ${il(b.text)}</aside>`;
    case "figure": return `<figure><figcaption>${esc(b.alt)}</figcaption></figure>`;
    case "shot": return `<figure><img src="/guides/shots/${b.id}.webp" alt="${esc(b.alt)}" loading="lazy"><figcaption>${il(b.caption)}</figcaption></figure>`;
    case "terms": return `<dl>${b.items.map((x) => `<dt>${esc(x.term)}${x.full ? ` (${esc(x.full)})` : ""}</dt><dd>${il(x.def)}</dd>`).join("")}</dl>`;
    default: return "";
  }
};
SHELLS.guide =
  `<h1>${esc(GUIDE_HUB.h1[0])}${esc(GUIDE_HUB.h1[1])}</h1><p>${esc(GUIDE_HUB.intro)}</p>` +
  GUIDES.map((g) => `<h2><a href="${ORIGIN}${guideHref(g.slug)}">${esc(g.title)}</a></h2><p>${esc(g.summary)}</p>`).join("") +
  `<p>Last checked ${esc(LAST_CHECKED)}. ${esc(GUIDE_HUB.disclaimer)}</p>`;
for (const g of GUIDES) {
  SHELLS[`guide/${g.slug}`] =
    `<h1>${esc(g.h1[0])}${esc(g.h1[1])}</h1><p>${inlineToHtml(g.intro, ORIGIN)}</p><p>Updated ${esc(LAST_CHECKED)}. Sources: ${esc(g.sources.slice(0, 2).map((x) => x.label.replace(/\s*\([^)]*\)/g, "")).join("; "))}${g.sources.length > 2 ? ` and ${g.sources.length - 2} more official sources` : ""}.</p><p>${esc(SCREENS_NOTE)}</p>` +
    g.sections.map((sec) => `<h2>${esc(sec.title)}</h2>${sec.blocks.map(blockHtml).join("")}`).join("") +
    `<h2>Official sources</h2><ul>${g.sources.map((x) => `<li><a href="${esc(x.url)}">${esc(x.label)}</a></li>`).join("")}</ul>` +
    `<p>${esc(GUIDE_HUB.disclaimer)}</p>`;
  const canon = guideHref(g.slug).slice(1);
  if (canon !== `guide/${g.slug}`) SHELLS[canon] = SHELLS[`guide/${g.slug}`];
}
SHELLS.live =
  "<h1>Watch India's airports live in 3D</h1><p>Real aircraft from public ADS-B data, placed in the EarnWings 3D models of 8 airports: Delhi (VIDP), Mumbai (VABB), Chennai (VOMM), Bengaluru (VOBL), Hyderabad Begumpet (VOHY), Jaipur (VIJP), Chandigarh (VICG) and Leh (VILH). Free for everyone.</p>";
SHELLS["whats-new"] =
  `<h1>What's new in EarnWings</h1><p>${esc(WHATS_NEW_INTRO)} Updated ${esc(WHATS_NEW_UPDATED)}.</p>` +
  WHATS_NEW.map((e) => `<h2>${esc(e.title)}</h2><p>${esc(e.label)} · ${esc(e.area)}</p><p>${esc(e.body)}</p>`).join("");
SHELLS["how-we-check"] =
  `<h1>${esc(HWC_H1[0])}${esc(HWC_H1[1])}</h1><p>${esc(HWC_INTRO)}</p><p>Updated ${esc(HWC_UPDATED)}.</p>` +
  HWC_SECTIONS.map((x) => `<h2>${esc(x.title)}</h2><ul>${x.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`).join("") +
  `<h2>Last checked</h2><ul><li>Pilot Guide facts, against official sources: ${esc(LAST_CHECKED)}</li><li>Public sample questions, exported from our question bank: ${esc(DGCA.stats.updated)}</li><li>This page: ${esc(HWC_UPDATED)}</li></ul>` +
  `<h2>What we do not claim</h2><ul>${HWC_NOT.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` +
  `<p>Report a mistake: <a href="mailto:${SUPPORT}">${SUPPORT}</a></p>`;
SHELLS["report-exam-questions"] =
  "<h1>Report what you saw in your DGCA exam</h1><p>Just sat a DGCA paper? Tell us which paper, the session month, the topic and the question as you remember it, in your own words. Reports are checked and matched to our question bank, so future students can see which topics really come up.</p>" +
  "<p>Write it from memory. Do not photograph, copy or share exam material.</p>";
// Same text as src/pages/DeleteAccountPage.tsx and SupportPage.tsx, so a reviewer or
// crawler that does not run JavaScript still reads the deletion steps.
SHELLS["delete-account"] =
  "<h1>Delete your EARNWINGS account</h1><p>EARNWINGS is made by Cephionix. You can delete your account at any time. It is permanent.</p>" +
  "<h2>In the app</h2><p>Profile → Account → Delete my account. Enter your password (or, for Google or Apple accounts, sign in with them again or type DELETE), then tap Delete forever.</p>" +
  `<h2>By email</h2><p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a> from the address you sign in with, subject "Delete my EARNWINGS account". We reply within 24 hours and finish within 15 days.</p>` +
  "<h2>Deleted straight away</h2><ul><li>Account and profile</li><li>Study progress and test history</li><li>Notes, highlights and bookmarks</li><li>Vault documents</li><li>Profile photos</li><li>Radio-practice recordings and transcripts</li><li>Files shared in community chats and posts</li><li>Guardian approval record</li><li>Unpaid orders and Fuel history</li></ul>" +
  "<h2>Kept</h2><ul><li>Invoices and payment records (including App Store and Google Play purchases): 8 years from the invoice date, as GST law requires, labelled with a code instead of your account</li><li>Community messages and posts, without your name, until their normal deletion date</li><li>Reports you made, without your name</li><li>Database backups: up to about 12 months</li></ul>";
// Same text as src/pages/RefundsPage.tsx, for crawlers and Razorpay's site review.
SHELLS.refunds =
  "<h1>Refund and cancellation policy</h1><p>Last updated 19 November 2026.</p>" +
  "<p>Plans, add-ons and Fuel boosts bought on this website or in the EARNWINGS Mac app (paid through Razorpay) can be refunded if you ask within 7 days of paying. Purchases made in the iPhone or Android app are refunded by Apple or Google under their own rules.</p>" +
  "<h2>1. Plans and add-ons</h2><p>Ask within 7 days of paying and we refund the full amount. The plan (or add-on) ends when the refund is approved, and the Fuel that came with the plan is taken back.</p>" +
  "<h2>2. Fuel boosts</h2><p>Ask within 7 days of paying and we refund the part you have not used. Fuel you spend after buying a boost counts as spent from that boost first. Refund = price paid × (Fuel left from the boost ÷ Fuel in the boost), rounded down to the whole rupee, and the unused Fuel is removed. Example: a ₹799 boost of 1,000 Fuel; 400 Fuel spent since buying it; 600 left; refund ₹479 and the 600 Fuel is removed. If all of the boost's Fuel is spent, nothing is refundable.</p>" +
  '<h2>3. iPhone and Android purchases</h2><p>Apple and Google refund these under their own rules; our 7-day rule does not apply. Apple: <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>. Google Play: <a href="https://play.google.com/store/account/orderhistory">order history</a>.</p>' +
  '<h2>4. How to ask</h2><p>Tap "Request a refund" next to the purchase: on the <a href="/account">account</a> page on this website, or in Settings in the Mac app or the app in a browser. Saying why is optional. We check it and reply by email.</p>' +
  "<h2>5. When the money reaches you</h2><p>Approved refunds go back to the original payment method through Razorpay. Banks usually take 5 to 7 working days to show it.</p>" +
  `<h2>6. If you bought another plan after this one</h2><p>A person handles these requests, because we cannot end one plan without touching the newer one. Write to <a href="mailto:${SUPPORT}">${SUPPORT}</a>.</p>` +
  "<h2>7. After 7 days</h2><p>After 7 days, except where the law requires otherwise, payments are not refundable.</p>";
SHELLS.support =
  `<h1>Support</h1><p>Email <a href="mailto:${SUPPORT}">${SUPPORT}</a>. We confirm within 24 hours and resolve within 15 days.</p>` +
  '<h2>Common questions</h2><ul><li><a href="/faq">FAQ</a></li><li><a href="/delete-account">Delete your account</a></li><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li><li><a href="/refunds">Refund policy</a></li></ul>' +
  "<h2>Grievance Officer</h2><p>Complaints under the IT Rules 2021 and the DPDP Act 2023 go to our Grievance Officer at the same address.</p>";
for (const [route, m] of Object.entries(DGCA.routes)) SHELLS[route] = m.shell;
const legalBlockHtml = (b) => {
  const il = (t) => inlineToHtml(t, ORIGIN);
  switch (b.t) {
    case "p": case "note": return `<p>${il(b.text)}</p>`;
    case "sub": return `<h3>${esc(b.text)}</h3>`;
    case "callout": return `<p>${b.title ? `<strong>${esc(b.title)}</strong> ` : ""}${il(b.text)}</p>`;
    case "ul": case "dont": case "do": return `<ul>${b.items.map((x) => `<li>${il(x)}</li>`).join("")}</ul>`;
    default: return "";
  }
};
SHELLS.terms =
  `<h1>Terms of Service</h1><p>${esc(TERMS_STATUS)}. Last updated ${esc(TERMS_UPDATED)}.</p>` +
  TERMS.map((t) => `<h2>${esc(t.title)}</h2>${t.blocks.map(legalBlockHtml).join("")}`).join("") +
  `<h2>Licence notices</h2><p>${esc(CREDITS_INTRO)}</p><ul>` +
  CREDITS.map((x) => `<li><strong>${esc(x.name)}</strong> (<a href="${esc(x.licenceUrl)}">${esc(x.licence)}</a>): ${esc(x.attribution)}</li>`).join("") +
  "</ul>";

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
  refunds: "Refund policy",
  copyright: "Copyright & IP",
  guide: "Pilot Guide",
  live: "Live at our airports",
  "whats-new": "What's new",
  "how-we-check": "How we check content",
  "report-exam-questions": "Report your exam questions",
  "delete-account": "Delete your account",
  support: "Support",
};
for (const [route, m] of Object.entries(DGCA.routes)) CRUMB[route] = m.crumbLabel;
for (const g of GUIDES) {
  CRUMB[`guide/${g.slug}`] = g.navLabel;
  CRUMB[guideHref(g.slug).slice(1)] = g.navLabel;
}

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
      "EARNWINGS is a DGCA CPL and ATPL study app for student pilots in India — online ground classes, question banks, mock exams, radio-telephony practice and an A320 flight-deck trainer.",
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
    operatingSystem: "iOS, Android, macOS",
    downloadUrl: DOWNLOAD_URL,
    description:
      "Student pilot app for DGCA CPL and ATPL: online ground classes with interactive notes, 15,000+ practice questions, timed mock exams, voice RT practice in 3D airports, A320 and Cessna 172 cockpit trainers and Captain Aezon.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      // The app is a free download now (owner rule: download and live aircraft are free).
      availability: "https://schema.org/InStock",
    },
  },
];

for (const [route, m] of Object.entries(ROUTES)) {
  let html = pageHtml(route, m);
  // A route flagged noindex gets a real robots meta tag. Without this the flag would
  // have been a comment that looked like configuration — /account would still have
  // been crawled, and a sign-in form outranking the landing page is the worst possible
  // first result for someone searching the product.
  if (m.noindex) {
    html = html.replace("</head>", '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  }

  // Upstream replaced the hard-coded `route === "features"` with a SHELLS lookup, so
  // any route can ship a pre-rendered first paint. Both sides of this merge were
  // additive: the noindex flag above, and the shell mechanism here.
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
  // Structured data always describes the canonical URL, so an alias page (for
  // example /guide/pilot-pathway) never claims to be a separate document.
  const canon = m.canonical || route;
  const scripts = [
    ld({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${ORIGIN}/${canon}#webpage`,
      url: `${ORIGIN}/${canon}`,
      name: m.title,
      description: m.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
    }),
    ld(
      m.breadcrumb
        ? {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: m.breadcrumb.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${ORIGIN}${path}` })),
          }
        : breadcrumbLd(canon, CRUMB[canon] || canon, Boolean(m.guide)),
    ),
    // The site-wide graph on EVERY page: a crawler (or a model) that lands
    // directly on a sub-page can then resolve who publishes it without having
    // to have fetched the homepage first.
    ld(jsonLd),
  ];
  // FAQPage schema lives on /faq only — /features shows a short subset visually
  // but duplicating the same Q&A markup on two URLs is exactly what Google's FAQ
  // guidance warns against.
  if (route === "faq") scripts.push(ld(faqLdFor(FAQ)));
  for (const extra of m.ld || []) scripts.push(ld(extra));
  if (route === "whats-new" || route === "how-we-check") {
    scripts.push(
      ld({
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${ORIGIN}/${route}#article`,
        headline: route === "whats-new" ? "What's new in EarnWings" : "How we write and check our content",
        url: `${ORIGIN}/${route}`,
        mainEntityOfPage: { "@id": `${ORIGIN}/${route}#webpage` },
        inLanguage: "en-IN",
        dateModified: route === "whats-new" ? WHATS_NEW_UPDATED_ISO : HWC_UPDATED_ISO,
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
      }),
    );
  }
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
  if (m.guide) {
    const g = GUIDES.find((x) => x.slug === m.guide);
    const pageUrl = `${ORIGIN}/${canon}`;
    scripts.push(
      ld({
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: g.title,
        description: g.metaDescription,
        url: pageUrl,
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        inLanguage: "en-IN",
        dateModified: LAST_CHECKED_ISO,
        isPartOf: { "@id": SITE_ID },
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
        citation: g.sources.map((x) => ({ "@type": "CreativeWork", name: x.label, url: x.url })),
      }),
    );
    // HowTo only where the page really is an ordered procedure: a guide whose
    // first section is a numbered "steps" list (the pilot route). Each step's
    // text is exactly what the page shows; no costs or times are invented.
    const first = g.sections[0];
    const steps = first?.id === "route" ? first.blocks.find((b) => b.t === "steps") : null;
    if (steps) {
      scripts.push(
        ld({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "@id": `${pageUrl}#howto`,
          name: g.title,
          description: plain(g.intro),
          inLanguage: "en-IN",
          step: steps.items.map((st, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: plain(st.title),
            text: plain(st.body || st.title),
            url: `${pageUrl}#${first.id}`,
          })),
        }),
      );
    }
  }
  html = html.replace("</head>", `    ${scripts.join("\n    ")}\n  </head>`);

  mkdirSync(dirname(join(DIST, `${route}.html`)), { recursive: true });
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
  `<a href="${esc(DOWNLOAD_URL)}">${HERO_CTA}</a>` +
  `<p>${HERO_FREE_LINE}</p>` +
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
  refunds: "0.3",
  copyright: "0.3",
  guide: "0.8",
  live: "0.6",
  "whats-new": "0.6",
  "how-we-check": "0.5",
  "report-exam-questions": "0.5",
  "delete-account": "0.3",
  support: "0.4",
};
for (const g of GUIDES) PRIORITY[guideHref(g.slug).slice(1)] = g.slug === "pilot-pathway" ? "0.9" : "0.7";
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${ORIGIN}/`, priority: "1.0", changefreq: "weekly" },
  // Alias routes (with a canonical elsewhere) are served but never listed.
  ...Object.keys(ROUTES).filter((route) => !ROUTES[route].canonical).map((route) => ({
    loc: `${ORIGIN}/${route}`,
    priority: ROUTES[route].priority || PRIORITY[route] || "0.5",
    changefreq: ["privacy", "terms", "refunds", "copyright", "delete-account"].includes(route) ? "yearly" : "monthly",
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

// ── DGCA page data (what src/pages/DgcaPage.tsx fetches) ─────────────────────
for (const [file, obj] of Object.entries(DGCA.data)) {
  mkdirSync(dirname(join(DIST, file)), { recursive: true });
  writeFileSync(join(DIST, file), JSON.stringify(obj));
}
console.log(
  `gen-routes: DGCA pages: ${DGCA.stats.subjects} subjects, ${DGCA.stats.chapters} chapters, ` +
    `${Object.keys(DGCA.data).length} data files (questions exported ${DGCA.stats.updated})`,
);

console.log(
  `gen-routes: baked meta for ${Object.keys(ROUTES).length} routes + 404.html + ` +
    `${Object.keys(SHELLS).length + 1} content shells + JSON-LD + sitemap (${urls.length} urls)`,
);

// ── Short guide URLs (/egca, /pariksha …) ───────────────────────────────────
// The guides live under /guide/<slug>. A typed or shared short URL gets a tiny
// static page that sends the reader (and crawlers, via canonical) to the real one.
for (const g of GUIDES) {
  if (ROUTES[g.slug]) continue; // never shadow a real top-level page
  const to = `${ORIGIN}${guideHref(g.slug)}`;
  const page =
    `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><title>${esc(g.title)} | EARNWINGS</title>` +
    `<link rel="canonical" href="${to}"><meta name="robots" content="noindex,follow">` +
    `<meta http-equiv="refresh" content="0; url=${guideHref(g.slug)}"></head>` +
    `<body><p>This guide has moved to <a href="${guideHref(g.slug)}">${to}</a>.</p></body></html>`;
  writeFileSync(join(DIST, `${g.slug}.html`), page);
  mkdirSync(join(DIST, g.slug), { recursive: true });
  writeFileSync(join(DIST, g.slug, "index.html"), page);
}

// ── Terms and credits as data, for the app to reuse ─────────────────────────
mkdirSync(join(DIST, "legal"), { recursive: true });
writeFileSync(
  join(DIST, "legal", "terms-and-credits.json"),
  JSON.stringify(
    {
      source: `${ORIGIN}/terms`,
      status: TERMS_STATUS,
      updated: TERMS_UPDATED,
      markup: "Inline text uses **bold** and [label](url). Links starting with / are relative to https://earnwings.org.",
      terms: TERMS,
      creditsIntro: CREDITS_INTRO,
      credits: CREDITS.map(({ name, licence, licenceUrl, attribution }) => ({ name, licence, licenceUrl, attribution })),
    },
    null,
    2,
  ),
);

// ── Are the guide PDFs up to date? ──────────────────────────────────────────
// The PDFs are made by `npm run guides:pdf` (needs Playwright, so it does not run
// in CI) and committed to public/guides. Each run records a hash of the guide
// content; if the content has changed since, say so loudly.
{
  const hash = createHash("sha256").update(JSON.stringify({ GUIDES, GUIDE_HUB, LAST_CHECKED })).digest("hex").slice(0, 16);
  const mf = join("public", "guides", "manifest.json");
  let made = null;
  try { made = JSON.parse(readFileSync(mf, "utf8")).contentHash; } catch { /* none yet */ }
  if (made !== hash) {
    console.warn(
      "\n  !! gen-routes: the Pilot Guide PDFs are OUT OF DATE with src/content/guides.js." +
        "\n     Run `npm run guides:pdf` and commit public/guides/ before deploying.\n",
    );
  }
}
