// "Zero to CPL": the visual route map of the pilot pathway.
//
// Used by: the route map at the top of the pathway guide
// (src/components/guide/RouteMap.tsx), the homepage teaser
// (src/sections/RouteTeaser.tsx) and the brochure PDF
// (scripts/make-route-pdf.mjs -> public/guides/earnwings-zero-to-cpl.pdf).
//
// NOTHING NEW IS STATED HERE. Every fee, time, age and rule below is one already
// written, with its official source, in src/content/guides.js (the pathway,
// medical, eGCA, Pariksha and RTR guides). If a fact changes, change it there
// first, then here, then run `npm run route:pdf`.
//
// Order: the guide's own. The eGCA ID comes before the first medical because
// medicals are booked on eGCA ("You need an eGCA ID first", Medicals guide), and
// both medicals come before ground classes because the guide's advice is to do
// them "before you pay any big fee". Never state per-chapter question counts.
//
// Cost kinds: "official" = a fee fixed by DGCA/MoCA (exact); "typical" = an
// indicative range from the guide (November 2026, not official); "note" = no fee.

export const ROUTE_UPDATED = "18 November 2026";
export const ROUTE_PDF = "/guides/earnwings-zero-to-cpl.pdf";
export const ROUTE_PAGE = "/how-to-become-a-pilot-in-india";

/**
 * @typedef {{ t: string, kind: "official"|"typical"|"note" }} Chip
 * @typedef {{
 *   id: string, n: number, short: string, title: string, stage: string,
 *   time: string, cost: Chip, extra?: Chip, body: string, first: string,
 *   more: { label: string, href: string },
 *   ew?: { t: string, href: string }, branch?: boolean
 * }} Waypoint
 */

