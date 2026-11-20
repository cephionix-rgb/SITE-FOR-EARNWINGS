import type { ReactNode } from "react";
import {
  ShieldCheck,
  ClipboardList,
  UserRound,
  FileUp,
  Mic,
  TrendingUp,
  MonitorSmartphone,
  Image as ImageIcon,
  CreditCard,
  Flag,
  Trash2,
} from "lucide-react";
import {
  LegalShell,
  Section,
  Callout,
  NoteCard,
  CardGrid,
  InfoCard,
  Bullets,
  DoList,
} from "../components/Legal";
import { Link } from "../lib/router";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";

const Mail = ({ addr }: { addr: string }) => (
  <a href={`mailto:${addr}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {addr}
  </a>
);

const Strong = ({ children }: { children: ReactNode }) => (
  <strong style={{ color: "#0D1629" }}>{children}</strong>
);

// Kept in step with the full draft policy in _docs/legal/privacy-policy.md and with what
// the code does (earnwings/services/core). If a retention period or an age rule changes
// in code, change it here too.
export function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How EARNWINGS collects, uses and protects your information, in plain English. We keep data collection to the minimum needed to run the service."
      updated="19 November 2026"
    >
      <Callout icon={ShieldCheck} title={`${COMPANY_NAME} is responsible for your data`}>
        <p>
          EARNWINGS is built and operated by <Strong>{COMPANY_NAME}</Strong>. Under India's
          Digital Personal Data Protection Act, 2023 (the DPDP Act), {COMPANY_NAME} is the{" "}
          <Strong>Data Fiduciary</Strong> for the personal data described here, and you are the
          Data Principal. This policy explains what we collect when you join the EARNWINGS
          waitlist, use this website, or use the EARNWINGS app on iPhone, Android, Mac or the
          web, why we collect it, and the choices you have.{" "}
          <Strong>We do not sell your personal data, show ads, or track you across other apps.</Strong>
        </p>
      </Callout>

      <Section title="1. Information we collect" id="collect">
        <CardGrid>
          <InfoCard icon={ClipboardList} title="Waitlist details" accent="gold">
            The name, email address, phone number and target exam you submit when joining
            the waitlist, the price you told us you would pay, and your quiz score if you
            took the quiz.
          </InfoCard>
          <InfoCard icon={UserRound} title="Account & profile" accent="sky">
            Your name, email and password (stored only as a secure hash), or your Google or
            Apple sign-in ID. Your date of birth, the exams you've cleared and your home
            aerodrome. If you are 16 or 17, your parent's or guardian's email address.
          </InfoCard>
          <InfoCard icon={ImageIcon} title="Profile photo" accent="rose">
            Optional. We keep two small copies with all photo data, including GPS location,
            removed. Other students see it next to your name.
          </InfoCard>
          <InfoCard icon={FileUp} title="Documents you upload" accent="navy">
            Licences, medical certificates, logbooks and other paperwork you choose to keep
            in your document vault, so you have them in one place and get reminded before
            they expire. Only you can open them.
          </InfoCard>
          <InfoCard icon={Mic} title="Voice recordings" accent="violet">
            Audio you record during Radio Telephony practice. It is turned into text on our
            own servers to score your phraseology and play back in your debrief, and deleted
            7 days after you record it.
          </InfoCard>
          <InfoCard icon={TrendingUp} title="Usage & progress" accent="emerald">
            XP, chapters completed, test results, practice sessions, study time and similar
            activity.
          </InfoCard>
          <InfoCard icon={CreditCard} title="Purchases" accent="gold">
            What you bought, the amount, the order or transaction ID from Razorpay, Apple or
            Google, and your invoices. We never see or store your card number.
          </InfoCard>
          <InfoCard icon={Flag} title="Reports & blocks" accent="sky">
            Reports you make about posts, messages or Captain Aezon answers (a report of an
            AI answer keeps a copy of the question and the answer so a person can review
            it), and the students you block.
          </InfoCard>
          <InfoCard icon={MonitorSmartphone} title="Technical data" accent="navy">
            Crash reports (not linked to your account), IP address and security logs, and a
            random install ID that stops the free welcome Fuel being claimed twice. The app
            contains no analytics or advertising tools.
          </InfoCard>
        </CardGrid>
      </Section>

      <Section title="2. How we use your information" id="use">
        <Bullets
          items={[
            "To create and run your account and the waitlist.",
            "To personalise your study plan, Captain Aezon answers and progress.",
            "To score RT practice and generate mock exams.",
            "To check your age, ask a parent or guardian to approve the account of a 16- or 17-year-old, and keep the community for adults.",
            <>To process purchases, issue invoices and handle refunds (see our{" "}
              <Link to="/refunds" className="font-semibold underline" style={{ color: "#2E6BE5" }}>Refund and cancellation policy</Link>).</>,
            "To send service emails and support replies, and launch news to people on the waitlist.",
            "To keep the service and the community safe, and improve how it works.",
          ]}
        />
      </Section>

      <Section title="3. AI processing" id="ai">
        <p>
          Captain Aezon, our AI tutor, and some RT features use an outside AI provider,{" "}
          <Strong>DeepSeek, whose servers are in China</Strong>. We send it the text of your
          questions to Captain Aezon (with any document or photo you attach), the{" "}
          <Strong>text</Strong> transcripts of your radio calls, and your study-plan inputs,{" "}
          <Strong>without your name, email or account ID</Strong>. Your RT audio itself is
          transcribed on our own servers and is never sent to an AI provider. We do not store
          your questions to Captain Aezon.
        </p>
        <p>
          DeepSeek's own terms decide how long it keeps what it receives and whether it may use
          it to improve its models. Please don't put personal or sensitive information in your
          questions or attachments. AI answers can be wrong: if one is offensive, harmful or
          wrong, tap <Strong>Report</Strong> on it and a person on our team will review it.
        </p>
        <NoteCard icon={ShieldCheck}>
          <p>
            <Strong>We ask first.</Strong> Before your first question to Captain Aezon, on
            every device, the app shows a one-time card explaining that your question text
            goes to DeepSeek, whose servers are in China. Nothing is sent until you tap{" "}
            <Strong>Agree and continue</Strong>; <Strong>Not now</Strong> leaves the AI
            features off.
          </p>
          <p>
            We record your answer on your account, with the date and the version of the
            notice you agreed to, so it survives reinstalling the app. If we change AI
            provider, we ask you again. You can withdraw at any time in Settings:{" "}
            <Strong>Withdraw AI consent</Strong>. Without your consent the Captain Aezon
            features (Doubt, Aezon+, AI test analysis, AI quiz and research briefs) are not
            called, and our servers refuse them too. The rest of the app keeps working.
          </p>
          <p>
            Radio practice voice is turned into text on our own servers. Only text is ever
            sent to the AI provider, and only for AI features.
          </p>
        </NoteCard>
      </Section>

      <Section title="4. Payments" id="payments">
        <Bullets
          items={[
            <>On this website and in the Mac app, payments are handled by <Strong>Razorpay</Strong>.</>,
            <>On iPhone and iPad, payments are handled by <Strong>Apple In-App Purchase</Strong>.</>,
            <>On Android, payments are handled by <Strong>Google Play Billing</Strong>.</>,
            "We never see your card number. Apple and Google refund store purchases under their own rules.",
          ]}
        />
      </Section>

      <Section title="5. Sharing" id="sharing">
        <p>
          We share personal data only with service providers who help us run EARNWINGS, and
          only what each one needs: our AI provider (DeepSeek), payments (Razorpay, Apple,
          Google), sign-in (Google, Apple), hosting and delivery (Cloudflare), email, video
          hosting, and Zoom for live classes. We may also disclose data where the law requires
          it. Some of these providers process data outside India. Other students can see your
          public profile (name, handle, photo, level and badges).{" "}
          <Strong>We never sell your data or share it for advertising.</Strong>
        </p>
      </Section>

      <Section title="6. How long we keep it" id="retention">
        <Bullets
          items={[
            "Your account, progress, notes, documents and profile photo: until you delete them or your account.",
            "Radio-practice recordings and transcripts: 7 days after each recording, then deleted automatically.",
            "Your AI consent record (when you agreed or withdrew, and the notice version): with your account, deleted when you delete it.",
            "Refund requests: kept with the invoice they belong to, for 8 years, as part of the payment record.",
            "Invoices and payment records: 8 years from the invoice date, as GST law requires, even after you delete your account.",
            "Community messages: 2 years. Chat images and files: 45 days unless saved. Post images and files: 1 year.",
            "Database backups: up to about 12 months, then overwritten.",
          ]}
        />
      </Section>

      <Section title="7. Deleting your account" id="delete">
        <p>
          You can delete your account at any time in the app: Profile → Account →{" "}
          <Strong>Delete my account</Strong>. If you signed up with Google or Apple, you confirm
          by signing in with them again or by typing DELETE. You can also email{" "}
          <Mail addr={SUPPORT_EMAIL} /> from your account's email address.
        </p>
        <NoteCard icon={Trash2}>
          <p>
            <Strong>Deleted straight away:</Strong> your account, profile, progress, notes,
            uploaded documents, profile photos and radio-practice recordings.
          </p>
          <p>
            <Strong>Kept:</Strong> invoices and payment records, for 8 years as GST law
            requires. They are labelled with a code instead of your account, and each invoice
            PDF is kept exactly as it was issued. Messages and posts you made in the community
            stay, without your name, until their normal deletion date. Reports you made stay,
            without your name. Razorpay, Apple and Google keep their own payment records.
          </p>
        </NoteCard>
      </Section>

      <Section title="8. Your rights" id="rights">
        <DoList
          items={[
            "Ask for a summary of the personal data we hold about you and how we use it.",
            "Correct your details: most are editable in the app; email us for your date of birth.",
            "Delete your account and your data (see section 7).",
            "Withdraw your consent at any time. A parent or guardian can withdraw theirs too. To stop sending questions to the AI provider, use Settings → Withdraw AI consent in the app.",
            "Nominate someone to use these rights for you if you die or cannot act yourself.",
            "Complain to us, and then to the Data Protection Board of India.",
          ]}
        />
        <p>
          Email <Mail addr={SUPPORT_EMAIL} /> to use any of these rights.
        </p>
      </Section>

      <Section title="9. Age and young users" id="children">
        <Bullets
          items={[
            "EARNWINGS is for aspiring pilots aged 16 and above. We do not create accounts for anyone under 16.",
            "If you are 16 or 17, a parent or guardian must approve your account by email. Until they do, you can use the free study content, but you cannot buy anything or use the community.",
            "The community, messages and calls are for users aged 18 and over only.",
            "We never show ads to anyone, and we do not profile young users for advertising.",
          ]}
        />
      </Section>

      <Section title="10. Security" id="security">
        <p>
          Your data is stored on secured servers with access controls and encryption in
          transit. Passwords are stored only as hashes, documents and recordings are served
          only to their owner, photo location data is removed, purchases are checked directly
          with Razorpay, Apple or Google, and staff access to student data is logged. No method
          of transmission is 100% secure. If a breach affects your data, we will tell you and
          the authorities as the law requires.
        </p>
      </Section>

      <Section title="11. Cookies and storage" id="cookies">
        <p>
          This website uses Google Analytics, with IP anonymisation switched on, to count
          visits. Google Analytics sets its own cookies, which you can block in your browser
          settings. If you sign in on this website, your sign-in is kept in your browser's
          local storage. The app stores your sign-in, settings and cached study material on
          your device, and uses no advertising or analytics cookies.
        </p>
      </Section>

      <Section title="12. Changes" id="changes">
        <p>
          We may update this policy as the product evolves. Material changes will be
          announced in the app or by email, and the "last updated" date above will change.
        </p>
      </Section>

      <Section title="13. Contact and complaints" id="contact">
        <p>
          Questions or complaints about privacy? Email us at <Mail addr={SUPPORT_EMAIL} />.
          Our Grievance Officer can be reached at the same address. We acknowledge complaints
          within 24 hours and resolve them within 15 days.
        </p>
      </Section>
    </LegalShell>
  );
}
