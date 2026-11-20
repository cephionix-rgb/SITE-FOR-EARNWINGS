import { ArrowRight, Download } from "lucide-react";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";
import { track } from "../lib/track";
import { airlinerTopSvg } from "../content/airliner";
import { MAIN, ROUTE_PAGE, ROUTE_PDF } from "../content/zeroToCpl";

/**
 * Homepage teaser for the "Zero to CPL" route map at the top of the pathway
 * guide. A small, static drawing of the same route (the shared A320 plan view,
 * the same eleven stops and the abroad branch) and one obvious link to the full
 * map. The gold "flown" line draws itself once when the band scrolls in; under
 * reduced motion it is simply shown (the .reveal transition is ~0 ms there).
 */

type Pt = { x: number; y: number };
function smooth(p: Pt[]): string {
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c;
    d += ` C${(b.x + (c.x - a.x) / 6).toFixed(1)} ${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (e.x - b.x) / 6).toFixed(1)} ${(c.y - (e.y - b.y) / 6).toFixed(1)} ${c.x} ${c.y}`;
  }
  return d;
}

// Wide: two winding rows (6 then 5). Narrow: a zig-zag down the page.
const WIDE: Pt[] = MAIN.map((_, i) => (i < 6 ? { x: 40 + i * 104, y: 70 + (i % 2 ? 22 : 0) } : { x: 40 + (10 - i) * 104 + 52, y: 214 + (i % 2 ? 0 : 22) }));
const SCHOOL = MAIN.findIndex((x) => x.id === "school");
const TALL: Pt[] = MAIN.map((_, i) => ({ x: i % 2 ? 100 : 44, y: 30 + i * 50 + (i > SCHOOL ? 36 : 0) }));
const LABEL: Record<string, string> = {
  class12: "Class 12 (Physics, Maths)", ids: "DGCA IDs", class2: "Class 2", class1: "Class 1", papers: "DGCA papers",
  rtr: "RTR + ELP", school: "Flying school", cpl: "CPL", selection: "Selection", type: "Type rating", fo: "First officer",
};

function MiniRoute({ pts, w, h, wide }: { pts: Pt[]; w: number; h: number; wide: boolean }) {
  const d = smooth(pts);
  const a = pts[SCHOOL], b = pts[SCHOOL + 1];
  const conv = wide ? { x: (a.x + b.x) / 2, y: a.y - 52 } : { x: 128, y: (a.y + b.y) / 2 };
  const branch = smooth([a, conv, b]);
  // Park the plane between stops 2 and 3, nose along the leg.
  const p = pts[1], q = pts[2];
  const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI + 90;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label="The route from Class 12 to first officer in eleven stops, with a branch for training abroad that rejoins at conversion">
      <path d={branch} fill="none" stroke="#C9A227" strokeWidth={2.4} strokeDasharray="6 6" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#1B3A7A" strokeOpacity={0.3} strokeWidth={2.4} strokeDasharray="1 8" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#C9A227" strokeWidth={3.2} strokeLinecap="round" pathLength={1} className="rt-flown" />
      <circle cx={conv.x} cy={conv.y} r={9} fill="#FFFDF6" stroke="#C9A227" strokeWidth={2} strokeDasharray="3 2.5" />
      <text x={wide ? conv.x : 150} y={conv.y + (wide ? -16 : 4)} textAnchor={wide ? "middle" : "start"} fontSize={11.5} fontWeight={700} fill="#8a6a12" fontFamily="Inter, sans-serif">Abroad? Convert</text>
      {MAIN.map((s, i) => {
        const c = pts[i];
        const last = i === MAIN.length - 1;
        const label = wide
          ? { x: c.x, y: i < 6 ? c.y - 24 : c.y + 34, anchor: "middle" as const }
          : { x: 150, y: c.y + 4, anchor: "start" as const };
        return (
          <g key={s.id}>
            <circle cx={c.x} cy={c.y} r={13} fill={last ? "#C9A227" : i < 2 ? "#1B3A7A" : "#fff"} stroke={last ? "#C9A227" : "#1B3A7A"} strokeWidth={2.2} />
            <text x={c.x} y={c.y + 4.5} textAnchor="middle" fontSize={12} fontWeight={800} fill={last ? "#2a1d00" : i < 2 ? "#F5D97A" : "#1B3A7A"} fontFamily="Archivo, Inter, sans-serif">{s.n}</text>
            <text x={label.x} y={label.y} textAnchor={label.anchor} fontSize={12} fontWeight={650} fill="#3D4F75" fontFamily="Inter, sans-serif">{wide && s.id === "class12" ? "Class 12" : LABEL[s.id]}</text>
          </g>
        );
      })}
      <g transform={`translate(${((p.x + q.x) / 2).toFixed(1)} ${((p.y + q.y) / 2).toFixed(1)}) rotate(${ang.toFixed(1)})`} style={{ filter: "drop-shadow(0 5px 4px rgba(27,58,122,.3))" }}>
        <g dangerouslySetInnerHTML={{ __html: airlinerTopSvg(1.3) }} />
      </g>
    </svg>
  );
}

