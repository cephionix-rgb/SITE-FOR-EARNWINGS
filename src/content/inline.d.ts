export type InlineToken = { type: "text" | "bold" | "link"; text: string; href?: string };
export function parseInline(src: string): InlineToken[];
export function inlineToHtml(src: string, origin?: string): string;
export function inlineToText(src: string): string;
