import type { ReactNode } from "react";
import { Trash2, Smartphone, Mail as MailIcon, Archive } from "lucide-react";
import { LegalShell, Section, Callout, NoteCard, Bullets, DoList } from "../components/Legal";
import { Link } from "../lib/router";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";

const Strong = ({ children }: { children: ReactNode }) => (
  <strong style={{ color: "#0D1629" }}>{children}</strong>
);

const DELETE_MAIL = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my EARNWINGS account")}`;

// The public account-deletion page Google Play asks for (Data safety form, "delete
// account URL"). The app links here too (AccountSettings DELETE_ACCOUNT_URL). Kept in
// step with _docs/legal/privacy-policy.md section 6 and with what core/app/account.py
// actually deletes: if a retention period changes in code, change it here too.
export function DeleteAccountPage() {
  return (
    <LegalShell
      eyebrow="Your data"
      title="Delete your EARNWINGS account"
      intro={`How to delete your EARNWINGS account and your data, in the app or by email, and exactly what is deleted and what we have to keep. EARNWINGS is made by ${COMPANY_NAME}.`}
      updated="19 November 2026"
    >
      <Callout icon={Trash2} title="You can delete your account at any time">
        <p>
          Deleting your account is permanent. It cannot be undone, and any Premium time
          you have left is lost. You do not need to reinstall the app or have it on your
          phone: you can also ask us by email (see below).
        </p>
      </Callout>

      <Section title="1. Delete it in the app" id="in-the-app">
        <NoteCard icon={Smartphone}>
          <p>
            Open EARNWINGS and go to <Strong>Profile → Account → Delete my account</Strong>.
          </p>
          <Bullets
            items={[
              "If you sign in with an email and password, enter your password and type DELETE.",
              "If you signed up with Google or Apple, confirm by signing in with Google or Apple again, or type DELETE.",
              "Tap Delete forever. Your account is deleted straight away and you are signed out.",
            ]}
          />
        </NoteCard>
        <p>
          Want a copy first? In the same place, <Strong>Download my data</Strong> saves a file
          with your account, progress, notes and purchases, and links to your radio-practice
          recordings.
        </p>
      </Section>

      <Section title="2. Or ask us by email" id="by-email">
        <NoteCard icon={MailIcon}>
          <p>
            Email{" "}
            <a href={DELETE_MAIL} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
              {SUPPORT_EMAIL}
            </a>{" "}
            with the subject <Strong>Delete my EARNWINGS account</Strong>. Send it from the
            email address you use to sign in to EARNWINGS, so we know the account is yours.
          </p>
          <p>
            If you can no longer use that address, tell us your name and your EARNWINGS
            handle, and we will ask you to confirm the account is yours before deleting
            anything. We reply within 24 hours and finish the deletion within 15 days.
          </p>
        </NoteCard>
      </Section>

      <Section title="3. What is deleted straight away" id="deleted">
        <DoList
          items={[
            "Your account and profile: name, email, handle, date of birth and settings.",
            "Your study progress, test scores and history, XP, streaks and study plans.",
            "Your notes, highlights and bookmarks, including anything in Trash.",
            "Documents in your vault and their files.",
            "Your profile photo, including any older photos still stored.",
            "Your radio-practice recordings and their transcripts.",
            "Images and files you shared in community chats and posts.",
            "Your parent's or guardian's approval record, if you are 16 or 17.",
            "Unpaid or failed orders, and your Fuel spending and rewards history.",
          ]}
        />
      </Section>

      <Section title="4. What we keep, and for how long" id="kept">
        <NoteCard icon={Archive}>
          <Bullets
            items={[
              <>
                <Strong>Invoices and payment records: 8 years</Strong> from the invoice date,
                because GST law requires it. This includes paid orders, Fuel purchase and
                refund records, and App Store and Google Play purchase records. They are
                separated from your deleted account and labelled with a random code
                (starting DEL-) instead. Each invoice PDF is kept exactly as it was issued,
                so it still shows the name and email printed on it. After 8 years they are
                deleted automatically.
              </>,
              <>
                <Strong>Community messages and posts</Strong> you wrote stay, without your
                name, so conversations still make sense to others. They are deleted on the
                normal schedule: messages after 2 years.
              </>,
              <>
                <Strong>Reports you made</Strong>, including reports of Captain Aezon answers,
                stay without your name, because they are evidence. A report of an AI answer
                is deleted 1 year after it is resolved, or 2 years after it was made if it
                was never resolved.
              </>,
              <>
                <Strong>Backups</Strong> of our database still hold your data until they are
                replaced, which takes up to about 12 months.
              </>,
              <>
                Your referral code is retired so that it is never given to anyone else.
              </>,
              <>
                <Strong>Razorpay, Apple and Google</Strong> keep their own payment records
                under their own legal duties.
              </>,
            ]}
          />
        </NoteCard>
      </Section>

      <Section title="5. Questions" id="questions">
        <p>
          For the full details, read our <Link to="/privacy" className="font-semibold underline" style={{ color: "#2E6BE5" }}>Privacy Policy</Link>.
          For anything else, see <Link to="/support" className="font-semibold underline" style={{ color: "#2E6BE5" }}>Support</Link>,
          or email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <p className="flex items-center gap-2 text-[13px]" style={{ color: "#8296bf" }}>
          <Smartphone size={14} /> App: EARNWINGS · Developer: {COMPANY_NAME}
        </p>
      </Section>
    </LegalShell>
  );
}
