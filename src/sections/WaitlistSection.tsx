import { Check } from "lucide-react";
import { Waitlist } from "../components/Waitlist";
import { SectionHead } from "../components/SectionHead";
import { useReveal } from "../lib/reveal";
import { FOUNDER_SEATS } from "../lib/siteConfig";

/**
 * Join: what a founding cadet gets, spelled out, beside the form.
 * Content depth is deliberately capped (2 chapters a subject) and the extras are
 * metered in fives; acing the Cadet to Commander quiz below doubles each five.
 * The lists mirror the perks the waitlist Apps Script sends in its email.
 */
const UNLOCKS = [
  "The full app, free for 7 days",
  "First 2 chapters of every subject, with their MCQ banks",
  "1 timed sample paper per subject",
];
const CREDITS = ["RT scenarios", "Weight and balance", "METAR challenges", "Ask-Captain doubts"];
const FOREVER = ["Commander badge", "Priority access to Captain Aezon", "Lifetime founding member status", "Early access to new modules", "Founder certificate"];

export function WaitlistSection() {
  const lists = useReveal<HTMLDivElement>();
  return (
    <section id="waitlist" className="band">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <SectionHead
            title={<>Join the first {FOUNDER_SEATS}. <span style={{ color: "#6B7896" }}>Fly in first.</span></>}
            lede="Founding cadets get early access and a real taste of every course. Here is exactly what unlocks."
          />
          <div ref={lists} className="reveal mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <PerkList title="Unlocked to explore" items={UNLOCKS} />
            <PerkList title="5 of each to spend" items={CREDITS} />
            <PerkList title="Yours for good" items={FOREVER} />
          </div>
        </div>
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}

function PerkList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono-data text-[11.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--gold-ink)" }}>{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((t) => (
          <li key={t} className="grid grid-cols-[20px_1fr] gap-2.5 text-[0.92rem] leading-snug" style={{ color: "var(--ink-2)" }}>
            <Check size={16} strokeWidth={2.5} className="mt-[3px]" style={{ color: "var(--navy)" }} aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
