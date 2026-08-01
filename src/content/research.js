// Single source of truth for /research, imported by BOTH the React page AND
// scripts/gen-routes.mjs.
//
// ATTRIBUTION IS THE WHOLE POINT OF THIS FILE. Every entry below was researched,
// written and published by the people named in `authors` / `publisher`. None of
// it is ours. Rules for adding an entry:
//
//   1. It must be REAL and publicly verifiable. `url` must resolve to the actual
//      publication — not a blog summarising it, not a press aggregator.
//   2. `finding` must be what the source ACTUALLY says. Never round a number up,
//      never generalise beyond the population studied.
//   3. `soWhat` is clearly OUR interpretation and is labelled as such on the
//      page. Keep the two visually and grammatically separate — the reader must
//      always be able to tell the source's claim from our reading of it.
//   4. Citing a study is NOT the study endorsing EARNWINGS. The page says so
//      explicitly, and no entry may imply otherwise.
//
// If a claim cannot satisfy all four, it does not go on the site.

export const RESEARCH_H1 = ["The case for EARNWINGS, ", "in other people's data"];
export const RESEARCH_INTRO =
  "We could tell you ground school is broken and that our app fixes it. Instead, here is the published work — from Boeing's forecasters and from cognitive psychologists who study how people actually learn — and what we built in response to it.";

/** Shown prominently at the top of the page and repeated near the citations. */
export const RESEARCH_DISCLAIMER =
  "None of the research on this page is ours. Each study or forecast below was conducted and published by the organisation or researchers named, and is reproduced here with a link to the original so you can read it yourself. Their inclusion is not an endorsement of EARNWINGS by their authors, and we have no affiliation with any of them.";

/** @type {{id:string,topic:string,headline:string,source:string,authors:string,year:string,url:string,finding:string,soWhat:string,stat?:string,statLabel?:string}[]} */
export const RESEARCH = [
  {
    id: "pilot-demand",
    topic: "The demand",
    headline: "South Asia needs 45,000 new pilots by 2044",
    source: "Pilot and Technician Outlook 2025–2044",
    authors: "The Boeing Company",
    year: "2025",
    url: "https://www.boeing.com/commercial/market/pilot-technician-outlook",
    stat: "45,000",
    statLabel: "new pilots needed in South Asia by 2044",
    finding:
      "Boeing's twenty-year outlook projects that South Asia will require 141,000 new aviation personnel by 2044 — 45,000 of them pilots — and identifies South Asia and Southeast Asia as the fastest-growing regions, where staffing demand is expected to more than triple. Globally the forecast is close to 2.4 million new aviation professionals, including roughly 660,000 pilots.",
    soWhat:
      "Every one of those Indian pilots has to clear the same DGCA ground examinations first. The bottleneck between a person who wants to fly and an airline that needs them is not aircraft or ambition — it is theory, sat as written papers, usually studied alone.",
  },
  {
    id: "study-methods",
    topic: "How students actually study",
    headline: "The two techniques students use most are rated the least effective",
    source:
      "Improving Students' Learning With Effective Learning Techniques, Psychological Science in the Public Interest 14(1), 4–58",
    authors: "Dunlosky, Rawson, Marsh, Nathan & Willingham",
    year: "2013",
    // SAGE blocks non-browser clients (403), so the citation points at the
    // stable PubMed record for the same paper. DOI: 10.1177/1529100612453266
    url: "https://pubmed.ncbi.nlm.nih.gov/26173288/",
    stat: "2 of 10",
    statLabel: "techniques rated high utility — testing and spacing",
    finding:
      "Reviewing hundreds of studies, the authors rated ten common study techniques. Only two earned a high-utility rating: practice testing and distributed practice, because they help learners of different ages and abilities across a wide range of material. Highlighting, summarising and re-reading — among the most common things students do — were rated low utility.",
    soWhat:
      "A cadet with a highlighter and a photocopied set of notes is using two of the techniques the evidence rates lowest. That is not a discipline problem; it is a tooling problem. A question bank organised by chapter and papers sat under the clock are practice testing and distributed practice, delivered by default rather than by willpower.",
  },
  {
    id: "testing-effect",
    topic: "Why testing beats re-reading",
    headline: "Being tested on material beats studying it again",
    source: "Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention, Psychological Science",
    authors: "Roediger & Karpicke",
    year: "2006",
    url: "http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Karpicke-2006_PPS.pdf",
    stat: "1 week",
    statLabel: "later, tested learners retained more than re-readers",
    finding:
      "Participants who studied prose passages and were then tested on them retained more when measured a week later than those who simply restudied the same passages — and retention improved with more testing opportunities. The effect held even when tests were given without feedback. The authors describe retrieval practice as a powerful mnemonic enhancer, not merely a way of measuring what is already known.",
    soWhat:
      "A test is not an assessment at the end of studying; it is the studying. This is why EARNWINGS puts a question bank against every chapter and a full timed paper against every subject, and why the AI Captain quizzes you inside the conversation instead of only answering.",
  },
];

/** What we built in response — kept next to the evidence so the claim is checkable. */
export const RESEARCH_RESPONSE = [
  {
    evidence: "Practice testing is one of only two high-utility techniques",
    built: "10,000+ questions organised by chapter, plus composite mock papers per subject using real DGCA marks and timing.",
  },
  {
    evidence: "Distributed practice is the other",
    built: "202 chapters sequenced in exam order with per-topic progress, so revision is spread across the syllabus instead of crammed the week before.",
  },
  {
    evidence: "Re-reading and highlighting are rated low utility",
    built: "Every chapter is a visual note, a one-glance summary AND a concept flowchart — three different retrieval routes to the same idea, not one page to re-read.",
  },
  {
    evidence: "Retrieval works even without feedback, and better with it",
    built: "Every wrong answer returns a worked explanation and the chapter it came from, and numericals are solved step by step.",
  },
  {
    evidence: "45,000 new pilots needed in South Asia, all sitting DGCA papers",
    built: "A syllabus built for the Indian DGCA CPL and ATPL exams specifically, not a generic aviation course adapted to them.",
  },
];