export function RouteTeaser() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="zero-to-cpl" className="band pt-0">
      <style dangerouslySetInnerHTML={{ __html: `.rt-flown{stroke-dasharray:1 1;stroke-dashoffset:1;transition:stroke-dashoffset 2.4s cubic-bezier(.45,0,.2,1) .3s}.is-in .rt-flown{stroke-dashoffset:.82}@media (prefers-reduced-motion:reduce){.rt-flown{transition:none}}` }} />
      <div className="wrap">
        <div
          ref={ref}
          className="reveal grid grid-cols-1 items-center gap-8 rounded-[28px] border px-5 py-9 sm:px-9 sm:py-11 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:p-12"
          style={{ borderColor: "rgba(27,58,122,0.1)", background: "linear-gradient(180deg,#DDEEFF 0%,#EEF6FF 45%,#FFFFFF 100%)" }}
        >
          <div>
            <span className="eyebrow">Route map · Zero to CPL</span>
            <h2 className="h-section mt-3" style={{ fontSize: "clamp(1.9rem,1.3rem + 2.4vw,2.9rem)" }}>
              How to become a pilot in India, <span className="text-gradient-gold">on one map.</span>
            </h2>
            <p className="lede mt-4">
              Eleven stops from Class 12 to the right-hand seat: medicals, the DGCA papers, the radio licence, 200 hours, the
              CPL and the airline, with the typical time and cost at every stop.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="rounded-xl bg-white px-3 py-2 text-[0.85rem] font-semibold" style={{ color: "var(--ink-2)", border: "1px solid rgba(27,58,122,0.1)" }}>
                <b style={{ color: "var(--ink)" }}>18–24 months</b> school to CPL, commonly
              </span>
              <span className="rounded-xl bg-white px-3 py-2 text-[0.85rem] font-semibold" style={{ color: "var(--ink-2)", border: "1px solid rgba(27,58,122,0.1)" }}>
                <b style={{ color: "var(--ink)" }}>₹45–70 lakh</b> CPL in India, typical all-in
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              <Link to={`${ROUTE_PAGE}#route-map`} className="btn-navy w-full sm:w-auto" onClick={() => track("route_teaser_click", {})}>
                See the full route <ArrowRight size={18} aria-hidden />
              </Link>
              <a href={ROUTE_PDF} download className="link-arrow" onClick={() => track("guide_pdf_download", { where: "route-teaser" })}>
                <Download size={17} aria-hidden /> Download the route map (PDF)
              </a>
            </div>
          </div>
          <div className="rounded-[22px] bg-white/70 p-3 sm:p-5" style={{ border: "1px solid rgba(27,58,122,0.08)" }}>
            <div className="hidden sm:block"><MiniRoute pts={WIDE} w={640} h={290} wide /></div>
            <div className="sm:hidden"><MiniRoute pts={TALL} w={340} h={590} wide={false} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
