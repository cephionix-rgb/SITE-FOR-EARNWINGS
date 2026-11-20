import { PhoneFrame } from "../components/DeviceFrame";
import { SectionHead } from "../components/SectionHead";
import { Link } from "../lib/router";
import { useReveal } from "../lib/reveal";

/**
 * The A320 cockpit trainer. Desktop: the wide flight-deck capture with the
 * procedures panel open. Phone: the phone capture of the same trainer (the wide
 * shot is unreadable at 390 px). Counts are from the trainer's lesson and drill
 * lists.
 */
const FACTS = [
  { n: "21", l: "guided lessons" },
  { n: "31", l: "emergency drills" },
];

export function CockpitSection() {
  const art = useReveal<HTMLDivElement>();
  return (
    <section id="cockpit" className="band">
      <div className="wrap">
        <SectionHead
          title={<>Learn the A320 flight deck <span style={{ color: "#6B7896" }}>by working it.</span></>}
          lede="Every pushbutton, switch and lever on the panels is live. Pick a procedure and the checklist follows you, then grades the order, the missed items and the time. System pages explain how each one works."
        />

        <dl className="mt-10 grid max-w-md grid-cols-2 gap-4 border-t pt-6" style={{ borderColor: "var(--rule)" }}>
          {FACTS.map((f) => (
            <div key={f.l}>
              <dt className="sr-only">{f.l}</dt>
              <dd className="font-display text-[2.1rem] font-extrabold leading-none tracking-tight sm:text-[2.8rem]" style={{ color: "var(--ink)" }}>{f.n}</dd>
              <dd className="mt-2 text-[0.8rem] font-medium leading-snug sm:text-[0.88rem]" style={{ color: "var(--ink-2)" }}>{f.l}</dd>
            </div>
          ))}
        </dl>

        <div ref={art} className="reveal mt-12">
          <figure className="m-0">
            <div className="overflow-hidden rounded-[18px] md:rounded-[24px]" style={{ boxShadow: "0 40px 80px -46px rgba(13,36,80,0.8), 0 0 0 1px rgba(11,26,51,0.08)" }}>
              <img
                src="/screens/app/a320-cockpit-1600.webp"
                srcSet="/screens/app/a320-cockpit-960.webp 960w, /screens/app/a320-cockpit-1600.webp 1600w, /screens/app/a320-cockpit-2560.webp 2560w, /screens/app/a320-cockpit-3840.webp 3840w"
                sizes="(min-width: 1280px) 1200px, 100vw"
                alt="The EarnWings A320 flight deck at Delhi from the captain's seat: glareshield, main panel, pedestal and the apron through the windscreen"
                width={3840}
                height={2160}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </figure>
          <figure className="mt-8 m-0 flex flex-col items-center md:hidden">
            <PhoneFrame width={250} src="/screens/app/a320-trainer.webp" alt="The A320 Cockpit Trainer on a phone, with the procedures panel" />
          </figure>
          <p className="mt-6 text-center text-[0.95rem] font-semibold md:text-left" style={{ color: "var(--ink)" }}>
            More cockpits are on their way.
          </p>
          <p className="small-print mt-2 text-center md:text-left">
            Training use only, not for operational use.
          </p>
        </div>
      </div>
    </section>
  );
}
