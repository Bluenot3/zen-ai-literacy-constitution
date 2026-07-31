import type { Metadata } from "next";
import { LegalPage, PolicySection } from "../legal/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "The refund and payment-dispute terms that apply to ZEN AI Co. services.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      summary="This page presents the refund and payment-dispute rules stated in the ZEN AI Co. Terms & Conditions."
    >
      <PolicySection number={1} title="Payment Terms">
        <p>Users agree to all pricing and payment terms provided at the time of purchase or agreement.</p>
      </PolicySection>
      <PolicySection number={2} title="Refunds">
        <p>Unless explicitly stated otherwise, all payments are final and no refunds will be issued.</p>
      </PolicySection>
      <PolicySection number={3} title="Payment Disputes">
        <p>Payment disputes must be submitted within 30 days of the invoice date. Questions about a payment or invoice can be sent to <a href="mailto:HUXLEY@ZENAI.BIZ">HUXLEY@ZENAI.BIZ</a>.</p>
      </PolicySection>
      <PolicySection number={4} title="Non-Payment">
        <p>ZEN reserves the right to suspend or terminate Services for non-payment, late payment, or unresolved payment disputes.</p>
      </PolicySection>
    </LegalPage>
  );
}
