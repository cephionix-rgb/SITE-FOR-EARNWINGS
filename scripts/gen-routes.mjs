// Post-build: give each client-side route a real static HTML file so GitHub
// Pages serves it with HTTP 200 (not the 404.html fallback). Without this,
// deep links like /about render for humans but return a 404 status, and Google
// refuses to index anything served with a 404.
//
// For every route we emit BOTH forms so either URL returns 200 with no redirect:
//   dist/about.html          → served for /about   (clean URL, no trailing slash)
//   dist/about/index.html    → served for /about/  (trailing slash)
// Plus dist/404.html as the SPA fallback for any genuinely unknown path.
//
// Keep this list in sync with the <case "/x"> routes in src/App.tsx.
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const INDEX = join(DIST, "index.html");
const ROUTES = ["features", "about", "privacy", "terms"];

if (!existsSync(INDEX)) {
  console.error(`gen-routes: ${INDEX} not found — run "vite build" first.`);
  process.exit(1);
}

// SPA fallback for unmatched paths.
copyFileSync(INDEX, join(DIST, "404.html"));

for (const r of ROUTES) {
  copyFileSync(INDEX, join(DIST, `${r}.html`)); // /about   → 200
  mkdirSync(join(DIST, r), { recursive: true });
  copyFileSync(INDEX, join(DIST, r, "index.html")); // /about/ → 200
}

console.log(`gen-routes: wrote 404.html + ${ROUTES.length} routes (${ROUTES.join(", ")})`);
