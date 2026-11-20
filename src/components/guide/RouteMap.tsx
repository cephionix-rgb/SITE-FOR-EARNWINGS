import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowRightLeft, ChevronDown, Clock, Download, Info, Sparkles } from "lucide-react";
import { Link } from "../../lib/router";
import { track } from "../../lib/track";
import { airlinerTopSvg } from "../../content/airliner";
import { BRANCH, COST_NOTE, MAIN, ROUTE_DISCLAIMER, ROUTE_PDF, ROUTE_UPDATED, SUMMARY, type RouteChip, type Waypoint } from "../../content/zeroToCpl";

// "Zero to CPL": the pathway as a flight route. An airliner (the ONE shared A320
// drawing, content/airliner.js) flies a dotted route through one waypoint per
// step as the reader scrolls. Every word comes from content/zeroToCpl.js, which
// only restates facts already sourced in content/guides.js.
//
// Layout is measured, not hard-coded: the waypoint cards are laid out by CSS
// (a 4-column winding grid when the map is wide, a single vertical column on a
// phone), then the markers are measured and the route is drawn through them, so
// it stays right when a card is expanded or the window resizes. The plane and the
// flown (gold) part of the route are moved by writing attributes directly on
// scroll (one rAF per frame), never by re-rendering React. Under
// prefers-reduced-motion the plane is parked at the start and nothing animates.

const NAVY = "#1B3A7A";
const GOLD = "#C9A227";

type Pt = { x: number; y: number };
type Geo = { w: number; h: number; main: string; branch: string; conv: Pt | null; marks: number[] };

const GRID_MIN = 880; // map width (px) from which the winding 4-column layout is used
const COLS = 4;

/** Grid cell for main waypoint k (0-based): rows wind left-right, then right-left. */
function cell(k: number): { col: number; row: number; span?: number } {
  const row = Math.floor(k / COLS);
  const pos = k % COLS;
  const col = row % 2 === 0 ? pos + 1 : COLS - pos;
  return { col, row: row + 1, span: k === MAIN.length - 1 ? 2 : undefined };
}

/** A smooth curve through points (Catmull-Rom as cubic Béziers). */
function smooth(p: Pt[]): string {
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c;
    d += ` C${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6} ${c.x - (e.x - b.x) / 6} ${c.y - (e.y - b.y) / 6} ${c.x} ${c.y}`;
  }
  return d;
}

/** The main route through the measured markers. */
function mainPath(p: Pt[], grid: boolean, w: number, colW: number): string {
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i], b = p[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y;
    if (!grid) {
      d += ` L${b.x} ${b.y}`;
    } else if (Math.abs(dy) < 12) {
      // one leg along a row: a gentle climb-and-descend hop
      d += ` C${a.x + dx * 0.35} ${a.y - 16} ${b.x - dx * 0.35} ${b.y - 16} ${b.x} ${b.y}`;
    } else {
      // end of a row: a wide turn outside the cards, back the other way
      const side = a.x > w / 2 ? 1 : -1;
      const r = (colW / 2 + 18) / 0.75;
      d += ` C${a.x + side * r} ${a.y} ${b.x + side * r} ${b.y} ${b.x} ${b.y}`;
    }
  }
  return d;
}

function Chip({ c, icon = true }: { c: RouteChip; icon?: boolean }) {
  // Fees already carry their ₹; only the no-fee notes get an icon.
  return (
    <span className={`rm-chip rm-${c.kind}`}>
      {icon && c.kind === "note" && <Info size={13} aria-hidden />}
      {c.t}
      {c.kind === "official" && <span className="sr-only"> (official fee)</span>}
      {c.kind === "typical" && <span className="sr-only"> (typical range, not official)</span>}
    </span>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("#")) return <a href={href} className="rm-link">{children}</a>;
  return <Link to={href} className="rm-link">{children}</Link>;
}

