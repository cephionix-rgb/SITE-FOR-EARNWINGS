/**
 * Interactive notes reach, from src/content/interactiveNotes.json (written before every
 * build by scripts/sync-interactive.mjs from the app's own registry).
 *
 * The copy is honest by construction: "every chapter" only once every chapter in the
 * syllabus is registered; until then the real number of chapters.
 */
import NOTES from "../content/interactiveNotes.json";

export const INTERACTIVE = NOTES as {
  syncedAt: string; explainerCount: number; chapterCount: number; totalChapters: number;
  chapters: Record<string, string[]>;
};

export const INTERACTIVE_ALL = INTERACTIVE.chapterCount >= INTERACTIVE.totalChapters;

/** "every chapter" or "145 chapters". */
export const INTERACTIVE_REACH = INTERACTIVE_ALL ? "every chapter" : `${INTERACTIVE.chapterCount} chapters`;

/** "Every chapter" or "100+ chapters" for tight labels. */
export const INTERACTIVE_REACH_SHORT = INTERACTIVE_ALL
  ? "Every chapter"
  : INTERACTIVE.chapterCount >= 100 ? `${Math.floor(INTERACTIVE.chapterCount / 50) * 50}+ chapters` : `${INTERACTIVE.chapterCount} chapters`;
