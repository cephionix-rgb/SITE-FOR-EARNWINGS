// The Pilot Guide's URL slugs and menu labels, kept apart from guides.js so the
// router and the top-bar menu can know them without pulling every guide's text
// into the landing-page bundle. scripts/gen-routes.mjs fails the build if this
// list and GUIDES (slug + navLabel, in order) disagree.
export const GUIDE_MENU = [
  { slug: "pilot-pathway", label: "How to become a pilot", hint: "Every step, the all-in cost and the jobs" },
  { slug: "medical", label: "Medicals", hint: "Class 2 and Class 1, step by step" },
  { slug: "egca", label: "eGCA and Computer Number", hint: "Your DGCA IDs and every form field" },
  { slug: "pariksha", label: "DGCA exams (Pariksha)", hint: "Apply, subjects, exam day, results" },
  { slug: "rtr", label: "RTR licence", hint: "The radio licence, now with DGCA" },
  { slug: "glossary", label: "Beginner glossary", hint: "The words you meet on day one" },
];
export const GUIDE_SLUGS = GUIDE_MENU.map((g) => g.slug);

// Some guides live at a search-friendly top-level URL. That URL is the canonical
// one (sitemap, rel=canonical, internal links); /guide/<slug> keeps working and
// points its canonical at it, so there is never duplicate content.
export const GUIDE_CANONICAL = {
  "pilot-pathway": "/how-to-become-a-pilot-in-india",
};
/** Top-level path -> slug, for the router. */
export const GUIDE_TOP_LEVEL = Object.fromEntries(Object.entries(GUIDE_CANONICAL).map(([s, p]) => [p, s]));
/** The canonical on-site path of a guide. */
export const guideHref = (slug) => GUIDE_CANONICAL[slug] || `/guide/${slug}`;