/** @type {Waypoint[]} */
export const WAYPOINTS = [
  {
    id: "class12",
    n: 1,
    short: "Class 12",
    title: "Class 12 with Physics and Maths",
    stage: "School",
    time: "Class 11 and 12",
    cost: { t: "Don't pay for flying yet", kind: "note" },
    body: "A CPL needs Class 12 passed with Physics and Mathematics from a recognised board (a compartment or fail in either is not accepted) and age 18 when it is issued. Adding them later through an open school such as NIOS? DGCA does not name NIOS: ask the Pariksha helpdesk before you rely on it.",
    first: "Take Physics and Maths in Class 11 and 12, and make every later document match the name and date of birth on your Class 10 certificate.",
    more: { label: "Education rules", href: "#education" },
  },
  {
    id: "ids",
    n: 2,
    short: "eGCA + Computer Number",
    title: "eGCA ID and Pariksha Computer Number",
    stage: "Your DGCA IDs",
    time: "Instant to 12 working days",
    cost: { t: "Free", kind: "official" },
    body: "Two free DGCA IDs: eGCA for medicals, licences and your logbook; the Pariksha Computer Number for every theory exam. The Computer Number is instant through DigiLocker, or within 12 working days the manual way.",
    first: "Sign up on eGCA as a Pilot, then register on Pariksha in the blue FLIGHT CREW box. Keep your photo and signature to DGCA's size rules.",
    more: { label: "eGCA and Computer Number guide", href: "/guide/egca" },
  },
  {
    id: "class2",
    n: 3,
    short: "Class 2 medical",
    title: "Class 2 medical",
    stage: "Medicals",
    time: "From age 16 · valid 24 months",
    cost: { t: "₹3,000 at an IAF centre", kind: "official" },
    body: "Needed for the SPL, the PPL and the radio licence. Book on eGCA with any DGCA-empanelled examiner. Valid 24 months up to age 50. A medical problem is the one thing money cannot fix, so do it first.",
    first: "Log in to eGCA, open Medical services, pick an examiner and book. Tell the truth on the declaration.",
    more: { label: "Medicals guide", href: "/guide/medical" },
  },
  {
    id: "class1",
    n: 4,
    short: "Class 1 medical",
    title: "Your first Class 1 medical",
    stage: "Medicals",
    time: "DGCA assessment: indicative 30 days",
    cost: { t: "₹5,000 at an IAF centre", kind: "official" },
    body: "The CPL needs Class 1. Your first one is at an IAF centre (New Delhi, Bengaluru or Jorhat) or a DGCA-approved civil aeromedical centre, after your Class 2 certificate. Do it before you pay any big fee.",
    first: "With your Class 2 CA-35 in hand, book the Class 1 initial on eGCA and upload your test reports before the exam.",
    more: { label: "Medicals guide", href: "/guide/medical" },
  },
  {
    id: "papers",
    n: 5,
    short: "Ground prep + DGCA papers",
    title: "Ground prep and the five DGCA papers",
    stage: "Theory",
    time: "4 regular + 8 on-demand sessions a year",
    cost: { t: "₹2,500 a paper (regular)", kind: "official" },
    extra: { t: "Ground classes ₹2–5 lakh if bought separately", kind: "typical" },
    body: "Air Regulations, Air Navigation, Meteorology, Technical General and Technical Specific, sat on Pariksha. ₹5,000 a paper on demand. Your passes must fall within 5 years before you apply for the CPL.",
    first: "Download the syllabus and the exam calendar from Pariksha's Examinations menu, then plan which session you will sit each paper in.",
    more: { label: "DGCA exams (Pariksha) guide", href: "/guide/pariksha" },
    ew: { t: "notes, question bank, mock papers", href: "/dgca-ground-classes" },
  },
  {
    id: "rtr",
    n: 6,
    short: "RTR(A) + ELP",
    title: "RTR(A) radio licence and English (ELP)",
    stage: "Radio and English",
    time: "Written pass counts 3 years",
    cost: { t: "₹7,500 RTR fees to DGCA", kind: "official" },
    extra: { t: "ELP: set by the training organisation", kind: "note" },
    body: "Since 1 December 2025 DGCA runs the RTR: a 50-question written exam on Pariksha (pass 70%) and a practical radio test of about 30 minutes (pass 50%). ELP needs at least ICAO Level 4 after approved training.",
    first: "Get your Computer Number, then sit the RTR written in a normal Pariksha session and book the practical on eGCA.",
    more: { label: "RTR licence guide", href: "/guide/rtr" },
    ew: { t: "RT trainer: say the calls out loud in 3D airports", href: "/features#rt" },
  },
  {
    id: "school",
    n: 7,
    short: "Flying school: SPL, 200 hours",
    title: "Flying school: SPL, then 200 hours",
    stage: "Flying",
    time: "Commonly 18–24 months to a CPL",
    cost: { t: "₹35–55 lakh to fly 200 hours in India", kind: "typical" },
    extra: { t: "Abroad: about ₹40–80 lakh incl. living", kind: "typical" },
    body: "Fly at a DGCA-approved school (42 were listed on 11 November 2026). SPL from age 16 (₹1,000), then at least 200 hours with skill tests. Most schools add an Instrument Rating and multi-engine training on the way.",
    first: "Use DGCA's approved-school list and ranking, then ask each school, and its current students, for numbers: aircraft flying this month, hours per student per month, the itemised cost and the refund policy.",
    more: { label: "Choosing a flying school", href: "#school" },
  },
  {
    id: "conversion",
    n: 0,
    branch: true,
    short: "Abroad? Convert",
    title: "Trained abroad: convert your licence",
    stage: "Abroad branch",
    time: "Indicative 25 days on eGCA",
    cost: { t: "₹5,000 CPL conversion", kind: "official" },
    body: "A licence from an ICAO country converts to an Indian CPL: the Air Regulations paper and a composite paper, a skill test in India, the RTR and the signals exam, plus the Indian age, education and medical rules.",
    first: "Before you pay a foreign school, read DGCA's December 2025 public notice cautioning students who train abroad, and get every term in writing.",
    more: { label: "Training abroad", href: "#school" },
  },
  {
    id: "cpl",
    n: 8,
    short: "CPL issue",
    title: "Apply for your CPL on eGCA",
    stage: "The licence",
    time: "Indicative 15 days (Indian schools)",
    cost: { t: "₹5,000", kind: "official" },
    body: "Age 18, a Class 1 medical, the five papers, at least 200 hours and a current FRTOL (radio licence). A CPL is valid for 10 years; your Class 1 must stay current to use it.",
    first: "Check that your passes are within 5 years and your skill tests within the last 6 months, then apply on eGCA.",
    more: { label: "The licences, step by step", href: "#licences" },
  },
  {
    id: "selection",
    n: 9,
    short: "Airline selection",
    title: "Airline selection",
    stage: "To the airline",
    time: "Batch by batch",
    cost: { t: "Never pay an agent for a slot", kind: "note" },
    body: "Most selections mix a written test on the DGCA subjects, aptitude tests, a group exercise and interviews, a simulator check and document checks. Apply only through the airline's own careers page.",
    first: "Keep your CPL, Class 1, ELP and RTR/FRTOL current on the day, and keep your DGCA subjects fresh.",
    more: { label: "Airline selection", href: "#selection" },
    ew: { t: "practice questions, RT practice, free live aircraft", href: "/live" },
  },
  {
    id: "type",
    n: 10,
    short: "Type rating",
    title: "Type rating, when an airline asks",
    stage: "To the airline",
    time: "When an airline asks",
    cost: { t: "₹15–35 lakh if self-funded", kind: "typical" },
    body: "Training on one airliner type, such as the A320 or B737, in a full-flight simulator, then base training in the aircraft. Many airlines arrange it after selection. Do not buy one speculatively.",
    first: "Wait for the airline to tell you the type. Read any bond before you sign it.",
    more: { label: "Instrument, multi-engine and type ratings", href: "#ratings" },
    ew: { t: "A320 cockpit lessons", href: "/features#a320" },
  },
  {
    id: "fo",
    n: 11,
    short: "First officer",
    title: "First officer: the right-hand seat",
    stage: "Destination",
    time: "Induction can take months",
    cost: { t: "Bond terms vary by airline", kind: "note" },
    body: "Airlines start batches when they need pilots. After induction: type rating, base training, then line training with a training captain. Captain comes later, with an ATPL (1,500 hours).",
    first: "While you wait, keep every document current and read the training agreement, bond and notice period early.",
    more: { label: "Waiting for induction", href: "#induction" },
  },
];

