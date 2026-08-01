// ---------------------------------------------------------------------------
// "Why EARNWINGS" — the student-pilot counterpart to neuralwings.org's
// /why-neural-wings damage report. Neural Wings documents what breaks inside an
// FTO; this documents what breaks for the cadet studying inside one, and the
// EARNWINGS system that closes each gap.
//
// TRUTHFULNESS (same rule as content/faq.js): every `fix` below must name
// something the app actually ships. No invented pass rates, dropout figures,
// prices or DGCA endorsements — the problems are described from the training
// experience, never dressed up as survey statistics.
// ---------------------------------------------------------------------------

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM";

export type Category = "Ground school" | "Exams" | "Flying" | "Radio" | "Momentum";

export type Problem = {
  n: number;
  title: string;
  body: string;
  fix: string;
  severity: Severity;
  category: Category;
};

export const WHY_H1 = ["24 Reasons Every DGCA Cadet ", "Needs EARNWINGS."];
export const WHY_INTRO =
  "Ground school runs on photocopied notes, WhatsApp forwards and a question bank nobody marks. Here is the honest list of what that costs you — and exactly which part of EARNWINGS closes each gap.";

export const PROBLEMS: Problem[] = [
  // ── Ground school ────────────────────────────────────────────────────────
  {
    n: 1,
    title: "Your syllabus lives in six places",
    body: "A different book per subject, a senior's photocopied notes, a coaching handout and a WhatsApp folder of screenshots. Nothing tells you what you have actually covered.",
    fix: "All five DGCA subjects broken into 202 chapters in exam order, with a topic-by-topic stepper that marks what you have finished.",
    severity: "CRITICAL",
    category: "Ground school",
  },
  {
    n: 2,
    title: "Notes you can't revise from",
    body: "Photocopies of photocopies, half a diagram missing, someone else's handwriting in the margin. Revision becomes re-learning.",
    fix: "Every chapter rewritten as full-page visual notes, plus a one-glance summary and a concept flowchart for the same topic.",
    severity: "HIGH",
    category: "Ground school",
  },
  {
    n: 3,
    title: "Nobody to ask at 11pm",
    body: "A doubt on a Sunday night waits until the next class — by which time you have moved on and quietly left the gap in place.",
    fix: "The AI Captain answers from your own notes at any hour, shows the source, and says so plainly when the material doesn't cover it.",
    severity: "HIGH",
    category: "Ground school",
  },
  {
    n: 4,
    title: "Generic AI invents aviation",
    body: "Ask a general chatbot about a DGCA topic and you get confident, plausible, occasionally wrong answers — the worst possible thing to revise from.",
    fix: "The Captain is grounded in the course material and refuses rather than guesses. Retrieval is anchored to the chapter you are studying.",
    severity: "CRITICAL",
    category: "Ground school",
  },
  {
    n: 5,
    title: "Theory that never becomes a picture",
    body: "Pressure patterns, engine cycles and airflow are hard to hold in words alone, and a static textbook figure only goes so far.",
    fix: "Concept flowcharts per chapter, video lectures wired to the subject you are on, and instrument figures drawn to scale in the question bank.",
    severity: "MEDIUM",
    category: "Ground school",
  },

  // ── Exams ────────────────────────────────────────────────────────────────
  {
    n: 6,
    title: "A question bank with no marking scheme",
    body: "A thousand-question PDF with an answer key at the back tells you what is right. It never tells you where you stand.",
    fix: "10,000+ questions with instant marking, and a full Captain analysis of every answer you got wrong.",
    severity: "CRITICAL",
    category: "Exams",
  },
  {
    n: 7,
    title: "You've never sat the real paper",
    body: "The first time you feel DGCA timing, composite structure and figure questions should not be on exam day.",
    fix: "Composite mock papers per subject with the real DGCA marks, duration and figure questions, sat under the clock.",
    severity: "CRITICAL",
    category: "Exams",
  },
  {
    n: 8,
    title: "Numericals punished, not taught",
    body: "You get the wrong answer and a red cross. Nothing shows you which step you actually lost it at.",
    fix: "Worked numerical solutions step by step, and the Captain will re-explain any step in the question you missed.",
    severity: "HIGH",
    category: "Exams",
  },
  {
    n: 9,
    title: "No idea which subject will sink you",
    body: "Effort goes to the subject you enjoy. The attempt is lost on the one you have been avoiding for a month.",
    fix: "Per-subject and per-chapter accuracy tracking, so the weak area is a number on your dashboard rather than a feeling.",
    severity: "HIGH",
    category: "Exams",
  },
  {
    n: 10,
    title: "Revision with no plan",
    body: "Four weeks out from the attempt, most cadets re-read chapter one for the fifth time because there is no plan telling them not to.",
    fix: "An exam-aware course planner that lays out what to study and when, built from the papers you have already cleared.",
    severity: "MEDIUM",
    category: "Exams",
  },

  // ── Flying ───────────────────────────────────────────────────────────────
  {
    n: 11,
    title: "Flight planning practised on paper",
    body: "A navigation log filled in from a textbook example teaches the form, not the decision. The airways in it may not even exist any more.",
    fix: "Plan live routes over real ATS airways, waypoints and aerodromes, and get a printable pilot brief at the end of it.",
    severity: "CRITICAL",
    category: "Flying",
  },
  {
    n: 12,
    title: "NOTAMs are somebody else's problem",
    body: "Cadets rarely see a NOTAM until it closes the airspace they planned through, on a day it matters.",
    fix: "NOTAMs are fetched, decoded and applied to your route — the planner reroutes around closed corridors and shows you why.",
    severity: "HIGH",
    category: "Flying",
  },
  {
    n: 13,
    title: "Weather read as a wall of code",
    body: "METAR and TAF are examinable and operational, but most practice stops at decoding one groups-and-abbreviations exercise.",
    fix: "Live METARs, TAFs and SIGMETs decoded group by group, with flight categories, plus live INSAT satellite imagery.",
    severity: "HIGH",
    category: "Flying",
  },
  {
    n: 14,
    title: "Weight & balance done once, forgotten",
    body: "One worked example in class, then nothing until an examiner asks you to justify a load sheet.",
    fix: "Weight & balance and centre-of-gravity calculations built into every plan you build, with the envelope drawn out.",
    severity: "MEDIUM",
    category: "Flying",
  },
  {
    n: 15,
    title: "Charts and procedures locked in a PDF pile",
    body: "SIDs, STARs and approach plates sit in an eAIP nobody has taught you to navigate, going stale between AIRAC cycles.",
    fix: "Published procedures for Indian aerodromes in-app, kept current with the AIRAC cycle and shown against your route.",
    severity: "MEDIUM",
    category: "Flying",
  },
  {
    n: 16,
    title: "Route choices with no reasoning",
    body: "You are told which route to file, not why that one and not the shorter, weather-worse alternative.",
    fix: "A solver that compares routes across five algorithms and cost objectives, so you can see the trade-off you are making.",
    severity: "MEDIUM",
    category: "Flying",
  },

  // ── Radio ────────────────────────────────────────────────────────────────
  {
    n: 17,
    title: "RT rehearsed in a classroom, if at all",
    body: "Phraseology learned by reading it off a page falls apart the first time a real frequency is busy and someone is waiting on you.",
    fix: "Voice-first RT practice against a narrated controller in an animated airport scene — you speak the call, out loud.",
    severity: "CRITICAL",
    category: "Radio",
  },
  {
    n: 18,
    title: "No one marks your phraseology",
    body: "Practising with a classmate means two people making the same mistakes and confirming each other.",
    fix: "Speech-to-text scores what you actually said against standard phraseology and shows the correct call beside yours.",
    severity: "HIGH",
    category: "Radio",
  },
  {
    n: 19,
    title: "Only the easy calls get practised",
    body: "Everyone rehearses start-up and taxi. Almost nobody rehearses an emergency, a FIR crossing or a radio failure.",
    fix: "Local, flight-plan, enroute, FIR-crossing and emergency scenarios, plus light-gun signals and radar-scope work.",
    severity: "HIGH",
    category: "Radio",
  },
  {
    n: 20,
    title: "RTR (A) treated as a separate exam",
    body: "Radio telephony gets crammed at the end as a licence formality instead of being flown alongside everything else.",
    fix: "A basics-to-checkride ladder of staged lessons on the CAR phraseology, with mastery gates before the next stage opens.",
    severity: "MEDIUM",
    category: "Radio",
  },

  // ── Momentum ─────────────────────────────────────────────────────────────
  {
    n: 21,
    title: "Progress you cannot see",
    body: "Months of study with nothing to show but a stack of read chapters. Nothing tells you whether you are on track or drifting.",
    fix: "XP earned from real work — notes read, topics closed, chapters finished, papers sat — on a journey map you can actually see.",
    severity: "HIGH",
    category: "Momentum",
  },
  {
    n: 22,
    title: "Motivation with nothing to hold on to",
    body: "Ground school is long, solitary and unglamorous, and the licence is a year away. Most drop-off happens in that gap.",
    fix: "15 ranks from Cadet to Commander, each unlocking something real, with streaks and a level-up moment when you climb.",
    severity: "HIGH",
    category: "Momentum",
  },
  {
    n: 23,
    title: "Studying alone in a batch of thirty",
    body: "You have no idea whether you are ahead or behind until results come out, and nobody to push against in the meantime.",
    fix: "Leaderboards and head-to-head compete matches against other cadets on the same syllabus.",
    severity: "MEDIUM",
    category: "Momentum",
  },
  {
    n: 24,
    title: "Everything lives on one device",
    body: "Notes on a laptop, questions on a phone, plans on a friend's tablet — and no single place your progress actually lives.",
    fix: "One app across iOS, Android, Web, Mac and Windows, with your progress, plans and perks following you between them.",
    severity: "MEDIUM",
    category: "Momentum",
  },
];

export const CATEGORIES: Category[] = [
  "Ground school",
  "Exams",
  "Flying",
  "Radio",
  "Momentum",
];
