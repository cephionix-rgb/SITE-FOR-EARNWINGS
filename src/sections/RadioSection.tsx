import { Mic, Plane, MessageSquareText } from "lucide-react";
import { PhoneFrame } from "../components/DeviceFrame";
import { SectionHead } from "../components/SectionHead";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";

/**
 * RT(A) practice: the 3D airport capture (Delhi, from the app's RT flight mode)
 * with the phone RT Practice screen laid over its corner. Both are real
 * captures from the app; nothing is mocked up.
 */
const POINTS = [
  { icon: Mic, title: "Say it out loud", body: "Hold to transmit, make the call, and see exactly what your read-back missed." },
  { icon: MessageSquareText, title: "Aezon in the right seat", body: "Practise with Captain Aezon alongside you on every call." },
  { icon: Plane, title: "8 real airports", body: "Delhi, Mumbai, Chennai, Bengaluru, Hyderabad (Begumpet), Jaipur, Chandigarh and Leh, built to real scale in 3D, with live aircraft on them." },
];

export function RadioSection() {
  const art = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLUListElement>();
  return (
    <section id="radio" className="band overflow-hidden">
      <div className="wrap grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="lg:order-2">
          <SectionHead
            title={<>Make the call <span style={{ color: "#6B7896" }}>before it counts.</span></>}
            lede="Practise RT(A) by voice, from pushback to landing, against controllers that answer back."
          />
          <ul ref={list} className="reveal mt-8 hidden border-t lg:block" style={{ borderColor: "var(--rule)" }}>
            {POINTS.map((p) => (
              <Point key={p.title} {...p} />
            ))}
          </ul>
        </div>

        <div ref={art} className="reveal relative -mx-5 sm:mx-0 lg:order-1">
          <figure className="m-0">
            <div className="relative">
              <div className="overflow-hidden sm:rounded-[24px]" style={{ boxShadow: "0 40px 80px -46px rgba(13,36,80,0.8), 0 0 0 1px rgba(11,26,51,0.08)" }}>
                <img
                  src="/screens/app/airport-delhi-3d.webp"
                  alt="Delhi airport in the EarnWings 3D view, with labelled aircraft on stands and the RT call panel open"
                  width={1280}
                  height={722}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/3] w-full object-cover object-[30%_40%] sm:aspect-auto"
                />
              </div>
              <div className="absolute -bottom-14 right-[1.25rem] sm:-bottom-16 sm:right-8 lg:-right-8">
                <PhoneFrame width={128} className="sm:hidden" src="/screens/app/rt-practice.webp" alt="RT Practice in the EarnWings app: an approach call to Delhi Arrival" />
                <PhoneFrame width={196} className="hidden sm:block" src="/screens/app/rt-practice.webp" alt="" />
              </div>
            </div>
          </figure>
        </div>

        <ul className="mt-6 border-t lg:hidden" style={{ borderColor: "var(--rule)" }}>
          {POINTS.map((p) => (
            <Point key={p.title} {...p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Point({ icon: Icon, title, body }: (typeof POINTS)[number]) {
  return (
    <li className="grid grid-cols-[28px_1fr] gap-x-4 border-b py-5" style={{ borderColor: "var(--rule)" }}>
      <Icon size={20} strokeWidth={2} className="mt-0.5" style={{ color: "var(--gold-ink)" }} aria-hidden />
      <div>
        <p className="h-sub" style={{ fontSize: "1.08rem" }}>{title}</p>
        <p className="mt-1 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)" }}>{body}</p>
      </div>
    </li>
  );
}
