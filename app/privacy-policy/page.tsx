import type { Metadata } from "next";
import { LegalPage, PolicySection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ZEN AI Co. collects, uses, protects, and manages information across its services and educational programs.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary='ZEN AI Co. ("ZEN", "we", "our", or "us") operates artificial intelligence platforms, applications, educational programs, and digital services, including zenai.world and related properties (collectively, the "Services").'
    >
      <PolicySection number={1} title="Information We Collect">
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>Personal information such as name, email address, account credentials, and contact details.</li>
          <li>Usage and technical data such as interactions, IP address, device type, browser, operating system, and session logs.</li>
          <li>AI interaction data such as inputs, prompts, outputs, and interactions with models and agents.</li>
          <li>Educational data such as progress, submissions, and performance within ZEN programs.</li>
          <li>Public wallet addresses and credential-verification records, where applicable.</li>
        </ul>
      </PolicySection>
      <PolicySection number={2} title="How We Use Information">
        <p>We use collected information to provide and improve the Services, deliver tools and educational programs, personalize experiences, analyze reliability, maintain security, prevent fraud, comply with law, and communicate service updates or support responses.</p>
        <p>On zenai.world, privacy-limited analytics measure page views, navigation, calls to action, and announcement engagement. URL query values, intake answers, generated briefs, prompts, and form contents are not sent as analytics event parameters. Analytics does not initialize when a browser signals Do Not Track or Global Privacy Control.</p>
      </PolicySection>
      <PolicySection number={3} title="Artificial Intelligence Systems">
        <p>ZEN Services may use third-party APIs and proprietary AI systems. AI outputs are generated dynamically and may not always be accurate or complete. Inputs may be processed to operate, improve, secure, and evaluate the Services.</p>
      </PolicySection>
      <PolicySection number={4} title="Data Sharing">
        <p>We do not sell personal data. We may share data with service providers, AI model or API providers, educational or institutional partners where applicable, and legal authorities when required by law or necessary to protect rights and safety.</p>
      </PolicySection>
      <PolicySection number={5} title="Retention and Security">
        <p>We retain data only as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and improve performance. We use reasonable administrative, technical, and organizational safeguards, although no system can be guaranteed completely secure.</p>
      </PolicySection>
      <PolicySection number={6} title="Your Rights">
        <p>Depending on your jurisdiction, you may have rights to access, correct, delete, or receive your personal data, or to restrict or object to certain processing. Submit a request to <a href="mailto:HUXLEY@ZENAI.BIZ">HUXLEY@ZENAI.BIZ</a>.</p>
      </PolicySection>
      <PolicySection number={7} title="Children’s Privacy">
        <p>ZEN offers educational programs designed for minors, including users under age 18. Participation may require parental, guardian, or institutional consent in accordance with applicable law.</p>
      </PolicySection>
      <PolicySection number={8} title="Third-Party Services and Changes">
        <p>Our Services may link to third-party platforms. ZEN is not responsible for their content or privacy practices. We may update this policy; continued use after an update constitutes acceptance of the revised policy.</p>
      </PolicySection>
    </LegalPage>
  );
}
