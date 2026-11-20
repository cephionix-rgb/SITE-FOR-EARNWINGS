export const GUIDE_MENU: { slug: string; label: string; hint: string }[];
export const GUIDE_SLUGS: string[];
export const GUIDE_CANONICAL: Record<string, string>;
export const GUIDE_TOP_LEVEL: Record<string, string>;
export function guideHref(slug: string): string;
