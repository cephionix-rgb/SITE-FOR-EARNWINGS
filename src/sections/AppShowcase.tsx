import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Smartphone, Globe, Monitor, Check } from "lucide-react";
import { PhoneFrame, LaptopFrame, TabletFrame } from "../components/DeviceFrame";
import { inView, rise } from "../lib/motion";

// Availability — one app, every platform (ships from one React codebase).
const PLATFORMS = [
  { label: "iOS", icon: Smartphone },
  { label: "Android", icon: Smartphone },
  { label: "Web", icon: Globe },
  { label: "macOS", icon: Monitor },
  { label: "Windows", icon: Monitor },
];

const SYNCS = [
  "Offline-ready notes",
  "Cloud sync across devices",
  "Pick up where you left off",
];

export function AppShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rowY = useTransform(scrollYProgress, [0, 1], [40, -50]);

  return (
    <section id="app" ref={ref} className="relative overflow-hidden">
      <div className="section relative">
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow">The app</span>
          <h2
            className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight"
            style={{ color: "#0D1629" }}
          >
            Your cockpit, <span className="text-gradient-navy">in your pocket</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#40506e" }}>
            The same EARNWINGS — on your phone, tablet, laptop and the web. Study on
            the bus, plan at the hangar, revise before your check-ride. One login,
            <b style={{ color: "#1B3A7A" }}> everything syncs.</b>
          </p>
        </motion.div>

        {/* Device lineup — laptop with phone + tablet, one synced account */}
        <motion.div style={{ y: rowY }} className="relative mt-16">
          {/* soft gold glow behind the devices */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              width: 640,
              maxWidth: "90%",
              height: 360,
              background:
                "radial-gradient(circle, rgba(245,217,122,0.32), transparent 70%)",
            }}
          />

          {/* Desktop / tablet-up: full trio */}
          <motion.div
            initial={{ opacity: 0, y: 46 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden items-end justify-center md:flex"
          >
            <TabletFrame
              src="/screens/app-learn.png"
              alt="EARNWINGS on tablet"
              width={168}
              className="relative z-10 mr-[-42px] mb-8 rotate-[-5deg]"
            />
            <LaptopFrame
              src="/screens/flight-airways.png"
              alt="EARNWINGS flight planning on laptop"
              width={520}
              className="relative z-20"
            />
            <PhoneFrame
              src="/screens/app-dashboard.png"
              alt="EARNWINGS on phone"
              width={150}
              className="relative z-30 mb-1 ml-[-46px] rotate-[3deg]"
            />
          </motion.div>

          {/* Mobile: laptop + overlapping phone (tablet dropped to keep it clean) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-end justify-center md:hidden"
          >
            <LaptopFrame
              src="/screens/flight-airways.png"
              alt="EARNWINGS flight planning on laptop"
              width={300}
              className="relative z-10"
            />
            <PhoneFrame
              src="/screens/app-dashboard.png"
              alt="EARNWINGS on phone"
              width={104}
              className="relative z-20 mb-1 ml-[-30px] rotate-[3deg]"
            />
          </motion.div>
        </motion.div>

        {/* Platform badges + sync guarantees */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-14 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {PLATFORMS.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  color: "#1B3A7A",
                  border: "1px solid rgba(27,58,122,0.12)",
                  boxShadow: "0 8px 22px -14px rgba(27,58,122,0.5)",
                }}
              >
                <p.icon size={15} strokeWidth={2.4} style={{ color: "#C9981F" }} />
                {p.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
            {SYNCS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 text-[15px] font-semibold"
                style={{ color: "#40506e" }}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ background: "#1B3A7A", color: "#fff" }}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
