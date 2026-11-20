import { ArrowRight, Plus } from "lucide-react";
import { Link } from "../lib/router";
import { FAQ_FEATURED } from "../content/faq";
import { SectionHead } from "../components/SectionHead";
import { useReveal } from "../lib/reveal";

/** Homepage: an honest plans teaser (no invented prices: plans and prices are
 *  served live on /account) beside the most-asked questions. */
const STEPS = [
  { t: "Start free", b: "Founding cadets get the full app for a week, plus a starter set of chapters, questions and practice in every subject." },
  { t: "Pick a plan", b: "One subject, a bundle, or everything, with Fuel for the AI extras." },
  { t: "Pay on the website", b: "Not through an app store, so the price you see is the price you pay." },
];

export function PlansFaq() {
  // The pricing FAQ ("Pricing will be unveiled before launch") would contradict the
  // plans block beside it now that plans are live on /account, so it is left out here.
  const faqs = FAQ_FEATURED.filter((f) => !/cost|price/i.test(f.q)).slice(0, 5);
  const plans = useReveal<HTMLDivElement>();
  const qs = useReveal<HTMLDivElement>();
  return (
    <section id="plans" className="band">
      <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHead title={<>Start free. <span style={{ color: "#6B7896" }}>Pay for what you study.</span></>} />
          <div ref={plans} className="reveal mt-8">
            <ol className="border-t" style={{ borderColor: "var(--rule)" }}>
              {STEPS.map((s, i) => (
                <li key={s.t} className="grid grid-cols-[2.25rem_1fr] border-b py-5" style={{ borderColor: "var(--rule)" }}>
                  <span className="font-mono-data pt-0.5 text-[13px] font-semibold" style={{ color: "var(--gold-ink)" }}>{i + 1}</span>
                  <div>
                    <p className="h-sub" style={{ fontSize: "1.08rem" }}>{s.t}</p>
                    <p className="mt-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <Link to="/account" className="btn-navy">
                See plans and prices <ArrowRight size={18} />
              </Link>
              <a href="#waitlist" className="link-arrow justify-center text-[0.95rem]">
                Join as a founding cadet <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>

        <div>
          <SectionHead title="What students ask first." />
          <div ref={qs} className="reveal mt-8 border-t" style={{ borderColor: "var(--rule)" }}>
            {faqs.map((f) => (
              <details key={f.q} className="faq group border-b" style={{ borderColor: "var(--rule)" }}>
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[1rem] font-bold" style={{ color: "var(--ink)" }}>
                  {f.q}
                  <Plus size={20} className="shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--navy)" }} />
                </summary>
                <p className="pb-5 pr-8 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{f.a}</p>
              </details>
            ))}
          </div>
          <Link to="/faq" className="link-arrow mt-4 text-[0.95rem]">
            All questions <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
