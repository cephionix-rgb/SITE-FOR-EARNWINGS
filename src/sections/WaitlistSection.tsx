import { motion } from "motion/react";
import { Mountain, LayoutDashboard, BookOpen, Sparkles } from "lucide-react";
import { Waitlist } from "../components/Waitlist";
import { inView, rise, stagger } from "../lib/motion";

// What's actually waiting inside — the value a cadet unlocks (impact, not captions).
const BENEFITS = [
  {
    icon: Mountain,
    accent: "#C9981F",
    title: "Your journey",
    desc: "Climb 15 ranks from Cadet to Captain — earning XP on every note, chapter, mock test and flight plan.",
  },
  {
    icon: LayoutDashboard,
    accent: "#2E6BE5",
    title: "Home dashboard",
    desc: "Your daily flight deck — today's study plan, live weather, streak and next mission, all at a glance.",
  },
  {
    icon: BookOpen,
    accent: "#1B3A7A",
    title: "Learning hub",
    desc: "Every DGCA subject with structured notes, video lectures, question banks and full timed mock exams.",
  },
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
            Join the waitlist and this is what's waiting the moment you step into the cockpit:
          </p>
        </motion.div>

        {/* What you get — impactful benefit cards */}
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={inView} className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={rise}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="card-soft relative overflow-hidden p-6 text-left"
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: b.accent }} />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${b.accent}18`, color: b.accent }}>
                  <Icon size={24} strokeWidth={2.1} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold font-display" style={{ color: "#1B3A7A" }}>{b.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "#40506e" }}>{b.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Founder-access callout */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto mt-5 flex max-w-4xl items-center gap-3 rounded-2xl px-5 py-4 text-left"
          style={{ background: "linear-gradient(100deg, rgba(201,152,31,0.16), rgba(245,217,122,0.10))", border: "1px solid rgba(201,152,31,0.3)" }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "#C9981F", color: "white" }}>
            <Sparkles size={20} />
          </span>
          <p className="text-[15px] font-semibold" style={{ color: "#40506e" }}>
            <b style={{ color: "#1B3A7A" }}>Founder cadets get more:</b> the full app free for a week, founder perks (RT, chapters, papers, flight plans &amp; Ask-Captain) and <b style={{ color: "#9a7415" }}>founder pricing locked in</b> before we ever charge a rupee.
          </p>
        </motion.div>

        <div className="mt-8">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}
