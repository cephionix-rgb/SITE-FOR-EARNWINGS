import { motion } from "motion/react";
import { BookOpen, FileText, Radio, Trophy } from "lucide-react";
import { inView, rise, stagger } from "../lib/motion";

// Styled exactly like the EARNWINGS app's dashboard stat cards
// (white rounded card + coloured icon chip + bold navy value + muted label).
const STAT_CARDS = [
  { icon: BookOpen, value: "5", label: "Subjects", color: "#2E6BE5", bg: "#EBF1FF" },
  { icon: FileText, value: "10,000+", label: "Questions", color: "#C9981F", bg: "#FFF8E7" },
  { icon: Radio, value: "∞", label: "RT scenarios", color: "#059669", bg: "#E8F8F2" },
  { icon: Trophy, value: "15", label: "Ranks", color: "#7C3AED", bg: "#F3EEFF" },
];

export function StatsMarquee() {
  return (
    <section id="stats" className="relative z-10 -mt-6">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="glass grid grid-cols-2 gap-3 rounded-3xl p-4 sm:grid-cols-4 sm:p-5"
        >
          {STAT_CARDS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={rise}
                whileHover={{ y: -3 }}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4"
                style={{ boxShadow: "0 2px 12px rgba(27,58,122,0.08)" }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-black" style={{ color: "#1B3A7A" }}>{s.value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#5F7499" }}>
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