function Stop({ w, open, onToggle, style, mkRef, last }: { w: Waypoint; open: boolean; onToggle: () => void; style?: React.CSSProperties; mkRef: (el: HTMLSpanElement | null) => void; last?: boolean }) {
  return (
    <li className={`rm-node${w.branch ? " rm-conv" : ""}${last ? " rm-dest" : ""}${open ? " is-open" : ""}`} style={style}>
      <span ref={mkRef} className="rm-mk" aria-hidden>
        {w.branch ? <ArrowRightLeft size={14} /> : w.n}
      </span>
      <div className="rm-card">
        <button type="button" className="rm-btn" aria-expanded={open} aria-controls={`rm-more-${w.id}`} onClick={onToggle}>
          <span className="rm-stage">{w.branch ? "Abroad branch" : `Stop ${w.n} · ${w.stage}`}</span>
          <span className="rm-title">{w.title}</span>
          <span className="rm-chips">
            <span className="rm-chip rm-time"><Clock size={13} aria-hidden />{w.time}</span>
            <Chip c={w.cost} />
            {w.id === "school" && w.extra && <Chip c={w.extra} />}
          </span>
          <ChevronDown size={18} className="rm-chev" aria-hidden />
        </button>
        {w.ew && (
          <p className="rm-ew"><Sparkles size={12} aria-hidden /> <span><b>EarnWings:</b> {w.ew.t}</span></p>
        )}
        <div id={`rm-more-${w.id}`} className="rm-more" hidden={!open}>
          {w.extra && w.id !== "school" && <p className="rm-extra"><Chip c={w.extra} /></p>}
          <p>{w.body}</p>
          <p className="rm-first"><b>What to do first:</b> {w.first}</p>
          <div className="rm-links">
            <MoreLink href={w.more.href}>{w.more.label} <ArrowRight size={15} aria-hidden /></MoreLink>
            {w.ew && <Link to={w.ew.href} className="rm-link rm-link-ew">How EarnWings helps <ArrowRight size={15} aria-hidden /></Link>}
          </div>
        </div>
      </div>
    </li>
  );
}

