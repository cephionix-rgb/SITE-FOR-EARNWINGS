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

// /features gets its real (byte-identical) hero shell too - it is the sub-route
// that will carry FAQPage schema and target non-brand queries. /about, /privacy
// and /terms keep an empty root (their meta is enough).
// The FAQ text is baked into the shell too (visually hidden) so the served HTML
// carries the exact Q&A that the FAQPage JSON-LD references — keeping the
// structured data matched to on-page content, which Google requires.
const FAQ_SHELL = FAQ.map(
  (f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`,
).join("");
const FEATURES_SHELL =
  '<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);border:0;padding:0;margin:-1px;">' +
  `<h1>${FEATURES_H1[0]}<span>${FEATURES_H1[1]}</span>${FEATURES_H1[2]}</h1>` +
  `<p>${esc(FEATURES_INTRO)}</p>` +
  FAQ_SHELL +
  "</div>";

// FAQPage structured data for /features — built from the SAME faq.js the page
// renders, so schema text is byte-identical to the visible answers.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
const faqScript = `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;

for (const [route, m] of Object.entries(ROUTES)) {
  let html = pageHtml(route, m);
  if (route === "features") {
    html = html.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${FEATURES_SHELL}</div>`,
    );
    html = html.replace("</head>", `    ${faqScript}\n  </head>`);
  }
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
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/assets/logo-512.png`,
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
      "DGCA CPL and ATPL ground-school app: real-airway flight planning, an RT trainer, an AI Captain and full mock exams.",
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

console.log(
  `gen-routes: baked meta for ${Object.keys(ROUTES).length} routes + 404.html + home hero shell + JSON-LD`,
);
