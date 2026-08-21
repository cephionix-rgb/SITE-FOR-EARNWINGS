import { useEffect, type ComponentType, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CircleCheck, CircleX, Mail, LifeBuoy } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Link } from "../lib/router";
import { CONTACT_EMAIL, SUPPORT_EMAIL } from "../lib/siteConfig";

// ---------------------------------------------------------------------------
// Shared presentation for the legal pages (Terms / Privacy / Copyright).
//
// Mirrors the layout of the sibling Cephionix product at neuralwings.org/terms
// so both sites read as one company: pale gradient masthead with blurred
// colour orbs, pill eyebrow, oversized title, a gradient hairline rule, then
// generously-spaced sections built from a small kit of cards. Colours are
// EARNWINGS navy/gold rather than the Neural Wings sky/zinc.
//
// Semantic accents are deliberately NOT re-branded: red still means "you may
// not", green still means "you may". Those read faster than brand colours.
// ---------------------------------------------------------------------------

const NAVY = "#1B3A7A";
const INK = "#0D1629";
const BODY = "#41527A";
const MUTED = "#8296bf";

/** Accent ring used on hover for the "what is protected" cards. */
export type Accent = "gold" | "sky" | "navy" | "violet" | "emerald" | "rose";
const ACCENT: Record<Accent, { border: string; chipBg: string; chipFg: string }> = {
  gold: { border: "rgba(201,152,31,0.55)", chipBg: "#FFF3D6", chipFg: "#8a6a12" },
  sky: { border: "rgba(91,164,232,0.6)", chipBg: "#E4F1FD", chipFg: "#1c6cb3" },
  navy: { border: "rgba(27,58,122,0.45)", chipBg: "#E6EDFB", chipFg: "#1B3A7A" },
  violet: { border: "rgba(139,92,246,0.5)", chipBg: "#EFE9FE", chipFg: "#6d3fd4" },
  emerald: { border: "rgba(16,185,129,0.5)", chipBg: "#DFF5EC", chipFg: "#0b7a5a" },
  rose: { border: "rgba(244,63,94,0.45)", chipBg: "#FDE8EC", chipFg: "#b81d3c" },
};

type ShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
};

