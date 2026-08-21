// Single source of truth for the EARNWINGS FAQ, imported by the /faq page, the
// /features page (featured subset) AND scripts/gen-routes.mjs, so the visible
// Q&A text stays byte-identical to the FAQPage JSON-LD (Google requires them to
// match). Plain .js so Node can import it. Plain-text answers only — no
// HTML/markup — so the rendered text equals the schema text exactly.
//
// TRUTHFULNESS: every answer below must stay factually accurate. EARNWINGS is an
// independent study app — do NOT add any claim of DGCA affiliation, endorsement
// or approval, and do NOT invent statistics or dates. Where something genuinely
// is not decided yet (pricing, launch date), say that plainly rather than
// guessing: an answer that later turns out to be wrong costs more trust than an
// honest "not yet". Only describe features the app actually ships.

export const FAQ_CATEGORIES = [
  "About EARNWINGS",
  "Ground classes & study material",
  "Exams & practice",
  "The AI Captain",
  "Flying, weather & radio",
  "Access & launch",
];

/** @type {{q:string,a:string,category:string,featured?:boolean}[]} */
export const FAQ = [
  // ── About EARNWINGS ───────────────────────────────────────────────────────
  {
    category: "About EARNWINGS",
    featured: true,
    q: "What is EARNWINGS?",
    a: "EARNWINGS is an all-in-one study app for DGCA CPL and ATPL aspirants. It brings ground school, real-airway flight planning, a voice radio-telephony trainer, an AI Captain and full mock exams together in one place, so your notes, your practice, your flight plans and your progress all live in the same app instead of a dozen disconnected ones.",
  },
  {
    category: "About EARNWINGS",
    q: "Who is EARNWINGS for?",
    a: "Student pilots preparing for the DGCA ground examinations — whether you are already flying at an FTO and studying between slots, preparing on your own, repeating a subject you did not clear, or attending ground classes elsewhere and looking for serious practice and mock papers alongside them.",
  },
  {
    category: "About EARNWINGS",
    q: "Who builds EARNWINGS?",
    a: "EARNWINGS is built and owned by Cephionix, which also builds Neural Wings, a management platform for flying training organisations. The course material was shaped with a DGCA Chief Ground Instructor, a flight instructor and student pilots preparing right now.",
  },
  {
    category: "About EARNWINGS",
    featured: true,
    q: "Is EARNWINGS only for DGCA and India?",
    a: "Today, yes — every chapter, question bank and mock paper is built for the DGCA syllabus and the Indian exam pattern, because a course written for every regulator fits none of them properly. The same engine is being taken to other syllabuses next: Transport Canada first, then EASA in Europe, then the FAA in the United States. Those are on the roadmap rather than in the app, and we have not announced dates for them.",
  },
  {
    category: "About EARNWINGS",
    q: "Which devices can I use it on?",
    a: "EARNWINGS is built for iOS, Android, Web, Mac and Windows from a single codebase, and your progress, plans and perks follow you across every device you sign in on. Study on a laptop at home, revise on your phone at the airfield, and pick up exactly where you stopped.",
  },

  // ── Ground classes & study material ───────────────────────────────────────
  {
    category: "Ground classes & study material",
    featured: true,
    q: "Which exams and subjects does it cover?",
    a: "EARNWINGS covers the DGCA ground subjects for CPL and ATPL, along with radio-telephony practice, flight planning over real airways, and timed mock exams for every subject. The syllabus is broken into 12 modules and 202 chapters, kept in the order you actually sit them.",
  },
  {
    category: "Ground classes & study material",
    q: "Are these live ground classes with an instructor?",
    a: "No, and we would rather say so plainly. EARNWINGS is a self-paced ground school app, not a live instructor-led batch. There is no fixed class timing to miss and no attendance register — you open the app between flying slots and continue from where you stopped. If what you want is a scheduled class with a live teacher, this is not that.",
  },
  {
    category: "Ground classes & study material",
    q: "What does the study material actually look like?",
    a: "Every chapter is turned into three things: full-page visual notes you can revise from, a one-glance summary of the whole chapter, and a concept flowchart showing how the ideas connect. The same idea lands three different ways, which is what makes it stick for the paper and for the aircraft.",
  },
  {
    category: "Ground classes & study material",
    q: "Are there video lectures?",
    a: "Yes. Recorded lectures are wired to the specific subject and chapter you are studying, so the video and the notes cover the same ground instead of sending you elsewhere to find the explanation.",
  },
  {
    category: "Ground classes & study material",
    q: "Can I use it alongside the ground classes at my FTO?",
    a: "That is one of the main ways people use it. Your FTO teaches the syllabus on its schedule; EARNWINGS gives you the notes, question banks and timed mock papers to practise on yours. Nothing clashes, because the chapter structure follows the same DGCA syllabus.",
  },
  {
    category: "Ground classes & study material",
    q: "How do I know what I have already covered?",
    a: "Each chapter breaks into topics with a stepper that marks off what you have finished, so at any moment you can see which chapters are complete, which are part-done and which you have not opened. No more guessing whether you actually covered a section a month ago.",
  },

  // ── Exams & practice ──────────────────────────────────────────────────────
  {
    category: "Exams & practice",
    q: "How many practice questions are there?",
    a: "Over 10,000 practice questions across the subjects, organised by chapter so you can drill exactly the topic you just studied rather than working through an undifferentiated pile.",
  },
  {
    category: "Exams & practice",
    featured: true,
    q: "Are the mock exams like the real DGCA paper?",
    a: "Yes — that is the point of them. Mock papers are composite, per subject, and use the real DGCA marks, duration and figure questions, sat under the clock. The first time you feel real exam timing should not be on exam day.",
  },
  {
    category: "Exams & practice",
    q: "What happens after I finish a mock paper?",
    a: "You get a full analysis rather than just a score: every question you got wrong, why the correct answer is correct, and which chapter it came from, so you know exactly what to go back and revise.",
  },
  {
    category: "Exams & practice",
    q: "Do numerical questions show the working?",
    a: "Yes. Numericals are solved step by step rather than showing only the final answer, and you can ask the AI Captain to re-explain any individual step you did not follow. A red cross with no explanation teaches you nothing.",
  },
  {
    category: "Exams & practice",
    q: "How do I find out which subject is my weakest?",
    a: "Accuracy is tracked per subject and per chapter, so your weak area is a number on your dashboard instead of a feeling. Most attempts are lost on the subject a cadet has been quietly avoiding, and this is designed to make that impossible to avoid.",
  },

  // ── The AI Captain ────────────────────────────────────────────────────────
  {
    category: "The AI Captain",
    q: "What is the AI Captain?",
    a: "It is a ground instructor built into the app that answers your doubts at any hour, from your own course material. It explains concepts, decodes METARs step by step, quizzes you inside the chat, and can turn a conversation into a study plan you send to your planner.",
  },
  {
    category: "The AI Captain",
    featured: true,
    q: "Does the AI Captain make things up?",
    a: "No. The AI Captain answers from the course material and shows its source. When it does not know something, it says so rather than inventing an answer. A confident wrong answer is worse than no answer when you are revising for an exam.",
  },
  {
    category: "The AI Captain",
    q: "Can it build me a study plan?",
    a: "Yes. It can lay out what to study and in what order based on the papers you have already cleared and the ones you are targeting, and export that plan into your planner so it becomes a schedule rather than advice you forget.",
  },

  // ── Flying, weather & radio ───────────────────────────────────────────────
  {
    category: "Flying, weather & radio",
    q: "Can I plan real flights, or is it a simulation?",
    a: "Real ones. You plan over genuine ATS airways, waypoints and aerodromes — not a simplified map — and get a printable pilot brief at the end. Plan Delhi to Chennai in EARNWINGS and you are planning it over airways that actually exist.",
  },
  {
    category: "Flying, weather & radio",
    q: "Does it handle NOTAMs and live weather?",
    a: "Yes. NOTAMs are fetched, decoded and applied to your route, so the planner reroutes around closed airspace and shows you why. Live METARs, TAFs and SIGMETs are decoded group by group with flight categories, alongside satellite imagery.",
  },
  {
    category: "Flying, weather & radio",
    q: "Can I do weight and balance calculations?",
    a: "Yes — weight and balance and centre-of-gravity calculations are built into the plans you build, with the envelope drawn out. It stops being a one-off classroom example and becomes something you have done many times before an examiner ever asks.",
  },
  {
    category: "Flying, weather & radio",
    q: "How does the radio telephony trainer work?",
    a: "It is voice-first. An animated airport scene plays with a narrated controller, you hold the mic and speak the call out loud, and speech-to-text scores what you actually said against standard phraseology — then shows the correct call beside yours. Practising with a classmate means two people confirming the same mistakes; this does not.",
  },
  {
    category: "Flying, weather & radio",
    q: "Does it help with RTR (A)?",
    a: "Yes. Beyond individual scenarios there is a staged ladder of lessons on standard phraseology that unlocks as you demonstrate mastery, covering local, flight-plan, enroute, FIR-crossing and emergency situations, plus light-gun signals — including the calls almost nobody practises until they need them.",
  },

  // ── Access & launch ───────────────────────────────────────────────────────
  {
    category: "Access & launch",
    featured: true,
    q: "When can I start using it?",
    a: "We are onboarding founding cadets in small batches ahead of the public launch. Join the waitlist and we will email your early-access invite the moment your batch opens.",
  },
  {
    category: "Access & launch",
    featured: true,
    q: "How much will it cost?",
    a: "Pricing will be unveiled before launch. We would rather publish it properly than quote a number we might change. Founding cadets get founder perks and early access regardless, and the waitlist form asks what you would happily pay so we can price it fairly for student pilots.",
  },
  {
    category: "Access & launch",
    q: "What do founding cadets actually get?",
    a: "The full app free for a week, the first chapters of every subject unlocked with their MCQ banks, one sample paper per subject, and five each of RT scenarios, flight plans, weight and balance calculations, METAR challenges, compete matches and Ask-Captain doubts. Clear the Cadet to Commander quiz on the site and every five becomes ten.",
  },
];

/** The short set shown on /features — the full list lives on /faq. */
export const FAQ_FEATURED = FAQ.filter((f) => f.featured);
