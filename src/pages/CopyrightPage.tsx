import { ShieldAlert } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { H2, H3, P, UL, Updated } from "../components/Prose";
import { Link } from "../lib/router";
import { COMPANY_NAME, CONTACT_EMAIL, NEURALWINGS_URL } from "../lib/siteConfig";

// The plain-language IP notice. Mirrors the sibling page at neuralwings.org/copyright
// so both Cephionix products state the same position in the same voice. The
// binding version lives in Terms §7 — this page says it in English.

/** Gold "© Cephionix" banner that anchors the page, matching the Neural Wings notice. */
function OwnershipBanner() {
  return (
    <div
      className="my-8 flex gap-4 rounded-2xl border p-5"
      style={{ background: "#FFF8E7", borderColor: "rgba(201,152,31,0.4)" }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "rgba(201,152,31,0.18)", color: "#8a6a12" }}
      >
        <ShieldAlert size={20} />
      </span>
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#1B3A7A" }}>
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </h2>
        <p className="mt-2 text-[15px] leading-7" style={{ color: "#41527A" }}>
          EARNWINGS was designed, written and developed entirely in-house, over a
          long period and at substantial cost — the notes and the app both.
          Every part of it is protected under the Copyright Act, 1957, the Trade
          Marks Act, 1999, the Designs Act, 2000, the Information Technology Act,
          2000, and Indian law on confidence and trade secrets — plus equivalent
          law and international treaties wherever this site can be reached.{" "}
          <strong style={{ color: "#1B3A7A" }}>
            Browsing this site, taking a free trial, or being a student gives you
            no licence to reproduce any of it.
          </strong>
        </p>
      </div>
    </div>
  );
}

