import { TriangleAlert, Gavel } from "lucide-react";
import {
  LegalShell,
  Section,
  Sub,
  Callout,
  NoteCard,
  Bullets,
  DontList,
  DoList,
} from "../components/Legal";
import { Link } from "../lib/router";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";

const Mail = ({ addr }: { addr: string }) => (
  <a href={`mailto:${addr}`} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {addr}
  </a>
);

const To = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="font-semibold underline" style={{ color: "#2E6BE5" }}>
    {children}
  </Link>
);

export function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Service"
      intro="The ground rules for using EARNWINGS. By joining the waitlist or using the app, you agree to these terms."
      updated="31 July 2026"
    >
      <Section title="1. Acceptance" id="acceptance">
        <p>
          EARNWINGS is built, owned and operated by{" "}
          <strong style={{ color: "#0D1629" }}>{COMPANY_NAME}</strong> ("
          {COMPANY_NAME}", "we", "us", "our"). By accessing the EARNWINGS website,
          joining the waitlist, or using the EARNWINGS app ("the Service"), you
          agree to these Terms of Service. If you don't agree, please don't use the
          Service.
        </p>
      </Section>

      <Section title="2. What EARNWINGS is" id="what">
        <p>
          EARNWINGS is an educational training platform for aspiring pilots,
          offering ground-school content, flight-planning tools, radio-telephony
          practice, an AI study assistant and DGCA mock exams. It is a study aid.
        </p>
      </Section>

      <Section title="3. Not for operational use" id="safety">
        <Callout icon={TriangleAlert} title="Training and study only">
          <p>
            Flight plans, charts, weather, NOTAMs, routes and other outputs are for
            practice and{" "}
            <strong style={{ color: "#0D1629" }}>
              must never be used for real-world flight operations, navigation or
              decision-making.
            </strong>{" "}
            Always rely on official, current sources and your certified flight
            instructor or operator. You are responsible for verifying any
            information before acting on it.
          </p>
        </Callout>
      </Section>

      <Section title="4. Your account" id="account">
        <Bullets
          items={[
            "Provide accurate information and keep your login secure.",
            "You're responsible for activity under your account.",
            "You must be at least 16 years old to use the Service.",
          ]}
        />
      </Section>

      <Section title="5. Acceptable use" id="acceptable-use">
        <p>You agree not to:</p>
        <Bullets
          items={[
            <>Copy, resell or redistribute our content — see section 7 for the full intellectual-property terms.</>,
            "Reverse-engineer, scrape or abuse the Service or its AI features.",
            "Upload unlawful, infringing or harmful content.",
            "Attempt to disrupt or gain unauthorised access to the Service.",
          ]}
        />
      </Section>

      <Section title="6. Payments & credits" id="payments">
        <p>
          Some features are offered under a premium plan or an AI-credit system.
          Prices, inclusions and credit costs are shown before purchase. Except
          where required by law, payments are non-refundable once the relevant
          content or credits have been used.
        </p>
      </Section>

      <Section title="7. Intellectual property" id="ip">
        <p>
          Everything that makes up EARNWINGS — the brand, the software, the study
          material and the way that material is presented — is the exclusive
          property of {COMPANY_NAME}. It is protected under the Copyright Act, 1957,
          the Trade Marks Act, 1999, the Designs Act, 2000, the Patents Act, 1970,
          the Information Technology Act, 2000 and the equivalent laws of other
          countries. Our{" "}
          <To to="/copyright">Intellectual Property Notice</To> says the same thing
          in plain language.
        </p>

        <Sub>7.1 What we own</Sub>
        <Bullets
          items={[
            <><strong style={{ color: "#0D1629" }}>Brand.</strong> The EARNWINGS and {COMPANY_NAME} names, wordmarks, logos, the wings device, our colour system and any confusingly similar mark — whether registered or not.</>,
            <><strong style={{ color: "#0D1629" }}>Software.</strong> The app and website in source and object form, and our architecture, algorithms, data models, APIs, flight-planning and routing engines, radio-telephony engines, and the AI Captain's prompts, pipelines and retrieval logic.</>,
            <><strong style={{ color: "#0D1629" }}>Study material.</strong> All notes, chapters, summaries, diagrams, illustrations, figures, question banks, sample and mock papers, worked solutions, explanations, video lectures and RT scenarios — whether written by us, commissioned by us or licensed to us.</>,
            <><strong style={{ color: "#0D1629" }}>Presentation.</strong> The user interface, screen layouts, navigation and flow, the order and manner in which the syllabus is broken down and taught, the chapter and topic structure, the rank, XP and progression system, and the visual design, animation and overall look and feel.</>,
            <><strong style={{ color: "#0D1629" }}>Media.</strong> Screenshots, screen recordings, demo and marketing videos, promotional images and copy.</>,
            <><strong style={{ color: "#0D1629" }}>Compilation.</strong> Our selection, sequencing, coordination and arrangement of the syllabus and question banks is itself an original work, protected independently of the individual items within it.</>,
          ]}
        />

        <Sub>7.2 What you get</Sub>
        <p>
          We grant you a personal, limited, non-exclusive, non-transferable,
          non-sublicensable and revocable licence to access and use the Service for
          your own individual exam preparation, for as long as your plan or trial is
          active. That is the only right granted. No other right is given, expressly
          or by implication, and all rights not expressly granted are reserved.
        </p>

        <Sub>7.3 What you must not do</Sub>
        <p>You must not, in whole or in part, directly or through anyone else:</p>
        <DontList
          items={[
            "Copy, reproduce, republish, mirror, distribute, sell, rent, sub-licence or otherwise make our content publicly available.",
            "Screenshot, screen-record, photograph, film, download, print, export or transcribe our notes, questions, screens or any other part of the Service and then share, post, sell or circulate it — including in study groups, messaging groups, cloud drives, social media, coaching classes or any other channel.",
            "Circumvent, disable or interfere with any watermark, access control, paging or other technical measure we use to protect our material.",
            "Scrape, crawl, harvest or use bots or any other automated means to extract our content.",
            "Use the Service, its content or its outputs to train, fine-tune, evaluate, benchmark or build any AI or machine-learning model, dataset or index.",
            "Create, launch, publish or help anyone create any app, website, course, book, PDF, coaching material or other product that copies, adapts, translates, re-skins or is substantially derived from our content, structure, sequencing, interface, look and feel, or the way we present information.",
            "Reverse-engineer, decompile, disassemble or attempt to derive our source code, prompts or algorithms.",
            "Use our name, logo or branding, or suggest any endorsement, affiliation or partnership with EARNWINGS or Cephionix.",
            "Share, sell or transfer your account, login or access.",
          ]}
        />

        <Sub>7.4 Building "something like this"</Sub>
        <Callout icon={Gavel}>
          <p>
            To be unambiguous:{" "}
            <strong style={{ color: "#0D1629" }}>
              our notes, our app and the way we present information are the property
              of {COMPANY_NAME}, and they may not be used by anyone else.
            </strong>{" "}
            Recreating EARNWINGS — or any meaningful part of it — by working from our
            screens, screenshots, videos, notes or interface is infringement. That is
            true whether the copying is literal or a paraphrase, translation or
            re-skin; whether it is done by you, by a developer or designer you
            engage, or by an AI tool you direct; and whether or not our name is
            removed. Substantial similarity to our material, our syllabus structure
            or our look and feel will be treated as copying, and we will act on it.
          </p>
        </Callout>

        <Sub>7.5 Your own content</Sub>
        <p>
          Notes and materials that <em>you</em> upload remain yours. You grant us a
          limited, worldwide, royalty-free licence to store, process and display
          them solely to provide the Service to you — for example, so the AI Captain
          can answer from your own notes. We don't claim ownership of them and we
          don't sell them.
        </p>

        <Sub>7.6 Enforcement</Sub>
        <p>
          Breaching this section is a material breach of these terms. We use
          technical measures to deter and detect copying. We may suspend or
          terminate your access immediately and without refund, and pursue every
          remedy available to us — including interim and permanent injunctions,
          damages, an account of profits, delivery-up and destruction of infringing
          copies, costs, criminal complaints where the law allows, and takedown
          notices to app stores, hosting providers, domain registrars and social
          platforms.
        </p>

        <Sub>7.7 Reporting infringement</Sub>
        <p>
          If you see EARNWINGS material being copied, resold or passed off as
          someone else's, tell us at <Mail addr={SUPPORT_EMAIL} />.
        </p>
      </Section>

      <Section title="8. What you may do" id="permitted">
        <DoList
          items={[
            "Study from the notes, questions and tools inside your own account, for your own exam preparation.",
            "Save or print a page for your own personal reference.",
            "Link to us, without framing or implying a relationship that does not exist.",
            "Quote a short extract for genuine news reporting or review, with attribution.",
            "Anything else we have agreed to in writing — just ask us first.",
          ]}
        />
      </Section>

      <Section title="9. AI-generated content" id="ai">
        <p>
          AI features can make mistakes and may produce incomplete or inaccurate
          output. Treat AI responses as a study aid, not authoritative fact, and
          verify anything important against official DGCA and aviation sources.
        </p>
      </Section>

      <Section title="10. Availability" id="availability">
        <p>
          The Service is provided "as is" and "as available" during and after the
          waitlist period. We may change, suspend or discontinue features, and we
          don't guarantee uninterrupted or error-free operation.
        </p>
      </Section>

      <Section title="11. Limitation of liability" id="liability">
        <NoteCard icon={Gavel}>
          <p>
            To the maximum extent permitted by law, {COMPANY_NAME} is not liable for
            any indirect, incidental or consequential damages, or for any loss
            arising from reliance on the Service's educational outputs.
          </p>
        </NoteCard>
      </Section>

      <Section title="12. Changes to these terms" id="changes">
        <p>
          We may update these terms as the product grows. Continued use after
          changes take effect means you accept the updated terms.
        </p>
      </Section>

      <Section title="13. Contact" id="contact">
        <p>
          Questions about these terms? Email <Mail addr={SUPPORT_EMAIL} />.
        </p>
      </Section>
    </LegalShell>
  );
}
