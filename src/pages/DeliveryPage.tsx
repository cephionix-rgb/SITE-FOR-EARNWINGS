import type { ReactNode } from "react";
import { Zap, Smartphone, Mail, Video } from "lucide-react";
import { LegalShell, Section, Callout, NoteCard, Bullets } from "../components/Legal";
import { Link } from "../lib/router";
import { SUPPORT_EMAIL } from "../lib/siteConfig";

const Strong = ({ children }: { children: ReactNode }) => (
  <strong style={{ color: "#0D1629" }}>{children}</strong>
);

// Shipping and delivery policy. EarnWings sells only digital access, nothing physical;
// payment gateways (Razorpay) still ask for a public delivery policy.
export function DeliveryPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Shipping and delivery policy"
      intro="Everything EarnWings sells is digital. Nothing is shipped by post."
      updated="20 November 2026"
    >
      <Callout icon={Zap} title="Instant digital delivery">
        <p>
          When your payment succeeds, the plan, add-on or Fuel you bought is added to your
          EarnWings account <Strong>straight away</Strong>, usually within a minute. There is
          no shipping and no shipping charge.
        </p>
      </Callout>

      <Section title="How you receive it" id="how">
        <NoteCard icon={Smartphone}>
          <Bullets
            items={[
              "Sign in to the EarnWings app (iPhone, iPad, Android, Mac or Windows) or the website with the same account you paid from. What you bought is unlocked there.",
              "Study plans give access for the number of days shown when you buy, counted from the moment of payment.",
              "Fuel is added to your Fuel balance at once and does not expire.",
              "A payment receipt is emailed to you and is also on your account page.",
            ]}
          />
        </NoteCard>
      </Section>

      <Section title="Live classes" id="live">
        <NoteCard icon={Video}>
          <p>
            For plans with a seat in a live batch, the class schedule and joining links are
            shown in the app and emailed before the batch starts.
          </p>
        </NoteCard>
      </Section>

      <Section title="If something has not arrived" id="help">
        <NoteCard icon={Mail}>
          <p>
            If your purchase is not showing within 30 minutes of a successful payment, write to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>{SUPPORT_EMAIL}</a>{" "}
            with your payment receipt. We fix it within 24 hours. Refunds are covered by our{" "}
            <Link to="/refunds" className="font-semibold underline" style={{ color: "#2E6BE5" }}>refund and cancellation policy</Link>.
          </p>
        </NoteCard>
      </Section>
    </LegalShell>
  );
}
