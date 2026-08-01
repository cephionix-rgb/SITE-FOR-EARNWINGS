import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ChevronLeft, Check, Plane, ShieldAlert, Sparkles } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { Link } from "../lib/router";
import { CATEGORIES, PROBLEMS, WHY_H1, WHY_INTRO, type Category, type Severity } from "../content/whyEarnwings";
import { FOUNDER_SEATS, siteStats } from "../lib/siteConfig";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const BODY = "#41527A";
const MUTED = "#4A5A78";

const SEVERITY: Record<Severity, { bg: string; fg: string }> = {
  CRITICAL: { bg: "rgba(220,38,38,0.1)", fg: "#b91c1c" },
  HIGH: { bg: "rgba(201,152,31,0.14)", fg: "#8a6a12" },
  MEDIUM: { bg: "rgba(46,107,229,0.1)", fg: "#2359bd" },
};

type Filter = "All" | Category;

export function WhyEarnwingsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(() => {
    const byCategory = Object.fromEntries(
      CATEGORIES.map((c) => [c, PROBLEMS.filter((p) => p.category === c).length]),
    ) as Record<Category, number>;
    const bySeverity = {
      CRITICAL: PROBLEMS.filter((p) => p.severity === "CRITICAL").length,
      HIGH: PROBLEMS.filter((p) => p.severity === "HIGH").length,
      MEDIUM: PROBLEMS.filter((p) => p.severity === "MEDIUM").length,
    };
    return { byCategory, bySeverity };
  }, []);

  const shown = filter === "All" ? PROBLEMS : PROBLEMS.filter((p) => p.category === filter);

  const HERO_STATS = [
    { value: String(PROBLEMS.length), label: "Documented gaps" },
    { value: String(CATEGORIES.length), label: "Problem areas" },
    { value: String(siteStats.chapters), label: "Chapters that close them" },
    { value: "0", label: "Invented by the AI" },
  ];

  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />

      {/* Hero */}
      <header className="px-5 pb-8 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
            style={{ color: MUTED }}
          >
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">
              <ShieldAlert size={14} /> The state of DGCA ground school
            </span>
            <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.5rem)] font-black leading-tight" style={{ color: INK }}>
              {WHY_H1[0]}
              <span className="text-gradient-gold">{WHY_H1[1]}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              {WHY_INTRO}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/#waitlist" className="btn-gold">
                <Plane size={18} /> Reserve My Captain Seat
              </Link>
              <a href="#report" className="btn-ghost text-sm">
                Read the gap report ↓
              </a>
            </div>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl px-3 py-4"
                style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(27,58,122,0.08)" }}
              >
                <div className="text-2xl font-black" style={{ color: "#C9981F" }}>
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-6">
        {/* The report */}
        <section id="report" className="mt-10 scroll-mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <AlertTriangle size={14} /> The gap report
            </span>
            <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-black leading-tight" style={{ color: INK }}>
              {PROBLEMS.length} things ground school leaves you to solve alone
            </h2>
            <p className="mt-3 text-[15.5px] leading-7" style={{ color: MUTED }}>
              Not hypothetical. This is the ordinary experience of preparing for DGCA CPL and ATPL exams in
              India — and the part of EARNWINGS built to close each one.
            </p>
          </div>

          {/* Severity summary */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {(["CRITICAL", "HIGH", "MEDIUM"] as Severity[]).map((s) => (
              <span key={s} className="pill" style={{ background: SEVERITY[s].bg, color: SEVERITY[s].fg }}>
                {counts.bySeverity[s]} {s}
              </span>
            ))}
          </div>

          {/* Category filter */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {(["All", ...CATEGORIES] as Filter[]).map((c) => {
              const active = filter === c;
              const n = c === "All" ? PROBLEMS.length : counts.byCategory[c as Category];
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  aria-pressed={active}
                  className="rounded-full px-4 py-2 text-[13px] font-bold transition-colors"
                  style={{
                    background: active ? NAVY : "rgba(255,255,255,0.8)",
                    color: active ? "#fff" : NAVY,
                    border: `1px solid ${active ? NAVY : "rgba(27,58,122,0.12)"}`,
                  }}
                >
                  {c} <span style={{ opacity: 0.6 }}>{n}</span>
                </button>
              );
            })}
          </div>

          {/* Problem → fix cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {shown.map((p, i) => (
              <motion.article
                key={p.n}
                layout
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.05 }}
                className="flex flex-col overflow-hidden rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(27,58,122,0.08)",
                  boxShadow: "0 24px 50px -40px rgba(27,58,122,0.6)",
                }}
              >
                <div className="flex items-center justify-between gap-3 px-5 pt-4">
                  <span className="font-mono text-[11px] font-bold tracking-[0.16em]" style={{ color: "#9a7415" }}>
                    GAP #{String(p.n).padStart(2, "0")}
                  </span>
                  <span
                    className="pill"
                    style={{ background: SEVERITY[p.severity].bg, color: SEVERITY[p.severity].fg }}
                  >
                    {p.severity}
                  </span>
                </div>

                <div className="px-5 pb-4 pt-2">
                  <h3 className="text-[17.5px] font-black leading-snug" style={{ color: NAVY }}>
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-7" style={{ color: BODY }}>
                    {p.body}
                  </p>
                </div>

                {/* the fix */}
                <div
                  className="mt-auto flex items-start gap-2.5 px-5 py-4"
                  style={{ background: "rgba(27,58,122,0.035)", borderTop: "1px solid rgba(27,58,122,0.07)" }}
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#1B3A7A", color: "#fff" }}
                  >
                    <Check size={12} />
                  </span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "#9a7415" }}>
                      Closed by EARNWINGS
                    </div>
                    <p className="mt-1 text-[14px] leading-6" style={{ color: MUTED }}>
                      {p.fix}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* What it adds up to */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <Sparkles size={14} /> What it adds up to
            </span>
            <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-black leading-tight" style={{ color: INK }}>
              One cockpit instead of {PROBLEMS.length} workarounds
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                k: `${siteStats.chapters} chapters`,
                v: "Every DGCA ground subject mapped in exam order, each with notes, a summary and a flowchart.",
              },
              {
                k: `${siteStats.questions.toLocaleString("en-IN")}+ questions`,
                v: "Marked the way the exam marks them, with a Captain analysis of every answer you lose.",
              },
              {
                k: `${siteStats.ranks} ranks`,
                v: "XP from real study, so the months between joining and your licence are something you can see.",
              },
            ].map((c) => (
              <div
                key={c.k}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.86)", border: "1px solid rgba(27,58,122,0.08)" }}
              >
                <div className="text-xl font-black" style={{ color: "#C9981F" }}>
                  {c.k}
                </div>
                <p className="mt-2 text-[14px] leading-6" style={{ color: MUTED }}>
                  {c.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-black leading-tight text-white">
            You've seen the gaps. Now close them.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            The first {FOUNDER_SEATS} to join become Founding Cadets — early access, founder perks, and the
            full app free for a week.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold">
              <Plane size={18} /> Reserve My Captain Seat
            </Link>
            <Link
              to="/features"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Explore the cockpit
            </Link>
            <Link
              to="/#play"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Try it live
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
