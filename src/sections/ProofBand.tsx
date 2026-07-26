import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Bot, Radio } from "lucide-react";
import { inView, rise, stagger } from "../lib/motion";
import { siteStats, CREDIBILITY_LINE, AI_CAPTAIN_TRAINED } from "../lib/siteConfig";
import { Testimonials } from "../components/Testimonials";

/** Count-up number that animates once when it scrolls into view. */
function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-[2.4rem] font-black leading-none" style={{ color: "#1B3A7A" }}>
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1.5 text-[13px] font-semibold" style={{ color: "#5F7499" }}>
        {label}
      </div>
    </div>
  );
}

/**
 * Proof / trust band (Task 5). Every number reads from siteStats. Credibility
 * and AI-Captain lines come from siteConfig. Testimonials render only when real
 * quotes exist.
 */
export function ProofBand() {
  const PROOF = [
    {
      icon: Bot,
      accent: "#1B3A7A",
      title: "An AI Captain that never bluffs",
      desc: AI_CAPTAIN_TRAINED,
    },
    {
      icon: Radio,
      accent: "#C9981F",
      title: "Speak to ATC, get graded",
      desc: "An interactive radio-telephony simulator scores your phraseology out loud — a real ATC exchange, not a script.",
    },
  ];

  return (
    <section id="proof" className="section">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="eyebrow">Built to be trusted</span>
        <h2
          className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight"
          style={{ color: "#0D1629" }}
        >
          Real instructors. Real depth. <span className="text-gradient-gold">No fluff.</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
          {CREDIBILITY_LINE}
        </p>
      </motion.div>

      {/* Content-scale counters (all from siteStats) */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="card-soft mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 p-8 sm:grid-cols-4"
      >
        <motion.div variants={rise}>
          <Counter to={siteStats.subjects} label="DGCA subjects" />
        </motion.div>
        <motion.div variants={rise}>
          <Counter to={siteStats.chapters} suffix="+" label="Chapters, fully loaded" />
        </motion.div>
        <motion.div variants={rise}>
          <Counter to={siteStats.questions} suffix="+" label="Practice questions" />
        </motion.div>
        <motion.div variants={rise}>
          <Counter to={siteStats.ranks} label="Ranks to climb" />
        </motion.div>
      </motion.div>

      <motion.p
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto mt-6 max-w-xl text-center text-[15px]"
        style={{ color: "#5F7499" }}
      >
        Walk into your DGCA exam having already solved {siteStats.questions.toLocaleString()}+ questions.
      </motion.p>

      {/* Two proof cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2"
      >
        {PROOF.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div key={p.title} variants={rise} className="card-soft p-6 text-left">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${p.accent}18`, color: p.accent }}
              >
                <Icon size={22} strokeWidth={2.1} />
              </div>
              <h3 className="mt-4 text-lg font-extrabold font-display" style={{ color: "#1B3A7A" }}>
                {p.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "#40506e" }}>
                {p.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <Testimonials />
    </section>
  );
}
