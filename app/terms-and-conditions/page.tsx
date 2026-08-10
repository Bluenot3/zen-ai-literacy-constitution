import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, PolicySection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing access to and use of ZEN AI Co. services and programs.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      summary='These Terms govern access to and use of the platforms, applications, programs, and technologies operated by ZEN AI Co. ("ZEN", "we", "our", or "us"), including zenai.world and related services (collectively, the "Services"). By using the Services, you agree to these Terms.'
    >
      <PolicySection number={1} title="User Responsibilities">
        <p>Users must provide accurate, current information and comply with applicable laws. Users may not access systems without authorization, disrupt the Services, introduce harmful code, reverse engineer proprietary systems, or use the Services for illegal, fraudulent, or harmful activity.</p>
      </PolicySection>
      <PolicySection number={2} title="AI Systems Disclaimer">
        <p>AI outputs may be inaccurate, incomplete, or unpredictable and are not guaranteed. ZEN does not provide professional legal, financial, or medical advice. Users are responsible for reviewing and validating outputs before relying on them.</p>
      </PolicySection>
      <PolicySection number={3} title="Intellectual Property">
        <p>ZEN and its licensors retain ownership of their systems, frameworks, algorithms, designs, content, curriculum, and technologies. Users receive a limited, non-exclusive, non-transferable, revocable license to use the Services as intended.</p>
        <p>Users retain ownership of content they create and grant ZEN a non-exclusive license to use, process, store, and display it as needed to operate and improve the Services.</p>
      </PolicySection>
      <PolicySection number={4} title="Privacy and Security">
        <p>Use of the Services may involve collection and processing necessary for operation, third-party AI providers, and analysis for improvement. ZEN uses reasonable safeguards but cannot guarantee absolute security.</p>
      </PolicySection>
      <PolicySection number={5} title="Educational Programs">
        <p>AI Pioneer, Vanguard, and other ZEN learning programs are educational. Participation does not guarantee employment, income, specific outcomes, or third-party recognition of a credential.</p>
      </PolicySection>
      <PolicySection number={6} title="Payments and Refunds">
        <p>Users agree to pricing shown at purchase or in an agreement. Unless explicitly stated otherwise, payments are final and no refunds will be issued. Payment disputes must be submitted within 30 days of the invoice date. See the <Link href="/refund-policy">Refund Policy</Link>.</p>
      </PolicySection>
      <PolicySection number={7} title="Availability and Liability">
        <p>The Services are provided “as is” and “as available.” To the maximum extent permitted by law, ZEN is not liable for indirect or consequential damages, lost profits, lost data, downtime, or decisions based on AI outputs. ZEN may modify, suspend, or discontinue parts of the Services.</p>
      </PolicySection>
      <PolicySection number={8} title="Termination and Governing Law">
        <p>ZEN may suspend or terminate access for violations, security risks, abuse, or misuse. These Terms are governed by the laws of the Commonwealth of Pennsylvania, with disputes resolved in courts located in York County, Pennsylvania.</p>
      </PolicySection>
    </LegalPage>
  );
}
