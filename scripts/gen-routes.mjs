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

// Sub-routes: per-route meta, empty root (they do not render the hero).
for (const [route, m] of Object.entries(ROUTES)) {
  const html = pageHtml(route, m);
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
const home = base.replace(
  /<div id="root">\s*<\/div>/,
  `<div id="root">${HERO_SHELL}</div>`,
);
if (home === base) {
  console.warn("gen-routes: hero shell not injected (root div did not match)");
}
writeFileSync(INDEX, home);

console.log(
  `gen-routes: baked per-route meta for ${Object.keys(ROUTES).length} routes + 404.html + home hero shell`,
);
