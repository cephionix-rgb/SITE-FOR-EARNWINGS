// Single source of truth for /dgca-ground-classes, imported by BOTH the React
// page AND scripts/gen-routes.mjs, so the crawlable static shell carries the
// same words the page renders. Plain .js so Node can import it.
//
// WHY THIS PAGE EXISTS: Indian student pilots search "DGCA ground classes",
// "CPL ground classes" and "ground school app" — phrases the rest of the site
// never used (it says "ground school"). This page targets them.
//
// TRUTHFULNESS (same rule as faq.js): EARNWINGS is a self-paced app, NOT a live
// instructor-led batch. That is stated plainly below rather than blurred, and no
// claim of DGCA affiliation, pass rate, price or student count appears anywhere.

export const GC_H1 = ["DGCA Ground Classes, ", "in an app you carry"];

export const GC_INTRO =
  "Ground classes for DGCA CPL and ATPL that fit around your flying slots — the full syllabus as visual notes, video lectures, chapter MCQs and timed mock papers, with an AI instructor that answers from the material at any hour.";

// Said plainly, high on the page: what this is and what it is not.
export const GC_HONESTY =
  "EARNWINGS is self-paced, not a live batch. There is no fixed class timing to miss and no attendance register — you open the app between flying slots and pick up exactly where you stopped. If you want a live instructor talking to a scheduled class, this is not that.";

// The DGCA ground syllabus as EARNWINGS structures it.
// MIRRORS the ROWS table in src/sections/FlightPathScroll.tsx — keep the names
// and chapter counts identical in both places (they sum to siteStats.chapters).
export const SYLLABUS = [
  { code: "EW 201", name: "Aviation Meteorology I", chapters: 19 },
  { code: "EW 202", name: "Aviation Meteorology II", chapters: 6 },
  { code: "EW 203", name: "General Navigation", chapters: 29 },
  { code: "EW 204", name: "Instruments & Navigation", chapters: 23 },
  { code: "EW 205", name: "Radio Navigation", chapters: 18 },
  { code: "EW 206", name: "Powerplant", chapters: 27 },
  { code: "EW 207", name: "Principles of Flight", chapters: 17 },
  { code: "EW 208", name: "Electrics & Electronics", chapters: 17 },
  { code: "EW 209", name: "Aircraft Performance", chapters: 7 },
  { code: "EW 210", name: "Mass, Balance & Flight Planning", chapters: 3 },
  { code: "EW 211", name: "Air Regulations", chapters: 24 },
  { code: "EW 212", name: "Radio Telephony (RTR)", chapters: 12 },
];

// What a cadet actually gets — every line describes something the app ships.
export const INCLUDED = [
  {
    title: "Full-page visual notes",
    body: "Every chapter rewritten as notes you can revise from, plus a one-glance summary and a concept flowchart for the same topic.",
  },
  {
    title: "Video lectures",
    body: "Recorded lectures wired to the subject and chapter you are on, so the video and the notes cover the same ground.",
  },
  {
    title: "Chapter question banks",
    body: "10,000+ practice questions marked instantly, with the working shown on numericals rather than just a right-or-wrong.",
  },
  {
    title: "Timed DGCA mock papers",
    body: "Composite papers per subject with the real marks, duration and figure questions — then a full analysis of every answer you lost.",
  },
  {
    title: "An AI instructor on call",
    body: "The AI Captain answers from your own notes, cites the source, and says so plainly when the material does not cover it.",
  },
  {
    title: "The flying side too",
    body: "Real-airway flight planning, weight & balance, live METAR/TAF decoding and a voice radio-telephony trainer that scores your phraseology.",
  },
];

// Questions a student pilot actually types before signing up for ground classes.
// Plain text only — mirrored into FAQPage structured data by gen-routes.
export const GC_FAQ = [
  {
    q: "Are these live DGCA ground classes?",
    a: "No. EARNWINGS is a self-paced ground school app, not a live instructor-led batch. You study the notes, videos and question banks on your own schedule, and the AI Captain answers doubts from the course material at any time.",
  },
  {
    q: "Which DGCA subjects do the ground classes cover?",
    a: "The DGCA ground subjects for CPL and ATPL, structured as 12 modules and 202 chapters: Aviation Meteorology, General Navigation, Instruments, Radio Navigation, Powerplant, Principles of Flight, Electrics and Electronics, Aircraft Performance, Mass and Balance with Flight Planning, Air Regulations and Radio Telephony.",
  },
  {
    q: "Can I use it while I am flying at an FTO?",
    a: "That is what it is built for. Ground classes in the app have no fixed timing, so you can study between flying slots, on standby, or after the day's sorties, and your progress follows you across phone, web and desktop.",
  },
  {
    q: "How much do the ground classes cost?",
    a: "Pricing is not finalised yet and will be published before launch. Founding cadets who join the waitlist get early access and founder perks, including the full app free for a week.",
  },
];
