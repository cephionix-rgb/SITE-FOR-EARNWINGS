import { Plane } from "lucide-react";
import { track } from "../lib/track";

/**
 * Compact end-of-section CTA (Task 7). The `variant` only changes the label
 * sub-line so it never reads as the same button twice. Design tokens unchanged
 * (btn-gold). Links to the waitlist and fires a tracked event.
 */
type Variant =
  | "flightdeck"
  | "cockpit"
  | "play"
  | "journey"
  | "app"
  | "proof"
  | "founder"
  | "default";

const COPY: Record<Variant, { label: string; sub: string }> = {
  flightdeck: { label: "Reserve My Captain Seat", sub: "Get the entire DGCA syllabus in one place." },
  cockpit: { label: "Reserve My Captain Seat", sub: "Put every study tool one tap away." },
  play: { label: "Reserve My Captain Seat", sub: "Keep these tools for your real exam prep." },
  journey: { label: "Reserve My Captain Seat", sub: "Start climbing from Cadet today." },
  app: { label: "Reserve My Captain Seat", sub: "Carry your whole cockpit everywhere." },
  proof: { label: "Reserve My Captain Seat", sub: "Join the founding cohort before launch." },
  founder: { label: "Reserve My Captain Seat", sub: "Claim these founding benefits before they close." },
  default: { label: "Reserve My Captain Seat", sub: "Join the founding cohort." },
};

export function SectionCTA({ variant = "default" }: { variant?: Variant }) {
  const c = COPY[variant];
  return (
    <div className="mt-12 flex flex-col items-center">
      <a
        href="#waitlist"
        onClick={() => track("section_cta_click", { section: variant })}
        className="btn-gold"
        style={{ fontSize: "1.05rem", padding: "0.95rem 1.9rem" }}
      >
        <Plane size={18} /> {c.label}
      </a>
      <p className="mt-2.5 text-[13px]" style={{ color: "#5F7499" }}>
        {c.sub}
      </p>
    </div>
  );
}
