import type { ReactNode } from "react";
import { LifeBuoy, Clock, Scale, HelpCircle, ShieldCheck, Trash2, CreditCard, KeyRound, Building2 } from "lucide-react";
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

const Mail = ({ subject }: { subject?: string }) => (
  <a
    href={`mailto:${SUPPORT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
    className="font-semibold underline"
    style={{ color: "#2E6BE5" }}
  >
    {SUPPORT_EMAIL}
  </a>
);

// OWNER: fill these in before publishing. They must match GRIEVANCE_OFFICER_* in the
// core settings (shown by GET /legal/grievance) and section 11 of the privacy policy.
// The square brackets stay visible on the page until then, on purpose.
const GRIEVANCE_OFFICER_NAME = "Shubhdeep Singh";
const GRIEVANCE_OFFICER_TITLE = "Director";

// The support URL the App Store and Google Play listings give, and the "Support and
// FAQ" row in the app (AccountSettings SUPPORT_URL). Response times are the ones the
// privacy policy promises (section 11).
export function SupportPage() {
  return (
    <LegalShell
      eyebrow="Help"
      title="Support"
      intro="Stuck, found a mistake, or have a question about your account or a purchase? Write to us. A person reads every email."
      updated="20 November 2026"
    >
      <Callout icon={LifeBuoy} title="Email us">
        <p>
          <Mail subject="EARNWINGS support" />
        </p>
        <p>
          Write from the email address you use to sign in, and tell us which device you are
          on (iPhone, Android, Mac or the website). For a problem in the app, a screenshot
          and the build number from Profile → Account help us fix it faster.
        </p>
      </Callout>

      <Section title="Contact details" id="contact">
        <NoteCard icon={Building2}>
          <p>
            <Strong>Cephionix Software Developer OPC Private Limited</Strong> (EarnWings)
            <br />
            CIN: U62013PB2026OPC068054
            <br />
            Registered office: 49 Gulmohar Complex, Kharar, Punjab 140301, India
            <br />
            Email: <Mail subject="EARNWINGS enquiry" />
          </p>
        </NoteCard>
      </Section>

      <Section title="How quickly we reply" id="response-times">
        <NoteCard icon={Clock}>
          <Bullets
            items={[
              <><Strong>Within 24 hours</Strong> we confirm we have your email or complaint.</>,
              <><Strong>Within 15 days</Strong> we resolve it.</>,
              "Complaints about intimate images or someone pretending to be you are acted on within 24 hours.",
            ]}
          />
        </NoteCard>
      </Section>

      <Section title="Common questions" id="faq">
        <CardGrid>
          <InfoCard icon={HelpCircle} title="Questions about EARNWINGS" accent="sky">
            What the app covers, how the mock exams work, Captain Aezon and RT practice:
            see the <A to="/faq">FAQ</A> and the <A to="/features">features</A> page.
          </InfoCard>
          <InfoCard icon={KeyRound} title="Signing in" accent="navy">
            Forgot your password? Use "Forgot password" on the sign-in screen. If you
            signed up with Google or Apple, sign in with the same one again. Still stuck?
            Email us.
          </InfoCard>
          <InfoCard icon={CreditCard} title="Purchases and refunds" accent="gold">
            Website and Windows purchases can be refunded if you ask within 7 days of paying:
            tap Request a refund next to the purchase on the <A to="/account">account</A> page.
            Purchases made on iPhone, iPad, Mac or Android are refunded by Apple or Google under their
            own rules. Details: <A to="/refunds">Refund policy</A>.
          </InfoCard>
          <InfoCard icon={Trash2} title="Deleting your account" accent="rose">
            In the app: Profile → Account → Delete my account. Or ask by email. What is
            deleted and what is kept: <A to="/delete-account">Delete your account</A>.
          </InfoCard>
          <InfoCard icon={ShieldCheck} title="Your data" accent="emerald">
            Download a copy in the app (Profile → Account → Download my data), or read
            the <A to="/privacy">Privacy Policy</A>.
          </InfoCard>
          <InfoCard icon={HelpCircle} title="A mistake in our content" accent="violet">
            Tell us the chapter or question. How we check content:{" "}
            <A to="/how-we-check">How we check</A>. Sat a DGCA paper?{" "}
            <A to="/report-exam-questions">Report your exam questions</A>.
          </InfoCard>
        </CardGrid>
      </Section>

      <Section title="Grievance Officer" id="grievance">
        <NoteCard icon={Scale}>
          <p>
            Under the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
            and the Digital Personal Data Protection Act, 2023, complaints can go to our
            Grievance Officer:
          </p>
          <p>
            <Strong>{GRIEVANCE_OFFICER_NAME}</Strong>, {GRIEVANCE_OFFICER_TITLE}, {COMPANY_NAME}
            <br />
            Email: <Mail subject="Grievance" />
          </p>
          <p>
            You don't need an account to complain. In the app you can also use Report on any
            post, message or Captain Aezon answer. If you are not satisfied with our answer,
            you can complain to the Data Protection Board of India.
          </p>
        </NoteCard>
      </Section>
    </LegalShell>
  );
}
