export type GuideTerm = { term: string; full?: string; def: string };
export type GuideStep = { title: string; body?: string; items?: string[] };
export type GuideBlock =
  | { t: "p"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "steps"; items: GuideStep[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "note"; tone: "info" | "warn" | "check"; title?: string; text: string }
  | { t: "terms"; items: GuideTerm[] }
  | { t: "figure"; id: string; alt: string }
  | { t: "shot"; id: string; alt: string; caption: string };
export type GuideSection = { id: string; title: string; blocks: GuideBlock[] };
export type GuideSource = { label: string; url: string; note?: string };
export type Guide = {
  slug: string;
  navLabel: string;
  title: string;
  h1: [string, string];
  metaTitle: string;
  metaDescription: string;
  summary: string;
  intro: string;
  pdf: string;
  sections: GuideSection[];
  sources: GuideSource[];
};
export const LAST_CHECKED: string;
export const LAST_CHECKED_ISO: string;
export const GUIDE_HUB: {
  path: string;
  navLabel: string;
  h1: [string, string];
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  intro: string;
  disclaimer: string;
  pdf: string;
};
export const SCREENS_NOTE: string;
export const GUIDES: Guide[];
export function guidePath(slug: string): string;
