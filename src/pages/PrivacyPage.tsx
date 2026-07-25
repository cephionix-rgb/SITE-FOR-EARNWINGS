import { PageShell } from "../components/PageShell";
import { H2, P, UL, Updated } from "../components/Prose";

export function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How EARNWINGS collects, uses and protects your information — in plain English."
    >
      <Updated date="24 July 2026" />

      <P>
        This policy explains what we collect when you join the EARNWINGS waitlist
        or use the EARNWINGS training app, why we collect it, and the choices you
        have. We keep data collection to the minimum needed to run the service.
      </P>

      <H2>1. Information we collect</H2>
      <UL>
        <li>
          <strong>Waitlist details</strong> — the email address, name and target
          exam you submit when joining the waitlist.
        </li>
        <li>
          <strong>Account &amp; profile</strong> — in the app: your name, date of
          birth, and the exams you've cleared, provided during onboarding.
        </li>
        <li>
          <strong>Documents you upload</strong> — training records, DGCA
          paperwork and study notes you choose to add, used to personalise your
          learning.
        </li>
        <li>
          <strong>Voice recordings</strong> — audio captured during Radio
          Telephony practice, processed to score your phraseology.
        </li>
        <li>
          <strong>Usage &amp; progress</strong> — XP, chapters completed, exam
          results, flight plans generated and similar activity.
        </li>
        <li>
          <strong>Technical data</strong> — device type, browser and anonymised
          analytics to keep the service reliable.
        </li>
      </UL>

      <H2>2. How we use your information</H2>
      <UL>
        <li>To create and run your account and the waitlist.</li>
        <li>To personalise your study plan, AI Captain answers and progress.</li>
        <li>To score RT practice and generate flight plans and mock exams.</li>
        <li>To send you product updates, launch news and support replies.</li>
        <li>To keep the service secure and improve how it works.</li>
      </UL>

      <H2>3. AI processing</H2>
      <P>
        Some features send your content to trusted AI providers to generate a
        response — for example, your questions and relevant notes power the AI
        Captain, and your RT audio is transcribed for scoring. This content is
        used only to produce your result and is not used to train third-party
        models. The AI Captain is designed to answer from your own material and
        to decline rather than invent facts.
      </P>

      <H2>4. Sharing</H2>
      <P>
        We do not sell your personal data. We share it only with service
        providers who help us operate EARNWINGS (hosting, analytics, payment,
        email and AI processing), bound by confidentiality obligations, or where
        required by law.
      </P>

      <H2>5. Data storage &amp; security</H2>
      <P>
        Your data is stored on secured servers with access controls and
        encryption in transit. We retain information for as long as your account
        is active or as needed to provide the service, then delete or anonymise
        it. No method of transmission is 100% secure, but we work hard to protect
        your information.
      </P>

      <H2>6. Your rights</H2>
      <UL>
        <li>Access, correct or download the data we hold about you.</li>
        <li>Delete your account and associated data.</li>
        <li>Opt out of marketing emails at any time.</li>
        <li>Withdraw consent for optional processing.</li>
      </UL>

      <H2>7. Cookies</H2>
      <P>
        We use essential cookies to keep you signed in and a small amount of
        privacy-friendly analytics to understand usage. You can control cookies
        through your browser settings.
      </P>

      <H2>8. Children</H2>
      <P>
        EARNWINGS is intended for aspiring pilots aged 16 and above. We do not
        knowingly collect data from children under 16.
      </P>

      <H2>9. Changes</H2>
      <P>
        We may update this policy as the product evolves. Material changes will
        be announced in the app or by email, and the "last updated" date above
        will change.
      </P>

      <H2>10. Contact</H2>
      <P>
        Questions about privacy? Email us at{" "}
        <a
          href="mailto:cephionix@gmail.com"
          className="font-semibold underline"
          style={{ color: "#2E6BE5" }}
        >
          cephionix@gmail.com
        </a>
        .
      </P>
    </PageShell>
  );
}
