import { motion } from "motion/react";
import { ASPIRATION_IMAGE } from "../lib/siteConfig";

/**
 * A quiet, full-bleed, typographically-led moment (Task 6). Not a card.
 * Image slot with a graceful navy gradient fallback when no photo is supplied.
 */
export function AspirationalMoment() {
  const hasImage = ASPIRATION_IMAGE.length > 0;
  return (
    <section className="relative w-full overflow-hidden py-28 sm:py-40">
      {/* Background: real photo if supplied, else premium navy gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={
          hasImage
            ? {
                backgroundImage: `url(${ASPIRATION_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                background:
                  "radial-gradient(130% 100% at 50% 20%, #12315F 0%, #0A1E44 45%, #06122B 100%)",
              }
        }
      />
      {/* Legibility + vignette overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: hasImage
            ? "linear-gradient(180deg, rgba(6,18,43,0.55), rgba(6,18,43,0.82))"
            : "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(3,10,26,0.6) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(1.4rem,3vw,2.1rem)] font-semibold leading-snug"
          style={{ color: "rgba(234,241,255,0.86)" }}
        >
          One day the first officer beside you asks where you prepared for DGCA.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="mt-6 font-display text-[clamp(2rem,5vw,3.6rem)] font-black leading-tight"
          style={{ color: "#FFFFFF" }}
        >
          You&rsquo;ll smile.{" "}
          <span style={{ color: "#F5D97A" }}>&ldquo;EarnWings.&rdquo;</span>
        </motion.p>
      </div>
    </section>
  );
}
