import { PageShell } from "../components/PageShell";
import { H2, P, UL, Updated } from "../components/Prose";

export function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      subtitle="The ground rules for using EARNWINGS. By joining the waitlist or using the app, you agree to these terms."
    >
      <Updated date="24 July 2026" />

      <H2>1. Acceptance</H2>
      <P>
        By accessing the EARNWINGS website, joining the waitlist, or using the
        EARNWINGS app ("the Service"), you agree to these Terms of Service. If you
        don't agree, please don't use the Service.
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
        <li>Copy, resell or redistribute our content without permission.</li>
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
        The Service, its content, branding and software are owned by EARNWINGS or
        its licensors. Notes and materials you upload remain yours; you grant us a
        limited licence to process them solely to provide the Service to you.
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
        To the maximum extent permitted by law, EARNWINGS is not liable for any
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
