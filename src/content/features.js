// Single source of truth for the /features hero copy, imported by BOTH the
// React FeaturesPage AND scripts/gen-routes.mjs, so the crawlable static shell
// stays byte-identical to what React renders. Plain .js so Node can import it.

// Rendered as: FEATURES_H1[0] + <span>FEATURES_H1[1]</span> + FEATURES_H1[2].
export const FEATURES_H1 = ["See exactly what ", "EARNWINGS", " does"];
export const FEATURES_INTRO =
  "Tap a system — or let it fly itself — and watch each feature come to life. Your whole DGCA CPL & ATPL toolkit, in one app.";
