import { motion } from "motion/react";
import { Check, Globe2, Plane } from "lucide-react";
import {
  REGIONS,
  REGIONS_EYEBROW,
  REGIONS_FOOTNOTE,
  REGIONS_H2,
  REGIONS_INTRO,
  REGION_STATUS,
} from "../content/regions";
import { inView, rise } from "../lib/motion";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const MUTED = "#4A5A78";

const TONE = {
  live: { bg: "#FFF3D6", fg: "#8a6a12", dot: "#C9981F", border: "rgba(201,152,31,0.4)" },
  next: { bg: "rgba(46,107,229,0.1)", fg: "#2359bd", dot: "#2E6BE5", border: "rgba(46,107,229,0.22)" },
  planned: { bg: "rgba(27,58,122,0.06)", fg: "#5F7499", dot: "#9AA7C2", border: "rgba(27,58,122,0.12)" },
} as const;

/**
 * The regulator roadmap: what the app covers today (DGCA) and the syllabuses it
 * is going to next. Rendered as a route with waypoints — the first is reached,
 * the rest are ahead — so the sequence reads as a plan rather than as a claim
 * that the app already supports four regulators.
 */
export function Roadmap({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "section"}>
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="eyebrow">
          <Globe2 size={14} /> {REGIONS_EYEBROW}
        </span>
        <h2 className="mt-3 text-[clamp(1.7rem,3.6vw,2.4rem)] font-black leading-tight" style={{ color: INK }}>
          {REGIONS_H2}
        </h2>
        <p className="mt-3 text-[15.5px] leading-7" style={{ color: MUTED }}>
          {REGIONS_INTRO}
        </p>
      </motion.div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REGIONS.map((r, i) => {
          const status = REGION_STATUS[r.status];
          const tone = TONE[status.tone as keyof typeof TONE];
          const isLive = r.status === "live";
          return (
            <motion.div
              key={r.code}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative flex flex-col rounded-2xl p-5"
              style={{
                background: isLive ? "linear-gradient(160deg,#ffffff,#FFFBEF)" : "rgba(255,255,255,0.82)",
                border: `1px solid ${tone.border}`,
                boxShadow: isLive ? "0 26px 60px -40px rgba(201,152,31,0.7)" : "0 20px 44px -36px rgba(27,58,122,0.5)",
              }}
            >
              {/* leg number on the route */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-[0.16em]" style={{ color: "#9aa9c4" }}>
                  LEG {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pill" style={{ background: tone.bg, color: tone.fg }}>
                  {isLive && <Check size={11} />}
                  {status.label}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: tone.dot, boxShadow: `0 0 0 4px ${tone.bg}` }}
                />
                <span className="text-[22px] font-black leading-none" style={{ color: NAVY }}>
                  {r.code}
                </span>
              </div>
              <div className="mt-1.5 text-[13px] font-bold" style={{ color: "#886611" }}>
                {r.region}
              </div>
              <div className="mt-0.5 text-[11.5px] leading-5" style={{ color: "#9aa9c4" }}>
                {r.authority}
              </div>

              <p className="mt-3 text-[13.5px] leading-6" style={{ color: MUTED }}>
                {r.note}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* The honest line, not hidden in small print at the bottom of the page. */}
      <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl px-5 py-4">
        <Plane size={16} className="mt-0.5 shrink-0" style={{ color: "#9aa9c4", transform: "rotate(45deg)" }} />
        <p className="text-[13.5px] leading-6" style={{ color: MUTED }}>
          {REGIONS_FOOTNOTE}
        </p>
      </div>
    </section>
  );
}
