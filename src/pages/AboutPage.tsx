import { motion } from "motion/react";
import { PageShell } from "../components/PageShell";
import { Link } from "../lib/router";
import { FEATURES, STATS } from "../lib/data";

export function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title="Built by pilots-in-training, for pilots-in-training"
      subtitle="EARNWINGS is the all-in-one training cockpit for the next generation of Indian aviators — where ground school, flight planning, radio telephony and DGCA exam prep finally live in one place."
    >
      {/* Mission */}
      <section>
        <h2 className="text-2xl font-bold" style={{ color: "#1B3A7A" }}>
          The mission
        </h2>
        <p className="mt-4 text-[17px] leading-8" style={{ color: "#41527A" }}>
          Becoming a commercial pilot in India means juggling five dense DGCA
          subjects, thousands of practice questions, real flight planning over
          live airways, radio-telephony fluency and a mountain of paperwork —
          usually across a dozen disconnected books, apps and coaching centres.
        </p>
        <p className="mt-4 text-[17px] leading-8" style={{ color: "#41527A" }}>
          We're building EARNWINGS so an aspiring pilot can open one app and{" "}
          <strong style={{ color: "#1B3A7A" }}>
            learn, plan, practise and track their whole journey
          </strong>{" "}
          — grounded in real aviation data, guided by an AI captain that never
          bluffs, and turned into a climb you actually want to make.
        </p>
      </section>

      {/* Stats */}
      <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="card-soft px-4 py-5 text-center"
          >
            <div
              className="text-3xl font-extrabold"
              style={{ color: "#C9981F" }}
            >
              {s.value}
            </div>
            <div
              className="mt-1 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#4A5A78" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* Pillars */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold" style={{ color: "#1B3A7A" }}>
          What's inside the cockpit
        </h2>
        <div className="mt-6 space-y-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-soft flex gap-4 p-5"
            >
              <span
                className="mt-1 h-10 w-1.5 shrink-0 rounded-full"
                style={{ background: f.accent }}
              />
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#1B3A7A" }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-1 text-[15px] leading-7"
                  style={{ color: "#41527A" }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold" style={{ color: "#1B3A7A" }}>
          What we believe
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Real, not simulated",
              body: "Real ATS airways, real METARs, real DGCA marking. If it's in the app, it's grounded in genuine aviation data.",
            },
            {
              title: "Never bluffs",
              body: "Our AI Captain answers from your own notes and cites its source — it says 'I don't know' rather than inventing.",
            },
            {
              title: "Made in India",
              body: "Purpose-built for DGCA CPL & ATPL aspirants, tuned to the exams, airspace and paperwork you actually face.",
            },
          ].map((v) => (
            <div key={v.title} className="card-soft p-5">
              <h3 className="font-bold" style={{ color: "#1B3A7A" }}>
                {v.title}
              </h3>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "#41527A" }}
              >
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-3xl px-6 py-10 text-center" style={{ background: "linear-gradient(135deg,#EAF2FF,#DCEBFF)" }}>
        <h2 className="text-2xl font-bold" style={{ color: "#1B3A7A" }}>
          Be one of the first to earn your wings
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#41527A" }}>
          We're onboarding founding cadets in small batches. Join the waitlist to
          claim your seat and founder perks.
        </p>
        <Link to="/#waitlist" className="btn-gold mt-6">
          Reserve My Captain Seat
        </Link>
      </section>
    </PageShell>
  );
}
