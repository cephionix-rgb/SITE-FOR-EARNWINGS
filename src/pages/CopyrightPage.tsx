import {
  ShieldAlert,
  Code2,
  BookOpen,
  Sparkles,
  Camera,
  LayoutGrid,
  Palette,
  Gavel,
} from "lucide-react";
import {
  LegalShell,
  Section,
  Callout,
  NoteCard,
  CardGrid,
  InfoCard,
  DontList,
  DoList,
} from "../components/Legal";
import { Link } from "../lib/router";
import { COMPANY_NAME, CONTACT_EMAIL, NEURALWINGS_URL } from "../lib/siteConfig";

// The plain-language IP notice. Deliberately mirrors the sibling page at
// neuralwings.org/copyright — same voice, same section order, same card
// vocabulary — so both Cephionix products state one position.

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noopener noreferrer"
    className="font-semibold underline"
    style={{ color: "#2E6BE5" }}
  >
    {children}
  </a>
);

export function CopyrightPage() {
  return (
    <LegalShell
      eyebrow="Intellectual Property"
      title="This is our work. All of it."
      intro="EARNWINGS — the app, the notes, the logo, the screens, the screenshots, and the way information is presented inside it — is the exclusive property of Cephionix. It is not open source, not free to reuse, and not available to be rebuilt by anyone else."
      updated="31 July 2026"
    >
      <Callout icon={ShieldAlert} title={`© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.`}>
        <p>
          EARNWINGS was designed, written and developed entirely in-house, over a
          long period and at substantial cost — the notes and the app both. Every
          part of it is protected under the Copyright Act, 1957, the Trade Marks
          Act, 1999, the Designs Act, 2000, the Information Technology Act, 2000,
          and Indian law on confidence and trade secrets — plus equivalent law and
          international treaties wherever this site can be reached.{" "}
          <strong style={{ color: "#0D1629" }}>
            Browsing this site, taking a free trial, or being a student gives you
            no licence to reproduce any of it.
          </strong>
        </p>
      </Callout>

      <Section title="What is protected" id="protected">
        <CardGrid>
          <InfoCard icon={Code2} title="The application itself" accent="sky">
            All source code, architecture, database design, APIs and integrations
            behind EARNWINGS — including the flight-planning and routing engines,
            the radio-telephony trainer, and the AI Captain's prompts, retrieval
            and grading logic. Built in-house by {COMPANY_NAME}, owned entirely by{" "}
            {COMPANY_NAME}.
          </InfoCard>

          <InfoCard icon={BookOpen} title="The notes and the question banks" accent="gold">
            Every chapter, note, summary, diagram, figure, illustration, worked
            solution and explanation. Every question bank, sample paper and mock
            exam. Every RT scenario and script. Whether written by us, commissioned
            by us or licensed to us — none of it is yours to copy, print for
            others, circulate or sell.
          </InfoCard>

          <InfoCard icon={Sparkles} title="The logo and the brand" accent="navy">
            The EARNWINGS wordmark and wings device, the {COMPANY_NAME} name, and
            our navy-and-gold identity are our trade marks. No copies, no
            lookalikes.
          </InfoCard>

          <InfoCard icon={Camera} title="Screenshots and demos" accent="violet">
            Every screen, chart, instrument graphic and screenshot on this site, in
            the app, or in a live demo is a copyrighted work. Capturing or
            republishing them needs our written permission.
          </InfoCard>

          <InfoCard icon={LayoutGrid} title="How the information is presented" accent="emerald">
            The way the DGCA syllabus is broken down and sequenced, the chapter and
            topic structure, which concept is taught before which, the terminology,
            the rank and XP progression, and the path from first chapter to mock
            exam — the arrangement is the invention, and it is protected.
          </InfoCard>

          <InfoCard icon={Palette} title="The design and the words" accent="rose">
            Layouts, interaction patterns, animations, icons, colour systems,
            illustrations, feature names, marketing copy and documentation — all
            original work, all ours.
          </InfoCard>
        </CardGrid>
      </Section>

      <Section title="Copying the presentation counts as copying" id="presentation">
        <p>
          The most valuable thing about EARNWINGS is not any single screen or any
          single note — it is the arrangement. How five dense DGCA subjects are cut
          into chapters a student can actually finish. Which topic comes before
          which. What the AI Captain is allowed to answer from and what it must
          refuse. How a flight plan is broken into the steps a student learns in
          order. How progress is scored, ranked and rewarded so someone keeps going.
        </p>
        <p>
          That selection, structure, sequence and organisation is our original
          expression, our trade dress and our confidential know-how.{" "}
          <strong style={{ color: "#0D1629" }}>
            Reproducing it is an infringement whether you copy our files or simply
            study our product and rebuild what you saw.
          </strong>{" "}
          A different colour palette, renamed chapters, reworded notes or redrawn
          screens do not make a copy lawful — and they do not make one hard to
          recognise.
        </p>
      </Section>

      <Section title="Specifically, you may not" id="may-not">
        <DontList
          items={[
            "Copying our code, notes, questions, designs, screens or text — in whole or in part.",
            "Rebuilding the same product after studying this site, a screenshot, a demo, or a live account.",
            "Screenshotting, screen-recording, printing or transcribing our notes or question banks and circulating them — in study groups, messaging groups, cloud drives, social media, or a coaching class.",
            "Renaming our chapters, changing our colours, or re-drawing our screens and calling it your own.",
            "Handing our screenshots or notes to a developer, designer or agency as a specification or reference.",
            "Using our screens or content in a pitch deck, tender, brochure, course material or comparison.",
            "Scraping this site or the app, or using our content to train, fine-tune or evaluate an AI model.",
            "Using our name, logo, or a confusingly similar mark, domain or app name.",
            "Reverse engineering the platform, the AI Captain's prompts, or the flight-planning logic.",
            "Circumventing the watermarks, paging or other technical measures that protect our notes.",
          ]}
        />
        <p className="mt-2">
          This applies to everyone equally — visitors, waitlisted cadets, students,
          former students, employees, contractors, instructors, vendors and
          investors.
        </p>
      </Section>

      <Section title="What you may do" id="may-do">
        <DoList
          items={[
            "Browsing this site to decide whether EARNWINGS is right for you.",
            "Studying from the notes and questions inside your own account, for your own exam preparation.",
            "Saving or printing a page for your own personal reference.",
            "Linking to us, without framing or implying a relationship that does not exist.",
            "Quoting a short extract for genuine news reporting or review, with attribution.",
            "Anything else we have agreed to in writing — just ask us first.",
          ]}
        />
      </Section>

      <Section title="What happens if you copy it" id="enforcement">
        <NoteCard icon={Gavel}>
          <p>
            We monitor for copies of our software, notes, designs and screens, and
            we act on what we find — takedown notices to your host, registrar, app
            store and search engines; urgent injunctions and evidence-preservation
            orders; claims for damages, an account of your profits, delivery-up of
            infringing material, and our legal costs; immediate termination of any
            access or agreement you have with us; and notice to your customers,
            investors or regulator where their interests are affected.
          </p>
          <p>
            Copyright infringement is also a criminal offence in India under section
            63 of the Copyright Act, 1957 — imprisonment of six months to three
            years and a fine of ₹50,000 to ₹2,00,000. Trade mark falsification
            carries comparable penalties under sections 103 and 104 of the Trade
            Marks Act, 1999, and unauthorised access to or extraction from our
            systems attracts liability under sections 43, 65 and 66 of the
            Information Technology Act, 2000.
          </p>
          <p>
            <strong style={{ color: "#0D1629" }}>
              Put simply: building something like this out of our work will cost you
              far more than licensing it would have.
            </strong>
          </p>
        </NoteCard>
      </Section>

      <Section title="If you want to use something of ours" id="permission">
        <p>
          Permission is often available. Press and analysts can request logo and
          screenshot assets, flight schools and academies can discuss licensing, and
          partners can ask about integrations. Write to{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> and ask. Taking it
          without asking is the only option that ends badly.
        </p>
        <p>
          Found someone copying EARNWINGS? Tell us at the same address — we follow
          up on every report.
        </p>
        <p className="text-[14px]" style={{ color: "#8296bf" }}>
          This page states our position in plain language. The binding terms are in
          our{" "}
          <Link to="/terms" className="font-semibold underline" style={{ color: "#2E6BE5" }}>
            Terms of Service
          </Link>
          , section 7. {COMPANY_NAME} also builds{" "}
          <A href={NEURALWINGS_URL}>Neural Wings</A>, the AI-powered aviation
          management platform for DGCA-approved flight training organisations — the
          same notice applies there.
        </p>
      </Section>
    </LegalShell>
  );
}
