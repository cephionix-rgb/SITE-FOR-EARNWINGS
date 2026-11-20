// Tiny inline markup used by the content modules (guides, legal): **bold** and
// [label](url). Parsed into tokens here so the React pages, the crawlable HTML
// shells (scripts/gen-routes.mjs) and the PDFs all read the same text the same
// way. Plain .js so Node can import it.

/** @returns {{type:"text"|"bold"|"link", text:string, href?:string}[]} */
export function parseInline(src) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ type: "text", text: src.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ type: "bold", text: m[1] });
    else out.push({ type: "link", text: m[2], href: m[3] });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ type: "text", text: src.slice(last) });
  return out;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Inline markup to safe HTML (for static shells). Internal links get the site origin. */
export function inlineToHtml(src, origin = "") {
  return parseInline(src)
    .map((t) =>
      t.type === "bold"
        ? `<strong>${esc(t.text)}</strong>`
        : t.type === "link"
          ? `<a href="${esc(t.href.startsWith("/") ? origin + t.href : t.href)}">${esc(t.text)}</a>`
          : esc(t.text),
    )
    .join("");
}

/** Inline markup to plain text (meta descriptions, search). */
export function inlineToText(src) {
  return parseInline(src).map((t) => t.text).join("");
}
