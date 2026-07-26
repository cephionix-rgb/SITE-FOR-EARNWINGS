import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { inView, rise } from "../lib/motion";
import { prefersReducedMotion } from "../lib/scroll";

/**
 * "The flight deck" — the full DGCA ground-school syllabus shown as a light,
 * frosted-glass airport DEPARTURES board that sits on the cloud sky. Every
 * subject is a "flight" whose columns split-flap in and settle on FULLY LOADED.
 * Data (names, chapter counts) is from the live app.
 */

type Row = { code: string; name: string; chapters: number; accent: string };

const ROWS: Row[] = [
  { code: "EW 201", name: "AVIATION METEOROLOGY I", chapters: 19, accent: "#2E6BE5" },
  { code: "EW 202", name: "AVIATION METEOROLOGY II", chapters: 6, accent: "#2E6BE5" },
  { code: "EW 203", name: "GENERAL NAVIGATION", chapters: 29, accent: "#1B3A7A" },
  { code: "EW 204", name: "INSTRUMENTS & NAVIGATION", chapters: 23, accent: "#1B3A7A" },
  { code: "EW 205", name: "RADIO NAVIGATION", chapters: 18, accent: "#B8860B" },
  { code: "EW 206", name: "POWERPLANT", chapters: 27, accent: "#1B3A7A" },
  { code: "EW 207", name: "PRINCIPLES OF FLIGHT", chapters: 17, accent: "#2E6BE5" },
  { code: "EW 208", name: "ELECTRICS & ELECTRONICS", chapters: 17, accent: "#B8860B" },
  { code: "EW 209", name: "AIRCRAFT PERFORMANCE", chapters: 7, accent: "#2E6BE5" },
  { code: "EW 210", name: "MASS, BALANCE & FLIGHT PLANNING", chapters: 3, accent: "#B8860B" },
  { code: "EW 211", name: "AIR REGULATIONS", chapters: 24, accent: "#1B3A7A" },
  { code: "EW 212", name: "RADIO TELEPHONY (RTR)", chapters: 12, accent: "#B8860B" },
];

const TOTAL = ROWS.reduce((n, r) => n + r.chapters, 0);
const INCLUDES = "NOTES · VISUAL · VIDEOS · Q-BANK · FLOWCHARTS · MOCK EXAMS · AI CAPTAIN";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&/().,- ";
const GREEN = "#0E9F63";

/** One split-flap tile: cycles a few random glyphs, then lands on its char. */
function Flap({ target, active, delay, reduced }: { target: string; active: boolean; delay: number; reduced: boolean }) {
  const [ch, setCh] = useState(" ");
  useEffect(() => {
    if (!active) { setCh(" "); return; }
    if (reduced || target === " ") { setCh(target); return; }
    const flips = 4 + Math.floor(Math.random() * 5); // 4–8
    let n = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        n += 1;
        if (n >= flips) { setCh(target); clearInterval(iv); }
        else setCh(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      }, 46);
    }, delay);
    return () => { clearTimeout(start); if (iv) clearInterval(iv); };
  }, [active, target, delay, reduced]);

  return (
    <span className="relative inline-flex h-[1.55em] min-w-[0.72em] items-center justify-center rounded-[3px] bg-[#e7eef9] px-[1px] font-mono tabular-nums shadow-[inset_0_-1px_0_rgba(27,58,122,0.06)] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-[rgba(27,58,122,0.14)] after:content-['']">
      {ch === " " ? " " : ch}
    </span>
  );
}

function SplitFlap({ text, active, baseDelay, reduced, className }: { text: string; active: boolean; baseDelay: number; reduced: boolean; className?: string }) {
  return (
    <span className={`inline-flex gap-[1.5px] align-middle ${className ?? ""}`}>
      {text.split("").map((c, i) => (
        <Flap key={i} target={c} active={active} delay={baseDelay + i * 24} reduced={reduced} />
      ))}
    </span>
  );
}

