// Single source of truth for the hero strings that must appear BOTH in the
// React hero (src/sections/HeroSection.tsx) AND in the static shell injected by
// scripts/gen-routes.mjs. Sharing them here guarantees the crawlable shell text
// stays byte-identical to what React renders (different text in each would be
// cloaking). Plain .js so the Node build script can import it too.

// Rendered as: HERO_H1[0] + <span>HERO_H1[1]</span> + <br> + HERO_H1[2].
export const HERO_H1 = ["Pass DGCA ", "faster.", " Fly sooner."];
export const HERO_H1_BRAND = " with EARNWINGS"; // sr-only brand suffix in the h1
export const HERO_INTRO =
  "Real-airway flight planning, voice radio-telephony, an AI ground instructor and full DGCA mock exams — one cockpit. Walk into your exam prepared, not just studied.";
export const HERO_CTA = "Reserve My Captain Seat";
