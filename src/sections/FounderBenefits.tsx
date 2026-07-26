import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { inView, rise, stagger } from "../lib/motion";
import { track } from "../lib/track";
import { SectionCTA } from "../components/SectionCTA";

/**
 * Founder Benefits (Task 3) — join before launch and lock these permanently.
 * Only the five benefits confirmed by the founder are listed. Text checkmarks,
 * no emojis. Placement is controlled from LandingPage.tsx (move with one line).
 */
const BENEFITS = [
  "Exclusive Commander badge",
  "Priority access to AI Captain",
  "Lifetime Founding Member status",
  "Early access to every new module",
  "Founder certificate",
];

export function FounderBenefits() {
  const ref = useRef<HTMLElement>(null);

  // Task 8 — fire once when the founder benefits scroll into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("founder_benefits_view");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="founder" className="section">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="eyebrow">Founding Cadets only</span>
        <h2
          className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight"
          style={{ color: "#0D1629" }}
        >
          Join before launch. <span className="text-gradient-gold">Lock these forever.</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
          Join before public launch to become a Founding Cadet — and keep every
          one of these, permanently.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2"
      >
        {BENEFITS.map((b) => (
          <motion.div
            key={b}
            variants={rise}
            className="card-soft flex items-center gap-3 p-5 text-left"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-black"
              style={{ background: "rgba(201,152,31,0.16)", color: "#9a7415" }}
            >
              &#10003;
            </span>
            <span className="text-[15.5px] font-semibold" style={{ color: "#1B3A7A" }}>
              {b}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Founding-member framing (calm, not high-pressure) */}
      <motion.p
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="mx-auto mt-8 max-w-xl text-center text-[15px] font-semibold"
        style={{ color: "#886611" }}
      >
        These are founding-member benefits — reserved for cadets who join before
        we open to the public.
      </motion.p>

      <SectionCTA variant="founder" />
    </section>
  );
}
