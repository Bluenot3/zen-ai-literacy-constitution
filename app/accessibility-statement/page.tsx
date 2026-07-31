import type { Metadata } from "next";
import { LegalPage, PolicySection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "How to request accessibility assistance or report a barrier.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      summary="ZEN AI Co. wants its digital services and educational experiences to be usable by as many people as possible."
    >
      <PolicySection number={1} title="Our Approach">
        <p>Accessibility is an ongoing part of how we review and improve digital experiences as our platforms, programs, content, and tools evolve.</p>
      </PolicySection>
      <PolicySection number={2} title="Request Assistance or Report a Barrier">
        <p>If you encounter an accessibility barrier or need help accessing ZEN content or a service, email <a href="mailto:HUXLEY@ZENAI.BIZ">HUXLEY@ZENAI.BIZ</a>.</p>
        <p>Please include the page, program, or service; a short description of the barrier or help needed; and your browser, device, or preferred accessible format when relevant.</p>
      </PolicySection>
    </LegalPage>
  );
}
