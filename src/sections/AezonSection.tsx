import { ArrowRight, BookOpenCheck, Shapes, ShieldCheck } from "lucide-react";
import { PhoneFrame } from "../components/DeviceFrame";
import { SectionHead } from "../components/SectionHead";
import { AezonPortrait } from "../components/AezonPortrait";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";

/**
 * Captain Aezon, the app's ground instructor: his portrait (the same art the app uses
 * for his avatar) and a real capture of an answer with its inline interactive figure.
 */
const POINTS = [
  { icon: BookOpenCheck, title: "Answers from the course", body: "He answers from the EarnWings notes, shows the source, and says so plainly when the material does not cover it." },
  { icon: Shapes, title: "A live figure in the answer", body: "Ask how the altimeter or the ILS works and the interactive figure opens right in the answer, set to your question's numbers." },
  { icon: ShieldCheck, title: "Two modes", body: "Aezon for a quick doubt. Aezon + for a deeper, structured answer with the working shown." },
];

export function AezonSection() {
  const art = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLUListElement>();
  return (
    <section id="captain-aezon" className="band overflow-hidden pt-0">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div className="lg:order-2">
          <div className="flex items-center gap-4">
            <AezonPortrait size={84} />
            <div>
              <p className="font-mono-data text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--gold-ink)" }}>Your ground instructor</p>
              <p className="h-sub mt-1" style={{ fontSize: "1.25rem" }}>Captain Aezon</p>
            </div>
          </div>
          <SectionHead
            className="mt-6"
            title={<>Ask Aezon. <span style={{ color: "#6B7896" }}>Any doubt, any hour.</span></>}
            lede="Stuck on a chapter at midnight? Ask Captain Aezon. He explains, quizzes you and draws the figure, and he never bluffs."
          />
          <ul ref={list} className="reveal mt-8 border-t" style={{ borderColor: "var(--rule)" }}>
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="grid grid-cols-[28px_1fr] gap-x-4 border-b py-5" style={{ borderColor: "var(--rule)" }}>
                <Icon size={20} strokeWidth={2} className="mt-0.5" style={{ color: "var(--gold-ink)" }} aria-hidden />
                <div>
                  <p className="h-sub" style={{ fontSize: "1.08rem" }}>{title}</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/features#captain" className="link-arrow mt-6 text-[0.95rem]">
            More about Captain Aezon <ArrowRight size={17} />
          </Link>
        </div>

        <div ref={art} className="reveal relative flex justify-center lg:order-1">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,217,122,0.32) 0%, rgba(245,217,122,0) 62%)" }} />
          <PhoneFrame width={262} className="relative" src="/screens/app-captain.webp" alt="Ask Captain Aezon in the EarnWings app: his portrait, the Doubt and Aezon + modes, and suggested questions" />
        </div>
      </div>
    </section>
  );
}
