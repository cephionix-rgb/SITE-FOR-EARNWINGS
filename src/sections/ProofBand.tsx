import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Bot, Radio } from "lucide-react";
import { gsap, useGSAP } from "../lib/gsap";
import { inView, rise, stagger } from "../lib/motion";
import { prefersReducedMotion } from "../lib/scroll";
import { siteStats, CREDIBILITY_LINE, AI_CAPTAIN_TRAINED } from "../lib/siteConfig";
import { Testimonials } from "../components/Testimonials";

/**
 * Count-up number that animates once when it scrolls into view.
 *
 * GSAP tweens a plain object and pushes each frame into React state, so the
 * number rides the same ticker as the rest of the site's animations — and
 * ScrollTrigger replaces the hand-rolled IntersectionObserver + rAF loop.
 * Under reduced motion the final value is shown immediately.
 */
function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setN(to);
        return;
      }
      const counter = { value: 0 };
      gsap.to(counter, {
        value: to,
        duration: 1.2,
        ease: "power3.out",
        snap: { value: 1 },
        onUpdate: () => setN(counter.value),
        scrollTrigger: {
          trigger: ref.current,
          // Matches the old IntersectionObserver threshold of 0.4 — the number
          // starts climbing once the tile is properly on screen, not at its edge.
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <div ref={ref} className="text-center">
      <div className="text-[2.4rem] font-black leading-none" style={{ color: "#1B3A7A" }}>
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1.5 text-[13px] font-semibold" style={{ color: "#4A5A78" }}>
        {label}
      </div>
    </div>
  );
}

/**
 * Proof / trust band (Task 5). Every number reads from siteStats. Credibility
 * and Captain Aezon lines come from siteConfig. Testimonials render only when real
 * quotes exist.
 */
export function ProofBand() {
  const PROOF = [
    {
      icon: Bot,
      accent: "#1B3A7A",
      title: "Captain Aezon never bluffs",
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
        style={{ color: "#4A5A78" }}
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
