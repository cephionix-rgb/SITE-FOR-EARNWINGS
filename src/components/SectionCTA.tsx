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
  flightdeck: { label: "Get the full syllabus", sub: "Every DGCA subject in one place. Reserve your seat." },
  cockpit: { label: "Put every tool one tap away", sub: "Reserve your founding-cadet seat in about 20 seconds." },
  play: { label: "Keep these tools for exam day", sub: "Founding cadets keep them all the way to launch." },
  journey: { label: "Claim a founding seat", sub: "Start your climb from Cadet today." },
  app: { label: "Get early access", sub: "Be first in the day we open the doors." },
  proof: { label: "Reserve My Captain Seat", sub: "Join the founding cohort before launch." },
  founder: { label: "Reserve My Captain Seat", sub: "Join before public launch to lock these in." },
  default: { label: "Reserve My Captain Seat", sub: "Join the founding cohort." },
};

export function SectionCTA({ variant = "default" }: { variant?: Variant }) {
  const c = COPY[variant];
  return (
    <div className="mt-12 mb-16 flex flex-col items-center">
      <a
        href="#waitlist"
        onClick={() => track("section_cta_click", { section: variant })}
        className="btn-gold"
        style={{ fontSize: "1.05rem", padding: "0.95rem 1.9rem" }}
      >
        <Plane size={18} /> {c.label}
      </a>
      <p className="mt-2.5 text-[13px]" style={{ color: "#4A5A78" }}>
        {c.sub}
      </p>
    </div>
  );
}
