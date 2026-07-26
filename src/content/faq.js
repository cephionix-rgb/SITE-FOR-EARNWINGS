// Single source of truth for the /features FAQ, imported by BOTH the React
// FeaturesPage AND scripts/gen-routes.mjs, so the visible Q&A text stays
// byte-identical to the FAQPage JSON-LD (Google requires them to match).
// Plain .js so Node can import it. Plain-text answers only — no HTML/markup —
// so the rendered text equals the schema text exactly.
//
// TRUTHFULNESS: every answer below must stay factually accurate. EARNWINGS is an
// independent study app — do NOT add any claim of DGCA affiliation, endorsement
// or approval, and do NOT invent statistics, dates or pricing.
export const FAQ = [
  {
    q: "What is EARNWINGS?",
    a: "EARNWINGS is an all-in-one study app for DGCA CPL and ATPL aspirants. It brings ground school, real-airway flight planning, a voice radio-telephony trainer, an AI Captain and full mock exams together in one place.",
  },
  {
    q: "Is EARNWINGS affiliated with or approved by the DGCA?",
    a: "No. EARNWINGS is an independent study platform and is not affiliated with, endorsed by or approved by the DGCA. Our notes, questions and mock papers are built to follow the DGCA syllabus and exam pattern so your practice matches the real thing.",
  },
  {
    q: "When can I start using it?",
    a: "We are onboarding founding cadets in small batches ahead of the public launch. Join the waitlist and we will email your early-access invite the moment your batch opens.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing is not finalised yet. Founding cadets get founder perks and early access, and we will share full pricing before launch. The waitlist form asks what you would happily pay so we can price it fairly.",
  },
  {
    q: "Which exams and subjects does it cover?",
    a: "EARNWINGS covers the DGCA ground subjects for CPL and ATPL, along with radio-telephony practice, flight planning over real airways, and timed mock exams for every subject.",
  },
  {
    q: "Does the AI Captain make things up?",
    a: "No. The AI Captain answers from the course material and shows its source. When it does not know something, it says so rather than inventing an answer.",
  },
];