/** The main line (the India route), in flying order. The conversion is a branch. */
export const MAIN = WAYPOINTS.filter((w) => !w.branch);
export const BRANCH = WAYPOINTS.find((w) => w.branch);

/** Summary bar: all from the pathway guide's "What it costs" section. */
export const SUMMARY = [
  { k: "Time", v: "18–24 months", d: "Commonly, from joining a school to a CPL in India; longer with weather or aircraft delays" },
  { k: "CPL in India, all-in", v: "₹45–70 lakh", d: "Typical; delays and extra hours can push it higher" },
  { k: "CPL abroad instead", v: "₹40–80 lakh", d: "Commonly quoted incl. living costs, plus the Indian conversion" },
  { k: "Type rating, later", v: "₹15–35 lakh", d: "If you fund it yourself; often arranged by the airline" },
];

export const COST_NOTE =
  "Ranges are typical, not official: from schools' published fees and news reports as of November 2026. Official DGCA fees are shown exactly. Get every school's quote itemised and in writing.";

export const ROUTE_DISCLAIMER =
  "EARNWINGS is an independent study app. It is not part of, approved by or affiliated with DGCA, the Ministry of Civil Aviation or any government body. Rules, fees and forms change: always confirm on the official page before you apply or pay.";

/** Official fees at a glance (each one is in guides.js with its source). */
export const OFFICIAL_FEES = [
  ["Class 2 medical at an IAF centre", "₹3,000", "CAR Section 7 Series C Part I, para 4.3"],
  ["Class 1 medical at an IAF centre", "₹5,000", "CAR Section 7 Series C Part I, para 4.3"],
  ["eGCA ID and Computer Number", "Free", "eGCA and Pariksha manuals"],
  ["DGCA paper, regular session", "₹2,500", "Pariksha manual (Sept 2026)"],
  ["DGCA paper, on demand", "₹5,000", "Pariksha manual (Sept 2026)"],
  ["RTR written + practical + licence", "₹2,000 + ₹500 + ₹5,000", "RTR Rules 2025"],
  ["Student Pilot Licence (SPL)", "₹1,000", "eGCA timelines (Sept 2026)"],
  ["CPL issue", "₹5,000", "eGCA timelines (Sept 2026)"],
  ["CPL conversion (foreign licence)", "₹5,000", "eGCA timelines (Sept 2026)"],
];

/** Typical ranges at a glance, in lakh, for the brochure's bar chart. */
export const TYPICAL_RANGES = [
  { l: "Ground classes (if bought separately)", lo: 2, hi: 5 },
  { l: "Flying 200 hours in India", lo: 35, hi: 55 },
  { l: "CPL abroad, incl. living", lo: 40, hi: 80 },
  { l: "CPL in India, all-in", lo: 45, hi: 70 },
  { l: "Type rating (if self-funded)", lo: 15, hi: 35 },
];
