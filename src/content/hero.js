// Single source of truth for the hero strings that must appear BOTH in the
// React hero (src/sections/HeroSection.tsx) AND in the static shell injected by
// scripts/gen-routes.mjs. Sharing them here guarantees the crawlable shell text
// stays byte-identical to what React renders (different text in each would be
// cloaking). Plain .js so the Node build script can import it too.

// Rendered as: HERO_H1[0] + <span>HERO_H1[1]</span> + <br> + HERO_H1[2].
export const HERO_H1 = ["Pass DGCA ", "faster.", " Fly sooner."];
export const HERO_H1_BRAND = " with EARNWINGS"; // sr-only brand suffix in the h1
// Names the things student pilots actually search for — "ground classes",
// "student pilot" — while describing what the app genuinely is. The phrases were
// missing from the site entirely, so it could not rank for them.
export const HERO_INTRO =
  "The student pilot app for DGCA CPL and ATPL: online ground classes, real-airway flight planning, voice radio-telephony, an AI ground instructor and full mock exams — one cockpit. Walk into your exam prepared, not just studied.";
export const HERO_CTA = "Reserve My Captain Seat";
