export type ResearchItem = {
  id: string; topic: string; headline: string; source: string; authors: string;
  year: string; url: string; finding: string; soWhat: string; stat?: string; statLabel?: string;
};
export const RESEARCH: ResearchItem[];
export const RESEARCH_RESPONSE: { evidence: string; built: string }[];
export const RESEARCH_H1: [string, string];
export const RESEARCH_INTRO: string;
export const RESEARCH_DISCLAIMER: string;
