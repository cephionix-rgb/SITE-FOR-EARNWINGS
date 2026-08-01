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
import { FAQ } from "../src/content/faq.js";
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

function pageHtml(route, m) {
  const url = `${ORIGIN}/${route}`;
  const swap = (html, re, value) => {
    if (!re.test(html)) {
      console.warn(`gen-routes: pattern not found for /${route}: ${re}`);
      return html;
    }
    return html.replace(re, value);
  };
  let html = base;
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
    faqBlock(FAQ),

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

  about:
    "<h1>Built by pilots-in-training, for pilots-in-training</h1>" +
    "<p>EARNWINGS is the all-in-one training cockpit for the next generation of Indian aviators — where ground school, flight planning, radio telephony and DGCA exam prep finally live in one place. It is built and owned by Cephionix.</p>",
};

/** Human-readable crumb label per route. */
const CRUMB = {
  features: "Features",
  "dgca-ground-classes": "DGCA Ground Classes",
  "why-earnwings": "Why EARNWINGS",
  about: "About",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  copyright: "Copyright & IP",
};

for (const [route, m] of Object.entries(ROUTES)) {
  let html = pageHtml(route, m);

  const shell = SHELLS[route];
  if (shell) {
    html = html.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${hidden(shell)}</div>`,
    );
  }

  const scripts = [ld(breadcrumbLd(route, CRUMB[route] || route))];
  if (route === "features") scripts.push(ld(faqLdFor(FAQ)));
  if (route === "dgca-ground-classes") scripts.push(ld(faqLdFor(GC_FAQ)));
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
let home = base.replace(
  /<div id="root">\s*<\/div>/,
  `<div id="root">${HERO_SHELL}</div>`,
);
if (home === base) {
  console.warn("gen-routes: hero shell not injected (root div did not match)");
}

// Phase 3: structured data on the home page. No SearchAction (there is no site
// search) and no aggregateRating/review markup (there are no reviews) - both
// would be false signals / a manual-action risk.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    name: "EARNWINGS",
    url: `${ORIGIN}/`,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EARNWINGS",
    author: { "@type": "Organization", name: "Cephionix" },
    publisher: { "@type": "Organization", name: "Cephionix" },
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
