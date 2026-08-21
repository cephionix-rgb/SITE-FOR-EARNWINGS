import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookMarked, ChevronLeft, Plane, Search } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CloudBackground } from "../components/CloudBackground";
import { Link } from "../lib/router";
import { GLOSSARY, GLOSSARY_CATEGORIES, GLOSSARY_H1, GLOSSARY_INTRO } from "../content/glossary";
import { CONTACT_EMAIL, FOUNDER_SEATS } from "../lib/siteConfig";

const INK = "#0D1629";
const NAVY = "#1B3A7A";
const BODY = "#41527A";
const MUTED = "#4A5A78";

export function GlossaryPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (g) =>
        (cat === "All" || g.category === cat) &&
        (!needle ||
          g.term.toLowerCase().includes(needle) ||
          (g.full || "").toLowerCase().includes(needle) ||
          g.def.toLowerCase().includes(needle)),
    );
  }, [q, cat]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        GLOSSARY_CATEGORIES.map((c) => [c, GLOSSARY.filter((g) => g.category === c).length]),
      ),
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
              <BookMarked size={14} /> {GLOSSARY.length} terms, plainly explained
            </span>
            <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.4rem)] font-black leading-tight" style={{ color: INK }}>
              {GLOSSARY_H1[0]}
              <span className="text-gradient-gold">{GLOSSARY_H1[1]}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8" style={{ color: "#40506e" }}>
              {GLOSSARY_INTRO}
            </p>
          </motion.div>

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
              placeholder="Search a term — FTO, METAR, QNH…"
              aria-label="Search the glossary"
              className="w-full rounded-full border py-3 pl-11 pr-4 outline-none focus:ring-2"
              style={{ background: "rgba(255,255,255,0.9)", borderColor: "rgba(27,58,122,0.14)", color: NAVY }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-20 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["All", ...GLOSSARY_CATEGORIES].map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={active}
                className="rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors"
                style={{
                  background: active ? NAVY : "rgba(255,255,255,0.8)",
                  color: active ? "#fff" : NAVY,
                  border: `1px solid ${active ? NAVY : "rgba(27,58,122,0.12)"}`,
                }}
              >
                {c} <span style={{ opacity: 0.6 }}>{c === "All" ? GLOSSARY.length : counts[c]}</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="py-14 text-center text-[15px]" style={{ color: MUTED }}>
            No term matches “{q}”. Think it belongs here? Tell us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : (
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {shown.map((g, i) => (
              <motion.div
                key={g.term}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: (i % 2) * 0.04 }}
                id={g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="scroll-mt-24 rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(27,58,122,0.08)",
                  boxShadow: "0 20px 40px -34px rgba(27,58,122,0.5)",
                }}
              >
                <dt>
                  <span className="text-[17px] font-black" style={{ color: NAVY }}>
                    {g.term}
                  </span>
                  {g.full && (
                    <span className="ml-2 text-[13px] font-semibold" style={{ color: "#886611" }}>
                      {g.full}
                    </span>
                  )}
                  <span
                    className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "#9aa9c4" }}
                  >
                    {g.category}
                  </span>
                </dt>
                <dd className="mt-2 text-[14.5px] leading-7" style={{ color: BODY }}>
                  {g.def}
                </dd>
              </motion.div>
            ))}
          </dl>
        )}

        <section
          className="mt-14 overflow-hidden rounded-3xl px-6 py-12 text-center"
          style={{ background: "linear-gradient(150deg,#0f2450,#0a1836)" }}
        >
          <h2 className="text-[clamp(1.6rem,3.4vw,2.2rem)] font-black leading-tight text-white">
            Every one of these is inside the app
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-7" style={{ color: "#93A9D6" }}>
            Not as a glossary — as chapters, question banks, real flight plans and live weather. The
            first {FOUNDER_SEATS} to join become Founding Cadets.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/#waitlist" className="btn-gold">
              <Plane size={18} /> Reserve My Captain Seat
            </Link>
            <Link
              to="/faq"
              className="rounded-full px-5 py-3 text-sm font-bold text-white"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Read the FAQ
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