export function CopyrightPage() {
  return (
    <PageShell
      eyebrow="Intellectual Property"
      title="This is our work. All of it."
      subtitle="EARNWINGS — the app, the notes, the logo, the screens, the screenshots, and the way information is presented inside it — is the exclusive property of Cephionix. It is not open source, not free to reuse, and not available to be rebuilt by anyone else."
    >
      <Updated date="31 July 2026" />

      <OwnershipBanner />

      <H2>What is protected</H2>

      <H3>The application itself</H3>
      <P>
        All source code, architecture, database design, APIs and integrations
        behind EARNWINGS — including the flight-planning and routing engines, the
        radio-telephony trainer, and the AI Captain's prompts, retrieval and
        grading logic. Built in-house by {COMPANY_NAME}, owned entirely by{" "}
        {COMPANY_NAME}.
      </P>

      <H3>The notes and the question banks</H3>
      <P>
        Every chapter, note, summary, diagram, figure, illustration, worked
        solution and explanation. Every question bank, sample paper and mock
        exam. Every RT scenario and script. Whether written by us, commissioned
        by us or licensed to us — none of it is yours to copy, print for others,
        circulate or sell.
      </P>

      <H3>The logo and the brand</H3>
      <P>
        The EARNWINGS wordmark and wings device, the {COMPANY_NAME} name, and our
        navy-and-gold identity are our trade marks. No copies, no lookalikes.
      </P>

      <H3>Screenshots and demos</H3>
      <P>
        Every screen, chart, chart-plot, instrument graphic and screenshot on this
        site, in the app, or in a live demo is a copyrighted work. Capturing or
        republishing them needs our written permission.
      </P>

      <H3>How the information is presented</H3>
      <P>
        The way the DGCA syllabus is broken down and sequenced, the chapter and
        topic structure, which concept is taught before which, the terminology,
        the rank and XP progression, the layout of a lesson and the path from
        first chapter to mock exam — the arrangement is the invention, and it is
        protected.
      </P>

      <H3>The design and the words</H3>
      <P>
        Layouts, interaction patterns, animations, icons, colour systems,
        illustrations, feature names, marketing copy and documentation — all
        original work, all ours.
      </P>

      <H2>Copying the presentation counts as copying</H2>
      <P>
        The most valuable thing about EARNWINGS is not any single screen or any
        single note — it is the arrangement. How five dense DGCA subjects are cut
        into chapters a student can actually finish. Which topic comes before
        which. What the AI Captain is allowed to answer from and what it must
        refuse. How a flight plan is broken into the steps a student learns in
        order. How progress is scored, ranked and rewarded so someone keeps going.
      </P>
      <P>
        That selection, structure, sequence and organisation is our original
        expression, our trade dress and our confidential know-how. Reproducing it
        is an infringement whether you copy our files or simply study our product
        and rebuild what you saw. A different colour palette, renamed chapters,
        reworded notes or redrawn screens do not make a copy lawful — and they do
        not make one hard to recognise.
      </P>

      <H2>Specifically, you may not</H2>
      <UL>
        <li>Copy our code, notes, questions, designs, screens or text — in whole or in part.</li>
        <li>
          Rebuild the same product after studying this site, a screenshot, a
          demo, or a live account.
        </li>
        <li>
          Screenshot, screen-record, photograph, print or transcribe our notes or
          question banks and circulate them — in study groups, messaging groups,
          cloud drives, social media, or a coaching class.
        </li>
        <li>
          Rename our chapters, change our colours, or re-draw our screens and call
          it your own.
        </li>
        <li>
          Hand our screenshots or notes to a developer, designer or agency as a
          specification or reference.
        </li>
        <li>
          Use our screens or content in a pitch deck, tender, brochure, course
          material or comparison.
        </li>
        <li>
          Scrape this site or the app, or use our content to train, fine-tune or
          evaluate an AI model.
        </li>
        <li>
          Use our name, logo, or a confusingly similar mark, domain or app name.
        </li>
        <li>
          Reverse engineer the platform, the AI Captain's prompts, or the
          flight-planning logic.
        </li>
        <li>
          Circumvent the watermarks, paging or other technical measures that
          protect our notes.
        </li>
      </UL>
      <P>
        This applies to everyone equally — visitors, waitlisted cadets, students,
        former students, employees, contractors, instructors, vendors and
        investors.
      </P>

      <H2>What you may do</H2>
      <UL>
        <li>Browse this site to decide whether EARNWINGS is right for you.</li>
        <li>
          Study from the notes and questions inside your own account, for your own
          exam preparation.
        </li>
        <li>Save or print a page for your own personal reference.</li>
        <li>
          Link to us, without framing or implying a relationship that does not
          exist.
        </li>
        <li>
          Quote a short extract for genuine news reporting or review, with
          attribution.
        </li>
        <li>Anything else we have agreed to in writing — just ask us first.</li>
      </UL>

      <H2>What happens if you copy it</H2>
      <P>
        We monitor for copies of our software, notes, designs and screens, and we
        act on what we find — takedown notices to your host, registrar, app store
        and search engines; urgent injunctions and evidence-preservation orders;
        claims for damages, an account of your profits, delivery-up of infringing
        material, and our legal costs; immediate termination of any access or
        agreement you have with us; and notice to your customers, investors or
        regulator where their interests are affected.
      </P>
      <P>
        Copyright infringement is also a criminal offence in India under section
        63 of the Copyright Act, 1957 — imprisonment of six months to three years
        and a fine of ₹50,000 to ₹2,00,000. Trade mark falsification carries
        comparable penalties under sections 103 and 104 of the Trade Marks Act,
        1999, and unauthorised access to or extraction from our systems attracts
        liability under sections 43, 65 and 66 of the Information Technology Act,
        2000.
      </P>
      <P>
        <strong style={{ color: "#1B3A7A" }}>
          Put simply: building something like this out of our work will cost you
          far more than licensing it would have.
        </strong>
      </P>

      <H2>If you want to use something of ours</H2>
      <P>
        Permission is often available. Press and analysts can request logo and
        screenshot assets, flight schools and academies can discuss licensing, and
        partners can ask about integrations. Write to{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold underline"
          style={{ color: "#2E6BE5" }}
        >
          {CONTACT_EMAIL}
        </a>{" "}
        and ask. Taking it without asking is the only option that ends badly.
      </P>
      <P>
        Found someone copying EARNWINGS? Tell us at the same address — we follow
        up on every report.
      </P>

      <P>
        This page states our position in plain language. The binding terms are in
        our{" "}
        <Link to="/terms" className="font-semibold underline" style={{ color: "#2E6BE5" }}>
          Terms of Service
        </Link>
        , section 7.
      </P>

      <P>
        {COMPANY_NAME} also builds{" "}
        <a
          href={NEURALWINGS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: "#2E6BE5" }}
        >
          Neural Wings
        </a>
        , the AI-powered aviation management platform for DGCA-approved flight
        training organisations. The same notice applies there.
      </P>
    </PageShell>
  );
}
