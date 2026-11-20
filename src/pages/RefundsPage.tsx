import type { ReactNode } from "react";
import { RotateCcw, CreditCard, Fuel, Smartphone, Clock, Users, Gavel, Mail as MailIcon } from "lucide-react";
import { LegalShell, Section, Callout, NoteCard, CardGrid, InfoCard, Bullets } from "../components/Legal";
import { Link } from "../lib/router";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";

const Strong = ({ children }: { children: ReactNode }) => (
  <strong style={{ color: "#0D1629" }}>{children}</strong>
);

const A = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {children}
  </Link>
);

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {children}
  </a>
);

const Mail = ({ subject }: { subject?: string }) => (
  <a
    href={`mailto:${SUPPORT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
    className="font-semibold underline"
    style={{ color: "#2E6BE5" }}
  >
    {SUPPORT_EMAIL}
  </a>
);

// The public refund and cancellation policy (Razorpay asks every merchant for one).
// Kept in step with _docs/legal/refund-and-cancellation-policy.md, section 5 of the
// Terms (src/content/legal.js) and what core does (POST /billing/refunds). If the
// 7-day window or the boost formula changes in code, change it here too.
export function RefundsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Refund and cancellation policy"
      intro="When you can get your money back for an EARNWINGS purchase, how much, and how to ask, in plain English."
      updated="19 November 2026"
    >
      <Callout icon={RotateCcw} title="Ask within 7 days of paying">
        <p>
          Plans, add-ons and Fuel boosts bought on this website or in the EARNWINGS Mac app
          (paid through <Strong>Razorpay</Strong>) can be refunded if you ask{" "}
          <Strong>within 7 days of paying</Strong>. Plans and add-ons are refunded in full; a
          Fuel boost is refunded for the part you have not used. Purchases made in the iPhone
          or Android app are refunded by Apple or Google under their own rules.
        </p>
      </Callout>

      <Section title="1. Plans and add-ons" id="plans">
        <NoteCard icon={CreditCard}>
          <p>
            Bought a plan or an add-on on this website or in the Mac app? Ask within 7 days
            of paying and we refund <Strong>the full amount</Strong>.
          </p>
          <p>
            The plan (or add-on) ends when the refund is approved, and the Fuel that came
            with the plan is taken back.
          </p>
        </NoteCard>
      </Section>

      <Section title="2. Fuel boosts" id="boosts">
        <p>
          Ask within 7 days of paying and we refund <Strong>the part you have not used</Strong>.
          Fuel you spend after buying a boost counts as spent from that boost first.
        </p>
        <NoteCard icon={Fuel}>
          <p>
            <Strong>Refund = price paid × (Fuel left from the boost ÷ Fuel in the boost)</Strong>,
            rounded down to the whole rupee. The unused Fuel is removed from your account.
          </p>
          <p>
            <Strong>Example:</Strong> you buy a ₹799 boost of 1,000 Fuel and then spend 400
            Fuel. 600 Fuel is left from the boost, so the refund is ₹799 × 600 ÷ 1,000 =
            ₹479.40, rounded down to <Strong>₹479</Strong>, and the 600 Fuel is removed.
          </p>
          <p>If all of the boost's Fuel has been spent, nothing is refundable.</p>
        </NoteCard>
      </Section>

      <Section title="3. iPhone and Android purchases" id="app-stores">
        <p>
          Purchases made in the iPhone or Android app are paid to Apple or Google, and{" "}
          <Strong>they</Strong> decide refunds under their own rules. Our 7-day rule does not
          apply to them, and we cannot refund them ourselves.
        </p>
        <CardGrid>
          <InfoCard icon={Smartphone} title="Bought on iPhone or iPad" accent="sky">
            Ask Apple at <Ext href="https://reportaproblem.apple.com">reportaproblem.apple.com</Ext>.
          </InfoCard>
          <InfoCard icon={Smartphone} title="Bought on Android" accent="emerald">
            Ask Google Play from your{" "}
            <Ext href="https://play.google.com/store/account/orderhistory">order history</Ext>.
          </InfoCard>
        </CardGrid>
      </Section>

      <Section title="4. How to ask" id="how">
        <Bullets
          items={[
            <>On this website: sign in on the <A to="/account">account</A> page and tap <Strong>Request a refund</Strong> next to the purchase.</>,
            <>In the Mac app, or the app in a browser: Settings, then <Strong>Request a refund</Strong> next to the purchase.</>,
            "You can say why if you like. It is optional and does not change the answer.",
            "We check the request and reply by email.",
          ]}
        />
      </Section>

      <Section title="5. When the money reaches you" id="timing">
        <NoteCard icon={Clock}>
          <p>
            Approved refunds go back to the card, UPI or bank account you paid with, through
            Razorpay. Banks usually take <Strong>5 to 7 working days</Strong> to show it.
          </p>
        </NoteCard>
      </Section>

      <Section title="6. If you bought another plan after this one" id="newer-plan">
        <NoteCard icon={Users}>
          <p>
            We cannot end one plan without touching the newer one, so a person handles these
            requests. Write to <Mail subject="Refund request" /> with the invoice number.
          </p>
        </NoteCard>
      </Section>

      <Section title="7. After 7 days" id="after">
        <NoteCard icon={Gavel}>
          <p>
            After 7 days, except where the law requires otherwise, payments are not
            refundable. Nothing in this policy limits a right you have under Indian consumer
            law. See also section 5 of our <A to="/terms#payments">Terms of Service</A>.
          </p>
        </NoteCard>
      </Section>

      <Section title="8. Contact" id="contact">
        <NoteCard icon={MailIcon}>
          <p>
            Questions about a payment or a refund? Email <Mail subject="Refund question" /> from
            the address you sign in with. EARNWINGS is run by {COMPANY_NAME}.
          </p>
        </NoteCard>
      </Section>
    </LegalShell>
  );
}
