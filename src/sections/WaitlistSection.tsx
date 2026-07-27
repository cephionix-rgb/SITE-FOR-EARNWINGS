import { motion } from "motion/react";
import { Rocket, BookOpen, ListChecks, FileText, Radio, Route, Scale, CloudSun, Swords, Sparkles, Lock } from "lucide-react";
import { Waitlist } from "../components/Waitlist";
import { inView, rise, stagger } from "../lib/motion";

/**
 * Founder perks — spelled out EXACTLY, so a cadet knows which is which.
 * This is a taste of the app, not the whole thing: content depth is deliberately
 * capped (2 chapters/subject), and everything else is metered in credits of 5.
 * Acing the "Cadet to Commander" quiz below doubles every 5 into a 10.
 */

// Depth you get to explore — intentionally limited (this is a preview, not the full app).
const UNLOCKS = [
  { icon: BookOpen, title: "First 2 chapters", desc: "Unlocked in every DGCA subject — a real taste of each course." },
  { icon: ListChecks, title: "Chapter MCQ banks", desc: "Practice question banks for those 2 chapters, in every subject." },
  { icon: FileText, title: "1 sample paper", desc: "One full timed sample paper unlocked per subject." },
];

// Metered founder credits — 5 of each. Ace the quiz below and every 5 becomes 10.
const CREDITS = [
  { icon: Radio, title: "RT scenarios", desc: "Voice radio-telephony practice sessions." },
  { icon: Route, title: "Flight plans", desc: "Plan real routes, gate to gate." },
  { icon: Scale, title: "Weight & balance", desc: "Load-sheet & centre-of-gravity calcs." },
  { icon: CloudSun, title: "METAR challenges", desc: "Decode live weather like a pre-flight briefing." },
  { icon: Swords, title: "Compete matches", desc: "Head-to-head quiz duels against other cadets." },
  { icon: Sparkles, title: "Ask-Captain doubts", desc: "Questions answered by the AI Captain." },
];

export function WaitlistSection() {
  return (
    <section id="waitlist" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full opacity-60" style={{ background: "radial-gradient(circle,rgba(201,152,31,0.18),transparent 70%)" }} />

      <div className="section relative">
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Boarding soon</span>
          <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
            Ready to <span className="text-gradient-gold">earn your wings?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "#40506e" }}>
            The first <b style={{ color: "#1B3A7A" }}>200</b> to join become <b style={{ color: "#1B3A7A" }}>founder cadets</b>.
            Here's exactly what unlocks — every perk spelled out, so you know precisely what you're getting.
          </p>
        </motion.div>

        {/* THE PERK BOARD — a taste of the app, laid out so you know which is which */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[2rem]"
          style={{ background: "#fff", border: "1px solid rgba(27,58,122,0.1)", boxShadow: "0 40px 90px -45px rgba(27,58,122,0.4)" }}
        >
          {/* Full-app banner */}
          <div className="flex flex-col items-start gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ background: "linear-gradient(100deg,#1B3A7A,#2E6BE5)" }}>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.15)", color: "#F5D97A" }}>
                <Rocket size={22} />
              </span>
              <div>
                <div className="text-lg font-black leading-tight text-white">The full app — free for 7 days</div>
                <div className="text-[13px] font-semibold" style={{ color: "#Bcd3f5" }}>Every feature open for a week, no card required.</div>
              </div>
            </div>
            <span className="rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-widest" style={{ background: "#F5D97A", color: "#3d2c00" }}>
              Founder pricing locked in
            </span>
          </div>

          <div className="grid gap-px sm:grid-cols-2" style={{ background: "rgba(27,58,122,0.08)" }}>
            {/* Column A — content you unlock (capped on purpose) */}
            <div className="bg-white p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: "#1B3A7A" }}>
                <Lock size={13} /> Unlocked to explore
              </div>
              <p className="mt-1 text-[12.5px] font-medium" style={{ color: "#7186a8" }}>A real preview of each course — not the whole library.</p>
              <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={inView} className="mt-4 space-y-3.5">
                {UNLOCKS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <motion.li key={p.title} variants={rise} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(27,58,122,0.08)", color: "#2E6BE5" }}>
                        <Icon size={18} strokeWidth={2.1} />
                      </span>
                      <div>
                        <div className="text-[14.5px] font-extrabold" style={{ color: "#1B3A7A" }}>{p.title}</div>
                        <div className="text-[13px] leading-snug" style={{ color: "#5F7499" }}>{p.desc}</div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>

            {/* Column B — the 5-each founder credits */}
            <div className="bg-white p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest" style={{ color: "#9a7415" }}>
                <Sparkles size={13} /> 5 of each to spend
              </div>
              <p className="mt-1 text-[12.5px] font-medium" style={{ color: "#a98a3f" }}>Ace the quiz below and every 5 doubles to 10.</p>
              <motion.ul variants={stagger} initial="hidden" whileInView="show" viewport={inView} className="mt-4 grid gap-x-4 gap-y-3.5 sm:grid-cols-1">
                {CREDITS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <motion.li key={p.title} variants={rise} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-black" style={{ background: "rgba(201,152,31,0.12)", color: "#9a7415" }}>
                        5×
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon size={15} strokeWidth={2.2} style={{ color: "#C9981F" }} />
                          <span className="text-[14.5px] font-extrabold" style={{ color: "#1B3A7A" }}>{p.title}</span>
                        </div>
                        <div className="text-[13px] leading-snug" style={{ color: "#5F7499" }}>{p.desc}</div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </div>

          {/* Honest footer */}
          <div className="border-t px-6 py-4 text-center sm:px-8" style={{ borderColor: "rgba(27,58,122,0.08)", background: "rgba(27,58,122,0.02)" }}>
            <p className="text-[13px] font-semibold" style={{ color: "#5F7499" }}>
              A genuine taste of EARNWINGS — enough to fall in love with it, capped so it stays fair to every founder cadet.
            </p>
          </div>
        </motion.div>

        <div className="mt-8">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}
