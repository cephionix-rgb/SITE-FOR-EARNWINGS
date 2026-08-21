import { useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ExternalLink, FlaskConical, Info, Plane, Wrench } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { Link } from "../lib/router";
import {
  RESEARCH,
  RESEARCH_DISCLAIMER,
  RESEARCH_H1,
  RESEARCH_INTRO,
  RESEARCH_RESPONSE,
} from "../content/research";
import { FOUNDER_SEATS, NEURALWINGS_URL } from "../lib/siteConfig";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const BODY = "#41527A";
const MUTED = "#4A5A78";

export function ResearchPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative min-h-screen">
      <Nav solid />
      <CloudBackground />

      <header className="px-5 pb-8 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
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
              <FlaskConical size={14} /> Evidence, not adjectives
            </span>
            <h1 className="mt-3 text-[clamp(2rem,4.8vw,3.3rem)] font-black leading-tight" style={{ color: INK }}>
              {RESEARCH_H1[0]}
              <span className="text-gradient-gold">{RESEARCH_H1[1]}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              {RESEARCH_INTRO}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-20 sm:px-6">
        {/* Attribution — stated before anything is quoted, not buried at the bottom. */}
        <div
          className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl p-5"
          style={{ background: "rgba(46,107,229,0.07)", border: "1px solid rgba(46,107,229,0.18)" }}
        >
          <Info size={20} className="mt-0.5 shrink-0" style={{ color: "#2E6BE5" }} />
          <p className="text-[15px] leading-7" style={{ color: BODY }}>
            <strong style={{ color: NAVY }}>This research is not ours.</strong> {RESEARCH_DISCLAIMER}
          </p>
        </div>

        {/* The studies */}
        <section className="mt-14 space-y-8">
          {RESEARCH.map((r, i) => (
            <motion.article
              key={r.id}
              id={r.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-24 overflow-hidden rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(27,58,122,0.09)",
                boxShadow: "0 30px 70px -46px rgba(27,58,122,0.6)",
              }}
            >
              <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-8">
                {/* The number */}
                <div className="md:w-44">
                  <span className="font-mono text-[11px] font-bold tracking-[0.18em]" style={{ color: "#9a7415" }}>
                    {String(i + 1).padStart(2, "0")} · {r.topic.toUpperCase()}
                  </span>
                  {r.stat && (
                    <div className="mt-3">
                      <div className="text-[clamp(2rem,5vw,2.8rem)] font-black leading-none" style={{ color: "#C9981F" }}>
                        {r.stat}
                      </div>
                      <div className="mt-1.5 text-[12px] font-semibold leading-5" style={{ color: MUTED }}>
                        {r.statLabel}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-[21px] font-black leading-snug" style={{ color: INK }}>
                    {r.headline}
                  </h2>

                  {/* What the source says */}
                  <p className="mt-3 text-[15px] leading-7" style={{ color: BODY }}>
                    {r.finding}
                  </p>

                  {/* Citation — always visible, always linked */}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-start gap-1.5 rounded-xl px-3 py-2 text-[13px] leading-6 transition-colors hover:bg-white"
                    style={{ background: "rgba(27,58,122,0.05)", color: MUTED }}
                  >
                    <span>
                      <strong style={{ color: NAVY }}>{r.authors}</strong> ({r.year}). {r.source}.
                    </span>
                    <ExternalLink size={13} className="mt-1 shrink-0" />
                  </a>

                  {/* Our reading of it — visually separated so it can never be mistaken
                      for something the researchers said. */}
                  <div
                    className="mt-5 rounded-2xl p-4"
                    style={{ background: "rgba(201,152,31,0.09)", borderLeft: "3px solid #C9981F" }}
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "#8a6a12" }}>
                      What we take from it — our reading, not theirs
                    </div>
                    <p className="mt-1.5 text-[14.5px] leading-7" style={{ color: BODY }}>
                      {r.soWhat}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Evidence -> what we built */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <Wrench size={14} /> What we built in response
            </span>
            <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.2rem)] font-black leading-tight" style={{ color: INK }}>
              Each finding, and the thing it made us build
            </h2>
            <p className="mt-3 text-[15.5px] leading-7" style={{ color: MUTED }}>
              So you can check the claim rather than take our word for it.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl" style={{ border: "1px solid rgba(27,58,122,0.1)" }}>
            {RESEARCH_RESPONSE.map((row, i) => (
              <div
                key={row.evidence}
                className="grid gap-3 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6"
                style={{
                  background: i % 2 ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.93)",
                  borderTop: i ? "1px solid rgba(27,58,122,0.07)" : undefined,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[9px] h-2 w-2 shrink-0 rounded-full"
                    style={{ background: "#9AA7C2" }}
                  />
                  <span className="text-[14.5px] leading-6" style={{ color: MUTED }}>
                    {row.evidence}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[9px] h-2 w-2 shrink-0 rounded-full"
                    style={{ background: "#C9981F", boxShadow: "0 0 0 4px rgba(201,152,31,0.14)" }}
                  />
                  <span className="text-[14.5px] font-semibold leading-6" style={{ color: NAVY }}>
                    {row.built}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The calculators — ours, and described as what they actually are */}
        <section className="mt-16">
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{ background: "linear-gradient(160deg,#ffffff,#F3F8FF)", border: "1px solid rgba(201,152,31,0.35)" }}
          >
            <span className="eyebrow">Built by us · coming to the app</span>
            <h2 className="mt-3 text-[clamp(1.4rem,3vw,1.9rem)] font-black leading-tight" style={{ color: INK }}>
              13 navigation calculators, already built
            </h2>
            <p className="mt-3 text-[15px] leading-7" style={{ color: BODY }}>
              Wind triangle and groundspeed, runway wind components, compass-to-true (CDMVT), climb and
              descent, nav log, critical point and point of no return, V-speeds, mass and balance, time
              and turns, radio nav, route geometry, converters — worked live, with the vector diagram
              redrawn as you change the numbers, and a printable worksheet at the end. Not a formula
              sheet: you watch the drift angle move as the wind changes.
            </p>
            <p className="mt-3 text-[15px] leading-7" style={{ color: BODY }}>
              We built them in-house, on the same computations the flight-planning engine runs, so a
              cadet can practise by hand and cross-check against the engine that files the plan. They
              are <strong style={{ color: NAVY }}>coming to the EARNWINGS app</strong> — the weight
              &amp; balance and centre-of-gravity calculator, with its envelope chart, is in the app
              already.
            </p>
            <p className="mt-4 text-[13px] leading-6" style={{ color: MUTED }}>
              Built by Cephionix, which also builds{" "}
              <a
                href={NEURALWINGS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
                style={{ color: "#2E6BE5" }}
              >
                Neural Wings
              </a>{" "}
              for flying training organisations.
            </p>

            {/* The calculators themselves, named — concrete beats adjectives, and
                each name is a term a student pilot actually searches for. */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Wind & heading",
                "Altitude & speed",
                "Climb & descent",
                "Route & geometry",
                "Nav log",
                "CP / PNR",
                "Weather · fuel · hold",
                "Radio nav",
                "Mass & balance",
                "Time & turns",
                "V-speeds",
                "Converter",
                "CDMVT",
              ].map((c) => (
                <span
                  key={c}
                  className="pill"
                  style={{ background: "rgba(27,58,122,0.06)", color: NAVY, border: "1px solid rgba(27,58,122,0.1)" }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-black leading-tight text-white">
            Built on the evidence, not on adjectives
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            The first {FOUNDER_SEATS} to join become Founding Cadets — the full app free for a week.
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
