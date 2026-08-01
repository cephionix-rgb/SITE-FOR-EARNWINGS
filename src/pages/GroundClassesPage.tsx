import { useEffect } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Info,
  Plane,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { Link } from "../lib/router";
import { GC_FAQ, GC_H1, GC_HONESTY, GC_INTRO, INCLUDED, SYLLABUS } from "../content/groundClasses";
import { FOUNDER_SEATS, siteStats } from "../lib/siteConfig";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const BODY = "#41527A";
const MUTED = "#4A5A78";

const TOTAL_CHAPTERS = SYLLABUS.reduce((n, s) => n + s.chapters, 0);

export function GroundClassesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />

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
              <GraduationCap size={14} /> DGCA CPL &amp; ATPL ground school
            </span>
            <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.5rem)] font-black leading-tight" style={{ color: INK }}>
              {GC_H1[0]}
              <span className="text-gradient-gold">{GC_H1[1]}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              {GC_INTRO}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/#waitlist" className="btn-gold">
                <Plane size={18} /> Reserve My Captain Seat
              </Link>
              <Link to="/features" className="btn-ghost text-sm">
                See everything inside
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 sm:px-6">
        {/* Say plainly what this is and is not — before anyone signs up expecting a live batch. */}
        <section className="mt-6">
          <div
            className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl p-5"
            style={{ background: "rgba(46,107,229,0.07)", border: "1px solid rgba(46,107,229,0.18)" }}
          >
            <Info size={20} className="mt-0.5 shrink-0" style={{ color: "#2E6BE5" }} />
            <p className="text-[15px] leading-7" style={{ color: BODY }}>
              {GC_HONESTY}
            </p>
          </div>
        </section>

        {/* Syllabus — what every "ground classes" page is really asked for */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <BookOpen size={14} /> The syllabus
            </span>
            <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-black leading-tight" style={{ color: INK }}>
              {SYLLABUS.length} modules, {TOTAL_CHAPTERS} chapters, in exam order
            </h2>
            <p className="mt-3 text-[15.5px] leading-7" style={{ color: MUTED }}>
              The DGCA ground subjects for CPL and ATPL, broken into chapters and then topics — so you always
              know what you have covered and what is still open.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl" style={{ border: "1px solid rgba(27,58,122,0.1)" }}>
            {SYLLABUS.map((s, i) => (
              <div
                key={s.code}
                className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-7"
                style={{
                  background: i % 2 ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.92)",
                  borderTop: i ? "1px solid rgba(27,58,122,0.07)" : undefined,
                }}
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span
                    className="hidden shrink-0 font-mono text-[11px] font-bold tracking-[0.14em] sm:inline"
                    style={{ color: "#9a7415" }}
                  >
                    {s.code}
                  </span>
                  <span className="truncate text-[15px] font-bold" style={{ color: NAVY }}>
                    {s.name}
                  </span>
                </div>
                <span className="shrink-0 text-[13px] font-bold tabular-nums" style={{ color: MUTED }}>
                  {s.chapters} chapters
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* What's included */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <CheckCircle2 size={14} /> What you get
            </span>
            <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.3rem)] font-black leading-tight" style={{ color: INK }}>
              Everything a student pilot needs for the ground exams
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.87)",
                  border: "1px solid rgba(27,58,122,0.08)",
                  boxShadow: "0 20px 40px -32px rgba(27,58,122,0.5)",
                }}
              >
                <h3 className="font-black" style={{ color: NAVY }}>
                  {c.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-6" style={{ color: MUTED }}>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Who it fits */}
        <section className="mt-16">
          <div className="grid gap-4 md:grid-cols-2">
            <div
              className="rounded-3xl p-6 sm:p-7"
              style={{ background: "linear-gradient(160deg,#ffffff,#F3F8FF)", border: "1px solid rgba(201,152,31,0.35)" }}
            >
              <h3 className="text-xl font-black" style={{ color: NAVY }}>
                It fits if you are
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Flying at an FTO and studying between slots",
                  "Preparing for DGCA CPL or ATPL papers on your own",
                  "Repeating a subject you did not clear",
                  "Doing ground classes elsewhere and want the practice and mocks",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-6" style={{ color: BODY }}>
                    <span
                      aria-hidden
                      className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "#C9981F" }}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-3xl p-6 sm:p-7"
              style={{ background: "rgba(255,255,255,0.7)", border: "1px dashed rgba(27,58,122,0.22)" }}
            >
              <h3 className="text-xl font-black" style={{ color: NAVY }}>
                It does not fit if you want
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "A live instructor teaching to a fixed class timetable",
                  "Classroom attendance for an FTO requirement",
                  "Someone to file your DGCA paperwork for you",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14.5px] leading-6" style={{ color: MUTED }}>
                    <span
                      aria-hidden
                      className="mt-[9px] h-px w-3 shrink-0"
                      style={{ background: "#9AA7C2" }}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ — mirrored into FAQPage structured data by gen-routes */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.6rem,3.4vw,2.3rem)] font-black leading-tight" style={{ color: INK }}>
              Ground classes — questions we get asked
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-2xl divide-y" style={{ borderColor: "rgba(27,58,122,0.1)" }}>
            {GC_FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[16.5px] font-bold"
                  style={{ color: NAVY }}
                >
                  {item.q}
                  <ChevronRight
                    size={18}
                    className="shrink-0 transition-transform group-open:rotate-90"
                    style={{ color: "#886611" }}
                  />
                </summary>
                <p className="mt-2.5 text-[15px] leading-7" style={{ color: BODY }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-black leading-tight text-white">
            Start your ground classes with {siteStats.chapters} chapters ready
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            The first {FOUNDER_SEATS} to join become Founding Cadets — the full app free for a week, with the
            first chapters of every subject unlocked.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold">
              <Plane size={18} /> Reserve My Captain Seat
            </Link>
            <Link
              to="/why-earnwings"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Why EARNWINGS
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