export function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const mainRef = useRef<SVGPathElement>(null);
  const flownRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const mks = useRef<(HTMLSpanElement | null)[]>([]);
  const convMk = useRef<HTMLSpanElement | null>(null);
  const [grid, setGrid] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [convAt, setConvAt] = useState<Pt | null>(null);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const progress = useRef(-1);

  const measure = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const box = map.getBoundingClientRect();
    const w = box.width, h = box.height;
    const isGrid = w >= GRID_MIN;
    if (isGrid !== grid) { setGrid(isGrid); return; }
    const at = (el: HTMLElement | null): Pt | null => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2 - box.left), y: Math.round(r.top + r.height / 2 - box.top) };
    };
    const pts = mks.current.slice(0, MAIN.length).map(at);
    if (pts.some((p) => !p)) return;
    const p = pts as Pt[];
    const school = MAIN.findIndex((x) => x.id === "school");
    // In the grid the conversion floats above the leg between the school and the CPL.
    let conv: Pt | null;
    if (isGrid) {
      const a = p[school], b = p[school + 1];
      conv = { x: Math.round((a.x + b.x) / 2), y: Math.round(Math.min(a.y, b.y) - 48) };
      if (!convAt || convAt.x !== conv.x || convAt.y !== conv.y) setConvAt(conv);
    } else {
      conv = at(convMk.current);
      if (convAt) setConvAt(null);
    }
    const colW = isGrid ? (p[1].x - p[0].x) : 0;
    const main = mainPath(p, isGrid, w, colW);
    const branch = conv ? smooth([p[school], conv, p[school + 1]]) : "";
    setGeo((g) => (g && g.main === main && g.branch === branch && g.w === w && g.h === h ? g : { w, h, main, branch, conv, marks: [] }));
  }, [grid, convAt]);

  // Measure after every layout change: first paint, layout switch, a card opening.
  useLayoutEffect(() => { measure(); }, [measure, open, grid]);
  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (mapRef.current) ro.observe(mapRef.current);
    if (listRef.current) ro.observe(listRef.current);
    // Web fonts change card heights once they arrive.
    document.fonts?.ready.then(() => measure());
    return () => ro.disconnect();
  }, [measure]);

  // Where each waypoint sits along the route, for lighting the markers as the plane passes.
  const marks = useRef<number[]>([]);
  useLayoutEffect(() => {
    const path = mainRef.current;
    if (!geo || !path) return;
    const len = path.getTotalLength();
    const samples: { l: number; x: number; y: number }[] = [];
    for (let i = 0; i <= 600; i++) {
      const l = (i / 600) * len;
      const q = path.getPointAtLength(l);
      samples.push({ l, x: q.x, y: q.y });
    }
    const map = mapRef.current!.getBoundingClientRect();
    marks.current = mks.current.slice(0, MAIN.length).map((el) => {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2 - map.left, y = r.top + r.height / 2 - map.top;
      let best = samples[0];
      for (const s of samples) if ((s.x - x) ** 2 + (s.y - y) ** 2 < (best.x - x) ** 2 + (best.y - y) ** 2) best = s;
      return best.l / len;
    });
    progress.current = -1;
    fly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo]);

  const fly = useCallback(() => {
    const path = mainRef.current, plane = planeRef.current, map = mapRef.current;
    if (!path || !plane || !map) return;
    let p = 0;
    if (!reduced) {
      const r = map.getBoundingClientRect();
      const vh = window.innerHeight;
      p = Math.min(1, Math.max(0, (vh * 0.58 - r.top) / Math.max(1, r.height - 40)));
    }
    if (Math.abs(p - progress.current) < 0.0004) return;
    progress.current = p;
    const len = path.getTotalLength();
    const l = Math.max(0.5, p * len);
    const a = path.getPointAtLength(Math.max(0, l - 1)), b = path.getPointAtLength(Math.min(len, l + 1));
    const q = path.getPointAtLength(l);
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
    plane.setAttribute("transform", `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    const flown = flownRef.current;
    if (flown) {
      flown.style.strokeDasharray = `${len} ${len}`;
      flown.style.strokeDashoffset = `${(len - p * len).toFixed(1)}`;
    }
    if (!reduced) {
      mks.current.slice(0, MAIN.length).forEach((el, i) => el?.classList.toggle("is-reached", marks.current[i] <= p + 0.002));
    }
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; fly(); }); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [fly, reduced]);

  const toggle = (id: string) => {
    setOpen((o) => (o === id ? null : id));
    track("route_map_open", { stop: id });
  };
  const planeScale = grid ? 1.35 : 1;
  const schoolIdx = MAIN.findIndex((x) => x.id === "school");

  return (
    <section id="route-map" className="rm" aria-labelledby="route-map-h">
      <style dangerouslySetInnerHTML={{ __html: RM_CSS }} />
      <div className="rm-sky">
        <header className="rm-head">
          <span className="eyebrow">Route map · Zero to CPL</span>
          <h2 id="route-map-h" className="rm-h2">From Class 12 to the right-hand seat, <span className="text-gradient-gold">on one map</span></h2>
          <p className="rm-lede">
            Eleven stops in the order most Indian airline pilots follow them. Tap a stop for what it involves, what it costs
            and where to read more. A few steps overlap (you can study while you fly), but none can be skipped.
          </p>
          <ul className="rm-legend" aria-label="Key">
            <li><span className="rm-chip rm-official">₹</span> Official fee, exact</li>
            <li><span className="rm-chip rm-typical">₹</span> Typical range, not official</li>
            <li><span className="rm-key-branch" aria-hidden /> Trained abroad: the branch rejoins at conversion</li>
          </ul>
        </header>

        <div ref={mapRef} className="rm-map" data-layout={grid ? "grid" : "list"}>
          <svg className="rm-back" width={geo?.w ?? 0} height={geo?.h ?? 0} viewBox={`0 0 ${geo?.w ?? 1} ${geo?.h ?? 1}`} aria-hidden>
            {geo && (
              <>
                {geo.branch && <path d={geo.branch} fill="none" stroke={GOLD} strokeWidth={2.5} strokeDasharray="7 7" strokeLinecap="round" />}
                <path ref={mainRef} d={geo.main} fill="none" stroke={NAVY} strokeOpacity={0.32} strokeWidth={2.6} strokeDasharray="1 9" strokeLinecap="round" />
                <path ref={flownRef} d={geo.main} fill="none" stroke={GOLD} strokeWidth={3.4} strokeLinecap="round" style={{ strokeDasharray: "0 99999" }} />
              </>
            )}
          </svg>

          <ol ref={listRef} className="rm-list">
            {MAIN.map((w, k) => {
              const c = cell(k);
              const style: React.CSSProperties | undefined = grid ? { gridColumn: c.span ? `${c.col} / span ${c.span}` : c.col, gridRow: c.row, marginTop: c.row === 2 ? 64 : undefined } : undefined;
              const node = (
                <Stop key={w.id} w={w} open={open === w.id} onToggle={() => toggle(w.id)} style={style} last={k === MAIN.length - 1}
                  mkRef={(el) => { mks.current[k] = el; }} />
              );
              if (k !== schoolIdx) return node;
              // The conversion branch: in the flow after the school on a phone,
              // floating above the school-to-CPL leg in the wide layout.
              const convStyle: React.CSSProperties | undefined = grid
                ? convAt ? { position: "absolute", left: convAt.x, top: convAt.y } : { position: "absolute", visibility: "hidden" }
                : undefined;
              return [
                node,
                <Stop key={BRANCH.id} w={BRANCH} open={open === BRANCH.id} onToggle={() => toggle(BRANCH.id)} style={convStyle}
                  mkRef={(el) => { convMk.current = el; }} />,
              ];
            })}
          </ol>

          <svg className="rm-front" width={geo?.w ?? 0} height={geo?.h ?? 0} viewBox={`0 0 ${geo?.w ?? 1} ${geo?.h ?? 1}`} aria-hidden>
            <g ref={planeRef} transform="translate(-100 -100)">
              <g dangerouslySetInnerHTML={{ __html: airlinerTopSvg(planeScale) }} />
            </g>
          </svg>
        </div>

        <div className="rm-sum" role="list" aria-label="Time and cost at a glance">
          {SUMMARY.map((s) => (
            <div key={s.k} role="listitem" className="rm-sum-cell">
              <span className="rm-sum-k">{s.k}</span>
              <span className="rm-sum-v">{s.v}</span>
              <span className="rm-sum-d">{s.d}</span>
            </div>
          ))}
        </div>
        <p className="rm-costnote">{COST_NOTE}</p>

        <div className="rm-actions">
          <a href={ROUTE_PDF} download onClick={() => track("guide_pdf_download", { where: "route-map" })} className="btn-gold" style={{ minHeight: 48, padding: "0.7rem 1.25rem" }}>
            <Download size={17} aria-hidden /> Download the route map (PDF)
          </a>
          <a href="#route" className="link-arrow">See the full route, step by step <ArrowRight size={16} aria-hidden /></a>
        </div>
        <p className="rm-small">Checked {ROUTE_UPDATED}. {ROUTE_DISCLAIMER}</p>
      </div>
    </section>
  );
}

const RM_CSS = `
.rm{margin:0 0 36px}
.rm-sky{position:relative;border-radius:28px;padding:26px 14px 22px;overflow:hidden;border:1px solid rgba(27,58,122,.1);
  background:
    radial-gradient(60% 40% at 12% 6%,rgba(255,255,255,.95),rgba(255,255,255,0) 70%),
    radial-gradient(45% 30% at 88% 30%,rgba(255,255,255,.8),rgba(255,255,255,0) 70%),
    linear-gradient(180deg,#DDEEFF 0%,#EEF6FF 38%,#FFFFFF 100%);
  box-shadow:0 30px 60px -44px rgba(27,58,122,.5)}
@media (min-width:640px){.rm-sky{padding:36px 30px 30px}}
.rm-head{max-width:46rem;padding:0 4px}
.rm-h2{margin-top:10px;font-weight:800;font-size:clamp(1.65rem,1.2rem + 2vw,2.5rem);line-height:1.08;letter-spacing:-.03em;color:#0D1629}
.rm-lede{margin-top:12px;font-size:16.5px;line-height:1.6;color:#3D4F75}
.rm-legend{margin:16px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;color:#5B6B8C;font-weight:600}
.rm-legend li{display:inline-flex;align-items:center;gap:7px}
.rm-key-branch{display:inline-block;width:30px;height:0;border-top:2.5px dashed ${GOLD}}

.rm-map{position:relative;margin-top:22px}
.rm-back,.rm-front{position:absolute;left:0;top:0;pointer-events:none;overflow:visible}
.rm-back{z-index:0}
.rm-front{z-index:4;filter:drop-shadow(0 7px 5px rgba(27,58,122,.28))}
.rm-list{position:relative;z-index:1;margin:0;list-style:none}
.rm-map[data-layout=list] .rm-list{display:flex;flex-direction:column;gap:18px;padding:22px 0 10px 46px}
.rm-map[data-layout=grid] .rm-list{display:grid;grid-template-columns:repeat(${COLS},minmax(0,1fr));column-gap:28px;row-gap:104px;align-items:start;padding:30px 52px 14px}

.rm-node{position:relative}
.rm-mk{position:absolute;z-index:3;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:#fff;border:2.5px solid ${NAVY};color:${NAVY};font:800 14px/1 var(--font-display);transform:translate(-50%,-50%);
  box-shadow:0 0 0 5px rgba(255,255,255,.75);transition:background .35s ease,color .35s ease,border-color .35s ease}
.rm-mk.is-reached{background:${NAVY};color:#F5D97A}
.rm-dest .rm-mk{border-color:${GOLD};color:#6b5208}
.rm-dest .rm-mk.is-reached{background:${GOLD};color:#2a1d00}
.rm-conv .rm-mk{width:28px;height:28px;border-color:${GOLD};color:#8a6a12;border-style:dashed}
.rm-map[data-layout=list] .rm-mk{left:-28px;top:26px}
.rm-map[data-layout=grid] .rm-mk{left:50%;top:0}

.rm-card{position:relative;background:#fff;border:1px solid rgba(27,58,122,.12);border-radius:18px;box-shadow:0 18px 36px -28px rgba(27,58,122,.55)}
.rm-dest .rm-card{border-color:rgba(201,162,39,.55);background:linear-gradient(180deg,#FFFBEF,#fff)}
.rm-conv .rm-card{border-style:dashed;border-color:rgba(201,162,39,.7);background:#FFFDF6}
.rm-map[data-layout=list] .rm-conv{margin-left:40px}
.rm-map[data-layout=grid] .rm-card{padding-top:10px}
.rm-map[data-layout=grid] .rm-conv{width:0;height:0;z-index:2}
.rm-map[data-layout=grid] .rm-conv .rm-mk{left:0;top:0}
.rm-map[data-layout=grid] .rm-conv .rm-card{position:absolute;left:-180px;bottom:20px;width:360px;padding-top:0}
.rm-map[data-layout=grid] .rm-conv .rm-btn{padding:9px 36px 9px 14px}
.rm-map[data-layout=grid] .rm-conv .rm-stage{display:none}
.rm-map[data-layout=grid] .rm-conv .rm-title{margin-top:0;font-size:15px}
.rm-map[data-layout=grid] .rm-conv .rm-chips{margin-top:6px;flex-wrap:nowrap}
.rm-map[data-layout=grid] .rm-conv .rm-chev{top:9px}
.rm-map[data-layout=grid] .rm-conv.is-open{z-index:5}
.rm-btn{all:unset;box-sizing:border-box;display:block;width:100%;cursor:pointer;padding:14px 40px 12px 16px;position:relative;border-radius:18px}
.rm-btn:focus-visible{outline:3px solid #2E6BE5;outline-offset:2px}
.rm-stage{display:block;font:600 10.5px/1.3 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:#8a6a12}
.rm-conv .rm-stage{color:#8a6a12}
.rm-title{display:block;margin-top:4px;font:800 16px/1.25 var(--font-display);letter-spacing:-.01em;color:#0D1629}
.rm-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.rm-chip{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;line-height:1.3;border-radius:8px;padding:3px 8px}
.rm-time{background:#E4F1FD;color:#1c5a96}
.rm-official{background:#FFF1CC;color:#6b5208}
.rm-typical{background:#fff;color:#6b5208;border:1.5px dashed rgba(201,162,39,.8);padding:1.5px 6.5px}
.rm-chip.rm-note{background:#EEF2F8;color:#5B6B8C}
.rm-chev{position:absolute;right:12px;top:14px;color:${NAVY};transition:transform .25s ease}
.is-open .rm-chev{transform:rotate(180deg)}
.rm-ew{display:flex;align-items:flex-start;gap:6px;margin:0 12px 12px;padding:6px 9px;border-radius:10px;background:#F2F7FF;color:#2a4a8a;font-size:12.5px;line-height:1.4}
.rm-ew svg{flex:none;margin-top:2px;color:${GOLD}}
.rm-ew b{color:${NAVY}}
.rm-more{padding:0 16px 14px;font-size:14px;line-height:1.55;color:#3D4F75}
.rm-more p{margin:0 0 8px}
.rm-extra{margin-top:-2px}
.rm-first{background:#FBF8EE;border-radius:10px;padding:8px 10px}
.rm-first b{color:#0D1629}
.rm-links{display:flex;flex-wrap:wrap;gap:4px 16px}
.rm-link{display:inline-flex;align-items:center;gap:5px;min-height:36px;font-weight:700;color:${NAVY};text-decoration:underline;text-decoration-color:rgba(27,58,122,.3);text-underline-offset:4px}
.rm-link-ew{color:#2456b8}

.rm-sum{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;margin-top:22px;border-radius:18px;overflow:hidden;background:rgba(27,58,122,.12);border:1px solid rgba(27,58,122,.12)}
@media (min-width:900px){.rm-sum{grid-template-columns:repeat(4,minmax(0,1fr))}}
.rm-sum-cell{background:#fff;padding:14px 14px 13px;display:flex;flex-direction:column;gap:3px}
.rm-sum-cell:first-child{background:${NAVY}}
.rm-sum-k{font:600 10.5px/1.3 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:#5B6B8C}
.rm-sum-v{font:800 clamp(1.25rem,1rem + 1vw,1.6rem)/1.1 var(--font-display);color:#0D1629;letter-spacing:-.02em}
.rm-sum-d{font-size:12.5px;line-height:1.4;color:#5B6B8C}
.rm-sum-cell:first-child .rm-sum-k{color:#A9C0E6}
.rm-sum-cell:first-child .rm-sum-v{color:#F5D97A}
.rm-sum-cell:first-child .rm-sum-d{color:#D5E1F5}
.rm-costnote{margin:10px 2px 0;font-size:12.5px;line-height:1.5;color:#5B6B8C}
.rm-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;margin-top:18px}
.rm-small{margin:12px 2px 0;font-size:12px;line-height:1.5;color:#5B6B8C}
@media (max-width:639px){.rm-actions .btn-gold{width:100%}}
@media (prefers-reduced-motion:reduce){.rm-mk,.rm-chev{transition:none}}
`;
