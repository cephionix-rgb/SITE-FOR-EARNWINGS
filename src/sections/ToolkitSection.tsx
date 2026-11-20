import { Bot, Flame, Users } from "lucide-react";
import { SectionHead } from "../components/SectionHead";
import { useReveal } from "../lib/reveal";
import { AezonPortrait } from "../components/AezonPortrait";

/** Everyday help, as a quiet ruled list rather than a card grid. */
const TOOLS = [
  { icon: Bot, title: "Ask Captain Aezon", body: "Stuck on a chapter? Ask Aezon. He is trained on the full DGCA syllabus and real-world flight scenarios.", soon: false, aezon: true },
  { icon: Flame, title: "Widgets and streaks", body: "Home-screen widgets and a daily streak keep a few minutes of study in every day.", soon: false, aezon: false },
  { icon: Users, title: "Live classes", body: "Ground classes taught live by instructors, inside the app.", soon: true, aezon: false },
];

export function ToolkitSection() {
  const ref = useReveal<HTMLUListElement>();
  return (
    <section id="tools" className="band pt-0">
      <div className="wrap">
        <SectionHead title={<>Plus the help <span style={{ color: "#6B7896" }}>between sessions.</span></>} />
        <ul ref={ref} className="reveal mt-10 grid grid-cols-1 border-t md:grid-cols-3 md:gap-x-10" style={{ borderColor: "var(--rule)" }}>
          {TOOLS.map(({ icon: Icon, title, body, soon, aezon }) => (
            <li key={title} className="grid grid-cols-[28px_1fr] gap-x-4 border-b py-6" style={{ borderColor: "var(--rule)" }}>
              {aezon ? (
                <AezonPortrait size={28} ring={false} square alt="" />
              ) : (
                <Icon size={21} strokeWidth={2} className="mt-0.5" style={{ color: "var(--navy)" }} aria-hidden />
              )}
              <div>
                <p className="h-sub flex flex-wrap items-center gap-x-3 gap-y-1" style={{ fontSize: "1.08rem" }}>
                  {title}
                  {soon && (
                    <span className="font-mono-data rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ background: "rgba(201,152,31,0.14)", color: "var(--gold-ink)" }}>
                      Coming soon
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
