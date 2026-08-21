import {
  ShieldCheck,
  ClipboardList,
  UserRound,
  FileUp,
  Mic,
  TrendingUp,
  MonitorSmartphone,
} from "lucide-react";
import {
  LegalShell,
  Section,
  Callout,
  CardGrid,
  InfoCard,
  Bullets,
  DoList,
} from "../components/Legal";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";

const Mail = ({ addr }: { addr: string }) => (
  <a href={`mailto:${addr}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {addr}
  </a>
);

export function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How EARNWINGS collects, uses and protects your information — in plain English. We keep data collection to the minimum needed to run the service."
      updated="31 July 2026"
    >
      <Callout icon={ShieldCheck} title={`${COMPANY_NAME} is the data controller`}>
        <p>
          EARNWINGS is built and operated by{" "}
          <strong style={{ color: "#0D1629" }}>{COMPANY_NAME}</strong>, which is the
          entity responsible for the personal data described here. This policy
          explains what we collect when you join the EARNWINGS waitlist or use the
          EARNWINGS training app, why we collect it, and the choices you have.{" "}
          <strong style={{ color: "#0D1629" }}>We do not sell your personal data.</strong>
        </p>
      </Callout>

      <Section title="1. Information we collect" id="collect">
        <CardGrid>
          <InfoCard icon={ClipboardList} title="Waitlist details" accent="gold">
            The email address, name and target exam you submit when joining the
            waitlist.
          </InfoCard>
          <InfoCard icon={UserRound} title="Account & profile" accent="sky">
            In the app: your name, date of birth, and the exams you've cleared,
            provided during onboarding.
          </InfoCard>
          <InfoCard icon={FileUp} title="Documents you upload" accent="navy">
            Training records, DGCA paperwork and study notes you choose to add, used
            to personalise your learning.
          </InfoCard>
          <InfoCard icon={Mic} title="Voice recordings" accent="violet">
            Audio captured during Radio Telephony practice, processed to score your
            phraseology.
          </InfoCard>
          <InfoCard icon={TrendingUp} title="Usage & progress" accent="emerald">
            XP, chapters completed, exam results, flight plans generated and similar
            activity.
          </InfoCard>
          <InfoCard icon={MonitorSmartphone} title="Technical data" accent="rose">
            Device type, browser and anonymised analytics to keep the service
            reliable.
          </InfoCard>
        </CardGrid>
      </Section>

      <Section title="2. How we use your information" id="use">
        <Bullets
          items={[
            "To create and run your account and the waitlist.",
            "To personalise your study plan, AI Captain answers and progress.",
            "To score RT practice and generate flight plans and mock exams.",
            "To send you product updates, launch news and support replies.",
            "To keep the service secure and improve how it works.",
          ]}
        />
      </Section>

      <Section title="3. AI processing" id="ai">
        <p>
          Some features send your content to trusted AI providers to generate a
          response — for example, your questions and relevant notes power the AI
          Captain, and your RT audio is transcribed for scoring.{" "}
          <strong style={{ color: "#0D1629" }}>
            This content is used only to produce your result and is not used to train
            third-party models.
          </strong>{" "}
          The AI Captain is designed to answer from your own material and to decline
          rather than invent facts.
        </p>
      </Section>

      <Section title="4. Sharing" id="sharing">
        <p>
          We do not sell your personal data. We share it only with service providers
          who help us operate EARNWINGS (hosting, analytics, payment, email and AI
          processing), bound by confidentiality obligations, or where required by
          law.
        </p>
      </Section>

      <Section title="5. Data storage & security" id="security">
        <p>
          Your data is stored on secured servers with access controls and encryption
          in transit. We retain information for as long as your account is active or
          as needed to provide the service, then delete or anonymise it. No method of
          transmission is 100% secure, but we work hard to protect your information.
        </p>
      </Section>

      <Section title="6. Your rights" id="rights">
        <DoList
          items={[
            "Access, correct or download the data we hold about you.",
            "Delete your account and associated data.",
            "Opt out of marketing emails at any time.",
            "Withdraw consent for optional processing.",
          ]}
        />
      </Section>

      <Section title="7. Cookies" id="cookies">
        <p>
          We use essential cookies to keep you signed in and a small amount of
          privacy-friendly analytics to understand usage. You can control cookies
          through your browser settings.
        </p>
      </Section>

      <Section title="8. Children" id="children">
        <p>
          EARNWINGS is intended for aspiring pilots aged 16 and above. We do not
          knowingly collect data from children under 16.
        </p>
      </Section>

      <Section title="9. Changes" id="changes">
        <p>
          We may update this policy as the product evolves. Material changes will be
          announced in the app or by email, and the "last updated" date above will
          change.
        </p>
      </Section>

      <Section title="10. Contact" id="contact">
        <p>
          Questions about privacy? Email us at <Mail addr={SUPPORT_EMAIL} />.
        </p>
      </Section>
    </LegalShell>
  );
}