/** Masthead + centred 840px column + contact cards + back link. */
export function LegalShell({ eyebrow, title, intro, updated, children }: ShellProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="relative">
      <Nav solid />

      <div
        className="relative overflow-hidden pb-20 pt-28 md:pb-24 md:pt-32"
        style={{ background: "linear-gradient(180deg,#EBF3FF 0%,#FFFFFF 100%)" }}
      >
        {/* blurred colour orbs — the depth cue the Neural Wings pages use */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[600px] rounded-full"
          style={{ background: "rgba(46,107,229,0.18)", filter: "blur(120px)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full"
          style={{ background: "rgba(245,217,122,0.22)", filter: "blur(100px)" }}
        />

        <div className="relative mx-auto max-w-[840px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider"
              style={{ borderColor: "rgba(201,152,31,0.35)", background: "#FFF8E7", color: "#8a6a12" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#C9981F" }} />
              {eyebrow}
            </span>

            <h1
              className="mb-5 mt-6 text-[34px] font-extrabold leading-tight md:text-[52px]"
              style={{ color: INK }}
            >
              {title}
            </h1>
            <p className="max-w-[640px] text-[16px] leading-relaxed md:text-[17px]" style={{ color: BODY }}>
              {intro}
            </p>
            <p className="mt-4 text-[13px]" style={{ color: MUTED }}>
              Last updated: {updated}
            </p>
          </motion.div>

          <div
            className="my-10 h-px w-full"
            style={{ background: "linear-gradient(90deg,#C9981F,transparent)" }}
          />

          <div className="flex flex-col gap-10">{children}</div>

          <ContactCards />

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 text-[14px] font-semibold transition-colors hover:opacity-70"
            style={{ color: BODY }}
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/** One numbered/titled block. `id` gives it a deep-linkable anchor. */
export function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2
        className="mb-3 text-[21px] font-bold leading-snug md:text-[26px]"
        style={{ color: INK }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed" style={{ color: BODY }}>
        {children}
      </div>
    </section>
  );
}

/** Sub-heading inside a section, for long Terms clauses. */
export function Sub({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 text-[15px] font-bold" style={{ color: NAVY }}>
      {children}
    </h3>
  );
}

/** The gold ownership banner — the page's single loudest statement. */
export function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border p-6 md:p-7"
      style={{ borderColor: "rgba(201,152,31,0.45)", background: "#FFFBF0" }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "#FCEFC7", color: "#8a6a12" }}
        >
          <Icon size={20} />
        </span>
        <div>
          {title && (
            <h2 className="text-[18px] font-bold md:text-[20px]" style={{ color: INK }}>
              {title}
            </h2>
          )}
          <div className="mt-2 flex flex-col gap-3 text-[15px] leading-relaxed" style={{ color: BODY }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Neutral card — used for the enforcement clause. */
export function NoteCard({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ size?: number | string }>;
  children: ReactNode;
}) {
  return (
    <div
      className="mt-1 rounded-2xl border p-5 md:p-6"
      style={{ borderColor: "rgba(27,58,122,0.14)", background: "#F7FAFF" }}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "#E6EDFB", color: NAVY }}
        >
          <Icon size={20} />
        </span>
        <div className="flex flex-col gap-3 text-[15px] leading-relaxed" style={{ color: BODY }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Two-up grid of white cards, each with a tinted icon chip. */
export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

export function InfoCard({
  icon: Icon,
  title,
  accent = "navy",
  children,
}: {
  icon: ComponentType<{ size?: number | string }>;
  title: string;
  accent?: Accent;
  children: ReactNode;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className="group rounded-2xl border bg-white p-5 transition-all"
      style={{
        borderColor: "rgba(27,58,122,0.12)",
        boxShadow: "0 1px 2px rgba(27,58,122,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = a.border;
        e.currentTarget.style.boxShadow = "0 12px 30px -18px rgba(27,58,122,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(27,58,122,0.12)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(27,58,122,0.06)";
      }}
    >
      <span
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: a.chipBg, color: a.chipFg }}
      >
        <Icon size={17} />
      </span>
      <h3 className="text-[15px] font-bold" style={{ color: INK }}>
        {title}
      </h3>
      <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: BODY }}>
        {children}
      </p>
    </div>
  );
}

/** Red "you may not" list. */
export function DontList({ items }: { items: ReactNode[] }) {
  return (
    <div
      className="mt-1 rounded-2xl border p-5 md:p-6"
      style={{ borderColor: "rgba(244,63,94,0.22)", background: "rgba(254,242,244,0.7)" }}
    >
      <ul className="flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <CircleX size={16} className="mt-0.5 shrink-0" style={{ color: "#e11d48" }} />
            <span className="text-[15px] leading-relaxed" style={{ color: BODY }}>
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Green "you may" list. */
export function DoList({ items }: { items: ReactNode[] }) {
  return (
    <div
      className="mt-1 rounded-2xl border p-5 md:p-6"
      style={{ borderColor: "rgba(16,185,129,0.25)", background: "rgba(236,253,245,0.7)" }}
    >
      <ul className="flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <CircleCheck size={16} className="mt-0.5 shrink-0" style={{ color: "#059669" }} />
            <span className="text-[15px] leading-relaxed" style={{ color: BODY }}>
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Plain bulleted list for ordinary clauses. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "#C9981F" }}
          />
          <span className="text-[15px] leading-relaxed" style={{ color: BODY }}>
            {it}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** GENERAL / SUPPORT mail cards that close every legal page. */
function ContactCards() {
  const cards = [
    { label: "General", email: CONTACT_EMAIL, Icon: Mail, hover: "rgba(46,107,229,0.5)" },
    { label: "Support", email: SUPPORT_EMAIL, Icon: LifeBuoy, hover: "rgba(201,152,31,0.6)" },
  ];
  return (
    <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map(({ label, email, Icon, hover }) => (
        <a
          key={label}
          href={`mailto:${email}`}
          className="flex items-center gap-3 rounded-2xl border bg-white p-4 transition-all"
          style={{ borderColor: "rgba(27,58,122,0.12)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = hover;
            e.currentTarget.style.boxShadow = "0 12px 30px -18px rgba(27,58,122,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(27,58,122,0.12)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "#E6EDFB", color: NAVY }}
          >
            <Icon size={16} />
          </span>
          <span className="min-w-0">
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: MUTED }}
            >
              {label}
            </span>
            <span className="block truncate text-[14px] font-semibold" style={{ color: NAVY }}>
              {email}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
