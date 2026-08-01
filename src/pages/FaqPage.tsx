import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Plane, Search } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { Link } from "../lib/router";
import { FAQ, FAQ_CATEGORIES } from "../content/faq";
import { CONTACT_EMAIL, FOUNDER_SEATS } from "../lib/siteConfig";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const BODY = "#41527A";
const MUTED = "#4A5A78";

export function FaqPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQ.filter(
      (f) =>
        (cat === "All" || f.category === cat) &&
        (!needle || f.q.toLowerCase().includes(needle) || f.a.toLowerCase().includes(needle)),
    );
  }, [q, cat]);

  const counts = useMemo(
    () =>
      Object.fromEntries(FAQ_CATEGORIES.map((c) => [c, FAQ.filter((f) => f.category === c).length])),
    [],
  );

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
              <MessageSquareQuote size={14} /> Questions, answered
            </span>
            <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.4rem)] font-black leading-tight" style={{ color: INK }}>
              Everything you want to know about{" "}
              <span className="text-gradient-gold">EARNWINGS</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              {FAQ.length} straight answers about the ground classes, the exams, the AI Captain, the
              flying tools and how to get in. Where something is not decided yet, we say so instead of
              guessing.
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-md">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: MUTED }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="Search the answers…"
              aria-label="Search the FAQ"
              className="w-full rounded-full border py-3 pl-11 pr-4 outline-none focus:ring-2"
              style={{ background: "rgba(255,255,255,0.9)", borderColor: "rgba(27,58,122,0.14)", color: NAVY }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 sm:px-6">
        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["All", ...FAQ_CATEGORIES].map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={active}
                className="rounded-full px-4 py-2 text-[13px] font-bold transition-colors"
                style={{
                  background: active ? NAVY : "rgba(255,255,255,0.8)",
                  color: active ? "#fff" : NAVY,
                  border: `1px solid ${active ? NAVY : "rgba(27,58,122,0.12)"}`,
                }}
              >
                {c} <span style={{ opacity: 0.6 }}>{c === "All" ? FAQ.length : counts[c]}</span>
              </button>
            );
          })}
        </div>

        {/* Answers */}
        <div className="mt-8">
          {shown.length === 0 ? (
            <p className="py-12 text-center text-[15px]" style={{ color: MUTED }}>
              Nothing matches “{q}”. Ask us directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(27,58,122,0.1)" }}>
              {shown.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary
                    className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-[16.5px] font-bold"
                    style={{ color: NAVY }}
                  >
                    <span>{item.q}</span>
                    <ChevronRight
                      size={18}
                      className="mt-1 shrink-0 transition-transform group-open:rotate-90"
                      style={{ color: "#886611" }}
                    />
                  </summary>
                  <p className="mt-2.5 text-[15px] leading-7" style={{ color: BODY }}>
                    {item.a}
                  </p>
                  <span
                    className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#9a7415" }}
                  >
                    {item.category}
                  </span>
                </details>
              ))}
            </div>
          )}
        </div>

        {/* Still stuck */}
        <section
          className="mt-14 rounded-3xl px-6 py-8 text-center"
          style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(27,58,122,0.1)" }}
        >
          <h2 className="text-xl font-black" style={{ color: NAVY }}>
            Still not answered?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-7" style={{ color: MUTED }}>
            Write to us and a person will reply — we would rather answer properly than leave you
            guessing.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-ghost mt-5 text-sm">
            {CONTACT_EMAIL}
          </a>
        </section>

        {/* CTA */}
        <section
          className="mt-8 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-black leading-tight text-white">
            Answers done. Ready for the cockpit?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            The first {FOUNDER_SEATS} to join become Founding Cadets — the full app free for a week.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold">
              <Plane size={18} /> Reserve My Captain Seat
            </Link>
            <Link
              to="/aviation-glossary"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Aviation glossary
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
