// ---------------------------------------------------------------------------
// EARNWINGS marketing site — single source of truth for numbers, cohort
// framing and proof content. Update values HERE; never hardcode them in
// components. Every figure below is real / confirmed by the founder.
// ---------------------------------------------------------------------------

/** Content-scale figures shown across the site (hero stats + proof band). */
export const siteStats = {
  subjects: 5, // DGCA exam subjects
  chapters: 202, // sum of every module chapter (see FlightPathScroll ROWS)
  questions: 10000, // practice questions — rendered as "10,000+"
  ranks: 15, // Cadet -> Commander ladder
} as const;

/**
 * Founding-cohort framing. We show the CAP only ("the first N become Founding
 * Cadets") and never a live filled/remaining count. Change this one number if
 * the cohort size changes (e.g. 2000).
 */
export const FOUNDER_SEATS = 200;

/**
 * Proof-band credibility line (Task 5). Real: a DGCA Chief Ground Instructor
 * and a flight instructor were involved, and student pilots shaped it. Edit the
 * exact wording here.
 */
export const CREDIBILITY_LINE =
  "Built with a DGCA Chief Ground Instructor and a flight instructor, and shaped by student pilots preparing right now.";

/** What the AI Captain is trained on (Task 5). */
export const AI_CAPTAIN_TRAINED =
  "Trained on the full aviation syllabus across every DGCA subject, plus real-world flight scenarios.";

/**
 * Aspirational-moment photo (Task 6) — a real student pilot studying / flight
 * planning. Leave empty to show the graceful navy gradient fallback; set to a
 * path under /public (e.g. "/assets/student-pilot.jpg") when you have the photo.
 */
export const ASPIRATION_IMAGE = "";

/**
 * Real testimonials only. Empty array = the testimonial block renders nothing.
 * Add { quote, name, role } objects here when you have real quotes and the
 * section lights up with no redesign.
 */
export type Testimonial = { quote: string; name: string; role: string };
export const TESTIMONIALS: Testimonial[] = [];
