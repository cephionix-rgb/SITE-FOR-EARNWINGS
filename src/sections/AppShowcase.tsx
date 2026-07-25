import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { PhoneFrame } from "../components/DeviceFrame";
import { inView, rise } from "../lib/motion";

const PHONES = [
  { src: "/screens/app-journey.png", label: "Your journey", desc: "Track your climb from cadet to Captain", accent: "#C9981F" },
  { src: "/screens/app-dashboard.png", label: "Home dashboard", desc: "Your daily flight deck, at a glance", accent: "#2E6BE5" },
  { src: "/screens/app-learn.png", label: "Learning hub", desc: "Notes, videos & DGCA mock exams", accent: "#5BA4E8" },
];

// Center phone larger (sits "ahead"), side phones smaller (set "back").
const CENTER_W = 252;
const SIDE_W = 204;
const AREA_H = Math.round((CENTER_W * 19.3) / 9); // tallest phone height — keeps every bottom on one line

export function AppShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rowY = useTransform(scrollYProgress, [0, 1], [40, -60]);

  return (
    <section id="app" ref={ref} className="relative overflow-hidden">

      <div className="section relative">
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={inView} className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The app</span>
          <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight" style={{ color: "#0D1629" }}>
            Your cockpit, <span className="text-gradient-navy">in your pocket</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
            Real screens from EARNWINGS. Study on the bus, plan at the hangar, revise
            before your check-ride — it all syncs.
          </p>
        </motion.div>

        {/* Phones — standing straight, depth-staggered, a caption under each */}
        <motion.div style={{ y: rowY }} className="relative mt-14 flex items-start justify-center gap-8 sm:gap-12">
          {PHONES.map((p, i) => (
            <PhoneColumn key={p.label} p={p} center={i === 1} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PhoneColumn({ p, center }: { p: (typeof PHONES)[number]; center: boolean }) {
  const w = center ? CENTER_W : SIDE_W;
  return (
    <motion.div
      className={`flex flex-col items-center ${center ? "z-20" : "z-10 hidden sm:flex"}`}
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Fixed-height stage: phones bottom-align, so the taller center reads as "ahead". */}
      <div className="flex items-end justify-center" style={{ height: AREA_H }}>
        <div
          style={{
            opacity: center ? 1 : 0.95,
            filter: center
              ? "drop-shadow(0 38px 50px rgba(13,36,80,0.34))"
              : "drop-shadow(0 22px 34px rgba(13,36,80,0.20))",
          }}
        >
          <PhoneFrame src={p.src} alt={p.label} width={w} />
        </div>
      </div>
      {/* Caption directly beneath its phone */}
      <div className="mt-6" style={{ width: w + 12 }}>
        <Caption p={p} />
      </div>
    </motion.div>
  );
}

function Caption({ p }: { p: (typeof PHONES)[number] }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="inline-flex items-center gap-2 text-[15px] font-extrabold" style={{ color: "#1B3A7A" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
        {p.label}
      </span>
      <span className="text-[13px] leading-snug" style={{ color: "#5F7499" }}>
        {p.desc}
      </span>
    </div>
  );
}
