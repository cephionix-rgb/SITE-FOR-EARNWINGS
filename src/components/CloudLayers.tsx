import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Photoreal parallax cloud field for the hero. Two copies of the generated
 * cloud plate drift at different depths as the user scrolls, selling the
 * "flying through the sky" feel. Falls back to a sky gradient underneath.
 */
export function CloudLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const back = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const front = useTransform(scrollYProgress, [0, 1], ["0%", "-34%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sky gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #F7FAFF 0%, #EBF3FF 30%, #D6E7FB 68%, #C1DCF7 100%)",
        }}
      />
      {/* Far cloud layer */}
      <motion.div
        style={{ y: back, opacity: fade }}
        className="absolute inset-x-0 top-0 h-[130%]"
      >
        <picture className="block h-full w-full">
          <source
            type="image/avif"
            srcSet="/assets/hero-clouds-1024.avif 1024w, /assets/hero-clouds-1920.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/assets/hero-clouds-1024.webp 1024w, /assets/hero-clouds-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/assets/hero-clouds-1920.jpg"
            srcSet="/assets/hero-clouds-1024.jpg 1024w, /assets/hero-clouds-1920.jpg 1920w"
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
        </picture>
      </motion.div>
      {/* Near cloud layer (bottom, larger, faster) */}
      <motion.div
        style={{ y: front, opacity: fade }}
        className="absolute inset-x-0 bottom-0 h-[80%]"
      >
        <picture className="block h-full w-full">
          <source
            type="image/avif"
            srcSet="/assets/hero-clouds-1024.avif 1024w, /assets/hero-clouds-1920.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/assets/hero-clouds-1024.webp 1024w, /assets/hero-clouds-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/assets/hero-clouds-1920.jpg"
            srcSet="/assets/hero-clouds-1024.jpg 1024w, /assets/hero-clouds-1920.jpg 1920w"
            sizes="100vw"
            alt=""
            className="h-full w-full scale-125 object-cover"
            style={{
              transform: "scaleX(-1)",
              maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            }}
          />
        </picture>
      </motion.div>
      {/* Soft white floor so content below blends in */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(180deg, transparent, #EBF3FF)" }}
      />
    </div>
  );
}
