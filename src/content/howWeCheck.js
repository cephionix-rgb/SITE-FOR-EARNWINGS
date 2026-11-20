// /how-we-check: how EarnWings content is written, checked and corrected.
// Imported by BOTH the React page and scripts/gen-routes.mjs.
//
// TRUTHFULNESS: describe only checks that really run. No claim of DGCA approval,
// no pass rates, no reviewer names we have not been cleared to publish.

export const HWC_UPDATED = "18 November 2026";
export const HWC_UPDATED_ISO = "2026-11-18";

export const HWC_H1 = ["How we write and ", "check our content"];
export const HWC_INTRO =
  "Student pilots trust a study app with their exams, so here is exactly how EarnWings content is written, what we check before it reaches you, and what happens when you find a mistake.";

/** @type {{ id: string, title: string, points: string[] }[]} */
export const HWC_SECTIONS = [
  {
    id: "written",
    title: "Who writes it and what it follows",
    points: [
      "EarnWings is built with a DGCA Chief Ground Instructor and a flight instructor, and shaped by student pilots preparing for their exams now.",
      "The course follows the DGCA CPL ground subjects: 12 modules and 202 chapters, from Aviation Meteorology to Radio Telephony. Every chapter has full notes, a one-page summary, a flowchart and visual notes.",
      "Every question explains its right answer, and most also carry a syllabus reference, a line on why each wrong option is wrong, and an exam tip.",
      "Numerical questions from our question generator have their answers worked out by code, not typed in by hand.",
    ],
  },
  {
    id: "checks",
    title: "What we check before a question reaches you",
    points: [
      "Every question must stand on its own. An automatic check finds questions that point at something you cannot see, such as \"in the previous question\" or a numbered figure, and keeps them out of mixed test papers and the AI tutor's quizzes.",
      "Every one of our 15,000+ questions has an explanation of its answer.",
      "1,085 questions come with their own figure, drawn by code from the question's own data rather than pasted in as a picture.",
      "The public sample questions on this website never come from the mock-exam reserve, so the timed papers in the app stay unseen.",
    ],
  },
  {
    id: "guides",
    title: "Pilot Guide: checked against official sources",
    points: [
      "Every guide (medicals, eGCA, Pariksha exams, the RTR licence and the pilot pathway) is checked against official sources: DGCA, eGCA and Pariksha manuals, the Civil Aviation Requirements, PIB releases and the Gazette.",
      "Each guide shows an \"Updated\" date at the top and lists its official sources at the end, with links, so you can check every fact yourself.",
      "Where an official page and our guide ever differ, the official page is right, and we say so on every guide.",
    ],
  },
  {
    id: "radio",
    title: "Radio practice and live data",
    points: [
      "RT scenarios are audited automatically for phraseology, read-backs and the order of calls, and for variety, so no two scenarios in a group play the same.",
      "The charts used in RT practice are pinned to the AIRAC cycle the scenarios were written for. They are for practice only, never for navigation.",
      "Live aircraft come from community ADS-B networks and can be delayed, incomplete or wrong. The live view is for learning, not for any operational use.",
    ],
  },
  {
    id: "ai",
    title: "Captain Aezon, the AI tutor",
    points: [
      "Aezon answers from our own notes and says where the answer came from. When the material does not cover something, it is built to say so rather than guess.",
      "Every diagram, chart and instrument picture Aezon shows is drawn by code from computed values. We do not use AI-generated images anywhere, because a wrongly drawn instrument is not acceptable in pilot training.",
    ],
  },
  {
    id: "errors",
    title: "Found a mistake? Here is what happens",
    points: [
      "Email us with the subject, the chapter and the question or sentence you think is wrong. A screenshot helps.",
      "We check it against the source material. If you are right, we correct the question or note in the app and in our question bank.",
      "Significant corrections are recorded on our What's new page with the date.",
      "We read every report, including the ones that turn out to be right as written; in that case we reply with the reasoning and the source.",
    ],
  },
];

/** What we do not claim. Said plainly at the end of the page. */
export const HWC_NOT = [
  "EarnWings is not run by, approved by or affiliated with the DGCA.",
  "We do not publish pass rates or student numbers we cannot show you.",
  "DGCA does not publish its question papers. Any \"seen in the exam\" data we add will come from student reports and will be labelled that way.",
];

/** "Last checked" dates shown on the page. Keys are labels, values come from the
 *  modules that own them (filled in by the page and by gen-routes). */
export const HWC_CHECK_LABELS = {
  guides: "Pilot Guide facts, against official sources",
  samples: "Public sample questions, exported from our question bank",
  page: "This page",
};
