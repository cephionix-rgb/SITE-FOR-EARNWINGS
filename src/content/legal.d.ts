export type LegalBlock =
  | { t: "p"; text: string }
  | { t: "sub"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "dont"; items: string[] }
  | { t: "do"; items: string[] }
  | { t: "callout"; title: string; text: string }
  | { t: "note"; text: string };
export type TermsSection = { id: string; title: string; blocks: LegalBlock[] };
export type Credit = {
  id: string; category: string; name: string; provider: string; usedFor: string;
  licence: string; licenceUrl: string; sourceUrl: string; attribution: string; notes: string;
};
export const TERMS_STATUS: string;
export const TERMS_UPDATED: string;
export const COMPANY: string;
export const SUPPORT: string;
export const TERMS: TermsSection[];
export const CREDITS_INTRO: string;
export const CREDITS_CATEGORIES: string[];
export const CREDITS: Credit[];
