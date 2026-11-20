import { Fragment } from "react";
import { AlertTriangle, Info, SearchCheck } from "lucide-react";
import { parseInline } from "../../content/inline";
import type { GuideBlock, GuideSection } from "../../content/guides";
import { Link } from "../../lib/router";
import { FIGURES, FIG_CSS } from "./Figures";
import { SHOTS } from "../../content/guideShots";

// Renders the guide content blocks (src/content/guides.js). Shared by the web
// pages and the print template that the PDFs are made from, so both always show
// the same words. `print` swaps a few interactive bits for static ones.

export const INK = "#0D1629";
export const NAVY = "#1B3A7A";
export const BODY = "#3D4F75";
export const MUTED = "#5B6B8C";
export const GOLD = "#C9981F";

/** Inline text with **bold** and [links](url). External links open in a new tab. */
export function Inline({ text, print = false }: { text: string; print?: boolean }) {
  return (
    <>
      {parseInline(text).map((t, i) => {
        if (t.type === "bold") return <strong key={i} style={{ color: INK }}>{t.text}</strong>;
        if (t.type === "link") {
          const internal = t.href!.startsWith("/");
          const cls = "font-semibold underline decoration-[1.5px] underline-offset-2 hover:opacity-80";
          if (t.href!.startsWith("#")) {
            return <a key={i} href={t.href} className={cls} style={{ color: NAVY }}>{t.text}</a>;
          }
          if (internal && !print) {
            return <Link key={i} to={t.href!} className={cls} style={{ color: NAVY }}>{t.text}</Link>;
          }
          return (
            <a
              key={i}
              href={internal ? `https://earnwings.org${t.href}` : t.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
              style={{ color: NAVY }}
            >
              {t.text}
            </a>
          );
        }
        return <Fragment key={i}>{t.text}</Fragment>;
      })}
    </>
  );
}

const NOTE = {
  info: { Icon: Info, bg: "#F2F7FF", border: "rgba(46,107,229,0.25)", chip: "#2E6BE5", label: "Good to know" },
  warn: { Icon: AlertTriangle, bg: "#FFF8E8", border: "rgba(201,152,31,0.45)", chip: "#9a7415", label: "Watch out" },
  check: { Icon: SearchCheck, bg: "#F6F4FF", border: "rgba(109,63,212,0.28)", chip: "#6d3fd4", label: "Check the official page" },
} as const;

export function Block({ b, print = false }: { b: GuideBlock; print?: boolean }) {
  switch (b.t) {
    case "p":
      return <p className="g-p"><Inline text={b.text} print={print} /></p>;
    case "h3":
      return <h3 className="g-h3" style={{ color: NAVY }}>{b.text}</h3>;
    case "ul":
      return (
        <ul className="g-ul">
          {b.items.map((it, i) => (
            <li key={i}><Inline text={it} print={print} /></li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="g-steps">
          {b.items.map((s, i) => (
            <li key={i}>
              <span className="g-step-n" aria-hidden>{i + 1}</span>
              <div className="min-w-0">
                <p className="g-step-t" style={{ color: INK }}><Inline text={s.title} print={print} /></p>
                {s.body && <p className="g-step-b"><Inline text={s.body} print={print} /></p>}
                {s.items && (
                  <ul className="g-ul mt-2">
                    {s.items.map((it, j) => (
                      <li key={j}><Inline text={it} print={print} /></li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="g-table-wrap">
          <table className="g-table">
            <thead>
              <tr>{b.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} data-label={b.head[j] || undefined}>
                      <Inline text={c} print={print} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note": {
      const n = NOTE[b.tone];
      return (
        <aside className="g-note" style={{ background: n.bg, borderColor: n.border }}>
          <span className="g-note-chip" style={{ color: n.chip }}>
            <n.Icon size={15} strokeWidth={2.4} aria-hidden /> {b.title || n.label}
          </span>
          <p className="g-p mt-1.5"><Inline text={b.text} print={print} /></p>
        </aside>
      );
    }
    case "figure": {
      const F = FIGURES[b.id];
      return F ? <div role="group" aria-label={b.alt}><F /></div> : null;
    }
    case "shot": {
      // Annotated screenshot of an official DGCA / eGCA / Pariksha page (or a
      // labelled illustration of a screen behind a login). WebP on the site,
      // a high-quality JPEG in the PDFs. Tap or click to open it full size.
      const s = (SHOTS as Record<string, { w: number; h: number; phone: boolean; illustration: boolean }>)[b.id];
      if (!s) return null;
      const base = `/guides/shots/${b.id}`;
      const img = (
        <img
          src={`${base}.${print ? "jpg" : "webp"}`}
          width={s.w}
          height={s.h}
          alt={b.alt}
          loading={print ? "eager" : "lazy"}
          decoding="async"
        />
      );
      return (
        <figure className={`g-shot${s.phone ? " g-shot-phone" : ""}`}>
          {print ? img : <a href={`${base}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Open full size: ${b.alt}`}>{img}</a>}
          <figcaption><Inline text={b.caption} print={print} /></figcaption>
        </figure>
      );
    }
    case "terms":
      return (
        <dl className="g-terms">
          {b.items.map((t) => (
            <div key={t.term} className="g-term">
              <dt>
                <span style={{ color: INK }}>{t.term}</span>
                {t.full && <span className="g-term-full"> {t.full}</span>}
              </dt>
              <dd><Inline text={t.def} print={print} /></dd>
            </div>
          ))}
        </dl>
      );
  }
}

export function SectionBody({ s, n, print = false }: { s: GuideSection; n: number; print?: boolean }) {
  return (
    <section id={s.id} className="g-section scroll-mt-32">
      <h2 className="g-h2" style={{ color: INK }}>
        <span className="g-h2-n" style={{ color: GOLD }}>{String(n).padStart(2, "0")}</span>
        {s.title}
      </h2>
      <div className="g-body">
        {s.blocks.map((b, i) => <Block key={i} b={b} print={print} />)}
      </div>
    </section>
  );
}

/** Shared CSS for the guide pages and the print template. Scoped with g- prefixes. */
export const GUIDE_CSS = FIG_CSS + `
.g-body{display:flex;flex-direction:column;gap:14px;color:${BODY};font-size:16.5px;line-height:1.72}
.g-p{margin:0}
.g-h2{display:flex;align-items:baseline;gap:12px;font-size:clamp(1.35rem,2.4vw,1.7rem);font-weight:850;line-height:1.25;margin:0 0 14px;letter-spacing:-0.01em}
.g-h2-n{font-family:'Oswald','Sora',system-ui,sans-serif;font-size:.8em;font-weight:600;letter-spacing:.04em}
.g-h3{font-size:17px;font-weight:800;margin:8px 0 0}
.g-ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.g-ul>li{position:relative;padding-left:20px}
.g-ul>li::before{content:"";position:absolute;left:3px;top:.72em;width:6px;height:6px;border-radius:9px;background:${GOLD}}
.g-steps{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px;counter-reset:s}
.g-steps>li{display:flex;gap:14px;align-items:flex-start}
.g-step-n{flex:none;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;background:${NAVY};color:#fff;font-weight:800;font-size:14px;margin-top:1px}
.g-step-t{margin:0;font-weight:750;line-height:1.5}
.g-step-b{margin:2px 0 0}
.g-table-wrap{overflow-x:auto;border:1px solid rgba(27,58,122,.12);border-radius:16px;background:#fff}
.g-table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.55}
.g-table th{text-align:left;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};background:#F4F8FF;padding:11px 14px;font-weight:800}
.g-table td{padding:12px 14px;border-top:1px solid rgba(27,58,122,.08);vertical-align:top}
.g-table td:first-child{font-weight:700;color:${INK}}
@media (max-width:640px){
  .g-table thead{display:none}
  .g-table tr{display:block;padding:10px 14px;border-top:1px solid rgba(27,58,122,.08)}
  .g-table tr:first-child{border-top:0}
  .g-table td{display:block;border:0;padding:3px 0}
  .g-table td[data-label]:not(:first-child)::before{content:attr(data-label);display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};font-weight:800;margin-top:6px}
}
.g-note{border:1px solid;border-radius:16px;padding:14px 16px}
.g-note-chip{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:800;letter-spacing:.02em}
.g-terms{margin:0;display:grid;grid-template-columns:1fr;gap:10px}
@media (min-width:900px){.g-terms{grid-template-columns:1fr 1fr}}
.g-term{background:#fff;border:1px solid rgba(27,58,122,.1);border-radius:14px;padding:12px 14px}
.g-term dt{font-weight:850;font-size:16px}
.g-term-full{font-weight:600;color:${MUTED};font-size:14px}
.g-term dd{margin:4px 0 0;font-size:15px;line-height:1.6}
.g-section{padding-top:8px}
.g-shot{margin:2px 0}
.g-shot img{display:block;width:100%;height:auto;border-radius:14px;border:1px solid rgba(27,58,122,.14);background:#fff}
.g-shot a{display:block;border-radius:14px}
.g-shot-phone{max-width:340px}
.g-shot figcaption{margin-top:8px;font-size:14.5px;line-height:1.55;color:${MUTED}}
`;