function BoardRow({ row, i, active, reduced }: { row: Row; i: number; active: boolean; reduced: boolean }) {
  const rowDelay = i * 130;
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-[rgba(27,58,122,0.09)] py-2.5 text-[11px] leading-none sm:grid-cols-[5.4em_1fr_3.6em_auto] sm:gap-x-4 sm:text-[13px]">
      {/* FLT code (hidden on mobile) */}
      <span className="hidden sm:inline-flex" style={{ color: "#9a7415" }}>
        <SplitFlap text={row.code} active={active} baseDelay={rowDelay} reduced={reduced} />
      </span>
      {/* Subject = destination */}
      <span style={{ color: "#1B3A7A" }}>
        <SplitFlap text={row.name} active={active} baseDelay={rowDelay + 90} reduced={reduced} className="flex-wrap sm:flex-nowrap" />
      </span>
      {/* chapters */}
      <span className="hidden items-center gap-1 sm:inline-flex" style={{ color: row.accent }}>
        <SplitFlap text={String(row.chapters)} active={active} baseDelay={rowDelay + 220} reduced={reduced} />
        <span className="font-mono text-[0.8em] opacity-60">CH</span>
      </span>
      {/* status */}
      <span className="inline-flex items-center gap-1.5 justify-self-end" style={{ color: GREEN }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
        <SplitFlap text="FULLY LOADED" active={active} baseDelay={rowDelay + 300} reduced={reduced} />
      </span>
    </div>
  );
}

export function FlightPathScroll() {
  const reduced = prefersReducedMotion();
  const [started, setStarted] = useState(false);

  return (
    <section id="features" className="relative overflow-hidden">
      <div className="section relative">
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The flight deck</span>
          <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
            Everything a cadet needs, <span className="text-gradient-gold">on one runway</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
            Stop stitching PDFs, YouTube and coaching notes together. The whole DGCA CPL &amp; ATPL syllabus —{" "}
            <b style={{ color: "#1B3A7A" }}>{ROWS.length} subjects</b>, <b style={{ color: "#1B3A7A" }}>{TOTAL}+ chapters</b> — lives in one place, so you always know exactly what to study next.
          </p>
        </motion.div>

        {/* Departures board (light / frosted) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          onViewportEnter={() => setStarted(true)}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,0.74)",
            boxShadow: "0 44px 100px -44px rgba(13,36,80,0.45), inset 0 0 0 1px rgba(27,58,122,0.10)",
          }}
        >
          {/* bezel / header */}
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(27,58,122,0.10)] bg-white/45 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Plane size={17} style={{ color: "#C9981F" }} />
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] sm:text-[13px]" style={{ color: "#1B3A7A" }}>GROUND SCHOOL · DEPARTURES</span>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest sm:text-[11px]" style={{ color: GREEN }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GREEN }} />
              ALL FLIGHTS ON TIME
            </span>
          </div>

          {/* column headings */}
          <div className="grid grid-cols-[1fr_auto] gap-x-3 px-4 pb-1 pt-3 font-mono text-[9px] font-bold tracking-[0.2em] sm:grid-cols-[5.4em_1fr_3.6em_auto] sm:gap-x-4 sm:px-6 sm:text-[10px]" style={{ color: "#8195b5" }}>
            <span className="hidden sm:inline">FLIGHT</span>
            <span>SUBJECT</span>
            <span className="hidden sm:inline">CH</span>
            <span className="justify-self-end">STATUS</span>
          </div>

          {/* rows */}
          <div className="px-4 pb-2 sm:px-6">
            {ROWS.map((row, i) => (
              <BoardRow key={row.code} row={row} i={i} active={started} reduced={reduced} />
            ))}
          </div>

          {/* footer — what every flight includes */}
          <div className="border-t border-[rgba(27,58,122,0.10)] bg-white/45 px-4 py-3 text-center sm:px-6">
            <span className="font-mono text-[9px] font-bold tracking-[0.16em] sm:text-[10.5px]" style={{ color: "#6b7f9f" }}>
              EVERY FLIGHT INCLUDES · {INCLUDES}
            </span>
          </div>
        </motion.div>

        <motion.p variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto mt-6 max-w-xl text-center text-[15px] font-semibold" style={{ color: "#40506e" }}>
          Board any subject and your progress tracks automatically — earning XP as you climb from Cadet to Captain.
        </motion.p>
      </div>
    </section>
  );
}
