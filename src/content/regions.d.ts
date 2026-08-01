export type Region = {
  code: string; authority: string; region: string;
  status: "live" | "next" | "planned"; note: string;
};
export const REGIONS: Region[];
export const REGION_STATUS: Record<Region["status"], { label: string; tone: string }>;
export const REGIONS_EYEBROW: string;
export const REGIONS_H2: string;
export const REGIONS_INTRO: string;
export const REGIONS_FOOTNOTE: string;
