import { PageShell } from "../components/PageShell";
import { H2, H3, Notice, P, UL, Updated } from "../components/Prose";
import { COMPANY_NAME, SUPPORT_EMAIL } from "../lib/siteConfig";
import { Link } from "../lib/router";

export function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="The ground rules for using EARNWINGS. By joining the waitlist or using the app, you agree to these terms."
    >
      <Updated date="31 July 2026" />

      <H2>1. Acceptance</H2>
      <P>
        EARNWINGS is built, owned and operated by{" "}
        <strong style={{ color: "#1B3A7A" }}>{COMPANY_NAME}</strong> ("
        {COMPANY_NAME}", "we", "us", "our"). By accessing the EARNWINGS website,
        joining the waitlist, or using the EARNWINGS app ("the Service"), you
        agree to these Terms of Service. If you don't agree, please don't use the
        Service.
      </P>

      <H2>2. What EARNWINGS is</H2>
      <P>
        EARNWINGS is an educational training platform for aspiring pilots,
        offering ground-school content, flight-planning tools, radio-telephony
        practice, an AI study assistant and DGCA mock exams. It is a study aid.
      </P>

      <H2>3. Not for operational use — safety notice</H2>
      <P>
        <strong style={{ color: "#1B3A7A" }}>
          EARNWINGS is for training and study only.
        </strong>{" "}
        Flight plans, charts, weather, NOTAMs, routes and other outputs are for
        practice and must never be used for real-world flight operations,
        navigation or decision-making. Always rely on official, current sources
        and your certified flight instructor or operator. You are responsible for
        verifying any information before acting on it.
      </P>

      <H2>4. Your account</H2>
      <UL>
        <li>Provide accurate information and keep your login secure.</li>
        <li>You're responsible for activity under your account.</li>
        <li>You must be at least 16 years old to use the Service.</li>
      </UL>

      <H2>5. Acceptable use</H2>
      <P>You agree not to:</P>
      <UL>
        <li>
          Copy, resell or redistribute our content — see section 7 for the full
          intellectual-property terms.
        </li>
        <li>Reverse-engineer, scrape or abuse the Service or its AI features.</li>
        <li>Upload unlawful, infringing or harmful content.</li>
        <li>Attempt to disrupt or gain unauthorised access to the Service.</li>
      </UL>

      <H2>6. Payments &amp; credits</H2>
      <P>
        Some features are offered under a premium plan or an AI-credit system.
        Prices, inclusions and credit costs are shown before purchase. Except
        where required by law, payments are non-refundable once the relevant
        content or credits have been used.
      </P>

      <H2>7. Intellectual property</H2>
      <P>
        Everything that makes up EARNWINGS — the brand, the software, the study
        material and the way that material is presented — is the exclusive
        property of {COMPANY_NAME}. It is protected under the Copyright Act, 1957,
        the Trade Marks Act, 1999, the Designs Act, 2000, the Patents Act, 1970,
        the Information Technology Act, 2000 and the equivalent laws of other
        countries. Our{" "}
        <Link to="/copyright" className="font-semibold underline" style={{ color: "#2E6BE5" }}>
          Intellectual Property Notice
        </Link>{" "}
        says the same thing in plain language.
      </P>

      <H3>7.1 What we own</H3>
      <P>This includes, without limitation:</P>
      <UL>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Brand.</strong> The EARNWINGS and{" "}
          {COMPANY_NAME} names, wordmarks, logos, the wings device, our colour
          system and any confusingly similar mark — whether registered or not.
        </li>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Software.</strong> The app and
          website in source and object form, and our architecture, algorithms,
          data models, APIs, flight-planning and routing engines,
          radio-telephony engines, and the AI Captain's prompts, pipelines and
          retrieval logic.
        </li>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Study material.</strong> All notes,
          chapters, summaries, diagrams, illustrations, figures, question banks,
          sample and mock papers, worked solutions, explanations, video lectures
          and RT scenarios — whether written by us, commissioned by us or
          licensed to us.
        </li>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Presentation.</strong> The user
          interface, screen layouts, navigation and flow, the order and manner in
          which the syllabus is broken down and taught, the chapter and topic
          structure, the rank, XP and progression system, and the visual design,
          animation and overall look and feel.
        </li>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Media.</strong> Screenshots, screen
          recordings, demo and marketing videos, promotional images and copy.
        </li>
        <li>
          <strong style={{ color: "#1B3A7A" }}>Compilation.</strong> Our selection,
          sequencing, coordination and arrangement of the syllabus and question
          banks is itself an original work, protected independently of the
          individual items within it.
        </li>
      </UL>

      <H3>7.2 What you get</H3>
      <P>
        We grant you a personal, limited, non-exclusive, non-transferable,
        non-sublicensable and revocable licence to access and use the Service for
        your own individual exam preparation, for as long as your plan or trial is
        active. That is the only right granted. No other right is given, expressly
        or by implication, and all rights not expressly granted are reserved.
      </P>

      <H3>7.3 What you must not do</H3>
      <P>
        You must not, in whole or in part, directly or through anyone else:
      </P>
      <UL>
        <li>
          copy, reproduce, republish, mirror, distribute, sell, rent, sub-licence
          or otherwise make our content publicly available;
        </li>
        <li>
          screenshot, screen-record, photograph, film, download, print, export or
          transcribe our notes, questions, screens or any other part of the
          Service and then share, post, sell or circulate it — including in study
          groups, messaging groups, cloud drives, social media, coaching classes
          or any other channel;
        </li>
        <li>
          circumvent, disable or interfere with any watermark, access control,
          paging or other technical measure we use to protect our material;
        </li>
        <li>
          scrape, crawl, harvest or use bots or any other automated means to
          extract our content;
        </li>
        <li>
          use the Service, its content or its outputs to train, fine-tune,
          evaluate, benchmark or build any AI or machine-learning model, dataset
          or index;
        </li>
        <li>
          create, launch, publish or help anyone create any app, website, course,
          book, PDF, coaching material or other product that copies, adapts,
          translates, re-skins or is substantially derived from our content,
          structure, sequencing, interface, look and feel, or the way we present
          information;
        </li>
        <li>
          reverse-engineer, decompile, disassemble or attempt to derive our source
          code, prompts or algorithms;
        </li>
        <li>
          use our name, logo or branding, or suggest any endorsement, affiliation
          or partnership with EARNWINGS or {COMPANY_NAME}; or
        </li>
        <li>share, sell or transfer your account, login or access.</li>
      </UL>

      <H3>7.4 Building "something like this"</H3>
      <Notice>
        To be unambiguous: <strong style={{ color: "#1B3A7A" }}>our notes, our app
        and the way we present information are the property of {COMPANY_NAME}, and
        they may not be used by anyone else.</strong>{" "}
        Recreating EARNWINGS — or any meaningful part of it — by working from our
        screens, screenshots, videos, notes or interface is infringement. That is
        true whether the copying is literal or a paraphrase, translation or
        re-skin; whether it is done by you, by a developer or designer you engage,
        or by an AI tool you direct; and whether or not our name is removed.
        Substantial similarity to our material, our syllabus structure or our look
        and feel will be treated as copying, and we will act on it.
      </Notice>

      <H3>7.5 Your own content</H3>
      <P>
        Notes and materials that <em>you</em> upload remain yours. You grant us a
        limited, worldwide, royalty-free licence to store, process and display
        them solely to provide the Service to you — for example, so the AI Captain
        can answer from your own notes. We don't claim ownership of them and we
        don't sell them.
      </P>

      <H3>7.6 Enforcement</H3>
      <P>
        Breaching this section is a material breach of these terms. We use
        technical measures to deter and detect copying. We may suspend or
        terminate your access immediately and without refund, and pursue every
        remedy available to us — including interim and permanent injunctions,
        damages, an account of profits, delivery-up and destruction of infringing
        copies, costs, criminal complaints where the law allows, and takedown
        notices to app stores, hosting providers, domain registrars and social
        platforms.
      </P>

      <H3>7.7 Reporting infringement</H3>
      <P>
        If you see EARNWINGS material being copied, resold or passed off as
        someone else's, tell us at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-semibold underline"
          style={{ color: "#2E6BE5" }}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </P>

      <H2>8. AI-generated content</H2>
      <P>
        AI features can make mistakes and may produce incomplete or inaccurate
        output. Treat AI responses as a study aid, not authoritative fact, and
        verify anything important against official DGCA and aviation sources.
      </P>

      <H2>9. Availability</H2>
      <P>
        The Service is provided "as is" and "as available" during and after the
        waitlist period. We may change, suspend or discontinue features, and we
        don't guarantee uninterrupted or error-free operation.
      </P>

      <H2>10. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, {COMPANY_NAME} is not liable for any
        indirect, incidental or consequential damages, or for any loss arising
        from reliance on the Service's educational outputs.
      </P>

      <H2>11. Changes to these terms</H2>
      <P>
        We may update these terms as the product grows. Continued use after
        changes take effect means you accept the updated terms.
      </P>

      <H2>12. Contact</H2>
      <P>
        Questions about these terms? Email{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-semibold underline"
          style={{ color: "#2E6BE5" }}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </P>
    </PageShell>
  );
}
