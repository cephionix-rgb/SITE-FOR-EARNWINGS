import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/scroll";
import { SectionHead } from "../components/SectionHead";

/**
 * The syllabus as an airport departures board on a full-bleed navy band: every
 * module is a "flight" with its chapter count. When the board scrolls into view
 * each row's letters spin through the split-flap alphabet and land, top to
 * bottom (one timer for the whole board, ~20 updates a second, then it stops).
 * Data (names, chapter counts) is from the live app.
 */

type Row = { code: string; name: string; chapters: number };

const ROWS: Row[] = [
  { code: "EW201", name: "AVIATION METEOROLOGY I", chapters: 19 },
  { code: "EW202", name: "AVIATION METEOROLOGY II", chapters: 6 },
  { code: "EW203", name: "GENERAL NAVIGATION", chapters: 29 },
  { code: "EW204", name: "INSTRUMENTS & NAVIGATION", chapters: 23 },
  { code: "EW205", name: "RADIO NAVIGATION", chapters: 18 },
  { code: "EW206", name: "POWERPLANT", chapters: 27 },
  { code: "EW207", name: "PRINCIPLES OF FLIGHT", chapters: 17 },
  { code: "EW208", name: "ELECTRICS & ELECTRONICS", chapters: 17 },
  { code: "EW209", name: "AIRCRAFT PERFORMANCE", chapters: 7 },
  { code: "EW210", name: "MASS, BALANCE & FLIGHT PLANNING", chapters: 3 },
  { code: "EW211", name: "AIR REGULATIONS", chapters: 24 },
  { code: "EW212", name: "RADIO TELEPHONY (RTR)", chapters: 12 },
];

const TOTAL = ROWS.reduce((n, r) => n + r.chapters, 0);
const GLYPHS = "ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789";
const ROW_DELAY = 90; // ms between rows starting
const SPIN = 520; // ms each row spins before it lands

function scramble(text: string, settled: number) {
  // `settled` = how many leading characters have landed
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    out += i < settled || c === " " || c === "&" || c === "," ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return out;
}

function useBoard(start: boolean) {
  const reduced = prefersReducedMotion();
  const [t, setT] = useState(reduced ? Infinity : -1);
  useEffect(() => {
    if (!start || reduced) return;
    const t0 = performance.now();
    const end = ROWS.length * ROW_DELAY + SPIN + 60;
    const id = window.setInterval(() => {
      const el = performance.now() - t0;
      setT(el);
      if (el > end) {
        window.clearInterval(id);
        setT(Infinity);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [start, reduced]);
  return t;
}

function rowText(text: string, i: number, t: number) {
  if (t === Infinity) return text;
  const local = t - i * ROW_DELAY;
  if (local < 0) return text.replace(/[^ ]/g, " ");
  const settled = Math.floor((local / SPIN) * text.length);
  return settled >= text.length ? text : scramble(text, settled);
}

export function FlightPathScroll() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);
  const t = useBoard(start);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStart(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="syllabus" className="board-band relative">
      <div className="wrap band">
        <SectionHead
          tone="dark"
          title={<>The whole CPL syllabus, <span style={{ color: "#F2CD6B" }}>on one board.</span></>}
          lede={`${ROWS.length} modules and ${TOTAL} chapters, built to the DGCA pattern. Pick any subject and you always know what to study next.`}
        />

        <div
          ref={boardRef}
          className="mt-10 overflow-hidden rounded-2xl sm:mt-14"
          style={{ background: "#071530", boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 40px 80px -40px rgba(0,0,0,0.7)" }}
          aria-label={`Syllabus: ${ROWS.length} modules, ${TOTAL} chapters`}
          role="table"
        >
          <div
            role="row"
            className="font-mono-data grid grid-cols-[1fr_auto] gap-x-4 border-b px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] sm:grid-cols-[5.5rem_1fr_4rem_5rem] sm:px-7 sm:text-[11.5px]"
            style={{ color: "#7F95BF", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span role="columnheader" className="hidden sm:block">Module</span>
            <span role="columnheader">Subject</span>
            <span role="columnheader" className="text-right">Ch</span>
            <span role="columnheader" className="hidden text-right sm:block">Status</span>
          </div>
          {ROWS.map((r, i) => {
            const landed = t === Infinity || t - i * ROW_DELAY > SPIN;
            return (
              <div
                key={r.code}
                role="row"
                className="font-mono-data grid grid-cols-[1fr_auto] items-center gap-x-4 border-b px-4 py-[11px] text-[12.5px] font-semibold uppercase sm:grid-cols-[5.5rem_1fr_4rem_5rem] sm:px-7 sm:py-3.5 sm:text-[14.5px]"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <span role="cell" className="hidden sm:block" style={{ color: "#8FA6D3" }}>{r.code}</span>
                <span role="cell" className="min-w-0 whitespace-pre" style={{ color: "#F5D97A" }}>
                  <span aria-hidden>{rowText(r.name, i, t)}</span>
                  <span className="sr-only">{r.name}</span>
                </span>
                <span role="cell" className="text-right tabular-nums" style={{ color: "#FFFFFF" }}>
                  <span aria-hidden>{rowText(String(r.chapters).padStart(2, "0"), i, t)}</span>
                  <span className="sr-only">{r.chapters} chapters</span>
                </span>
                <span role="cell" className="hidden items-center justify-end gap-2 sm:flex" style={{ color: landed ? "#4ADE9B" : "#7088B8", transition: "color .3s ease" }}>
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                  Ready
                </span>
              </div>
            );
          })}
          <div className="font-mono-data px-4 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] sm:px-7 sm:text-[11.5px]" style={{ color: "#7F95BF" }}>
            Every module: notes / flowcharts / question bank / mock papers
          </div>
        </div>
      </div>
    </section>
  );
}
