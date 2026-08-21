// Where EARNWINGS works today and where it is going next. Imported by the
// Roadmap component AND scripts/gen-routes.mjs so the text is crawlable.
//
// TRUTHFULNESS: exactly ONE region may ever carry status "live". Everything else
// is a plan, and the page must read as a plan — no dates are promised anywhere
// because none have been announced, and "coming soon" with a missed date costs
// more trust than "next, no date yet". If a syllabus genuinely ships for another
// regulator, move its status to "live" here and nowhere else.

export const REGIONS_EYEBROW = "Where EARNWINGS flies";
export const REGIONS_H2 = "Built for India first. Not only India.";
export const REGIONS_INTRO =
  "Every chapter, question bank and mock paper in EARNWINGS today is built for the DGCA syllabus and the Indian exam pattern — deliberately, because a course written for everyone fits no one. The same engine is being taken to the other regulators next, in this order.";

/** @type {{code:string,authority:string,region:string,status:"live"|"next"|"planned",note:string}[]} */
export const REGIONS = [
  {
    code: "DGCA",
    authority: "Directorate General of Civil Aviation",
    region: "India",
    status: "live",
    note: "The full CPL and ATPL ground syllabus — 12 modules, 202 chapters — with question banks and mock papers built to the DGCA marks and timing. This is what the app is today.",
  },
  {
    code: "TCCA",
    authority: "Transport Canada Civil Aviation",
    region: "Canada",
    status: "next",
    note: "The next syllabus we take the engine to, for Canadian licence candidates.",
  },
  {
    code: "EASA",
    authority: "European Union Aviation Safety Agency",
    region: "Europe",
    status: "planned",
    note: "The European ATPL theory subjects, after Canada.",
  },
  {
    code: "FAA",
    authority: "Federal Aviation Administration",
    region: "United States",
    status: "planned",
    note: "US written exams, after Europe.",
  },
];

/** Wording for each status — kept here so no component invents a stronger claim. */
export const REGION_STATUS = {
  live: { label: "Available now", tone: "live" },
  next: { label: "Next", tone: "next" },
  planned: { label: "Planned", tone: "planned" },
};

/** Said plainly under the roadmap. */
export const REGIONS_FOOTNOTE =
  "Canada, Europe and the United States are on the roadmap, not in the app. We have not announced dates for them, and we would rather say that than promise a month we might miss. Everything you can use today is DGCA.";
