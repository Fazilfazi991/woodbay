import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/components/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", description: "How Woodbay collects, uses and protects information submitted through its website.", path: "/privacy" });

const sections = [
  {
    title: "Information we collect",
    paragraphs: [
      "When you contact Woodbay, submit a dealer or furniture enquiry, request a factory visit, or verify a voucher, we may collect the information you provide such as your name, phone number, email address, location, business details and enquiry message.",
      "We may also receive basic technical information needed to operate and protect the website, including browser, device, diagnostic and security information.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "We use submitted information to respond to enquiries, review applications, arrange requested services, verify eligible vouchers, provide customer support and maintain the security and reliability of the website.",
      "Woodbay does not use enquiry details for purposes unrelated to the request without an appropriate reason or permission.",
    ],
  },
  {
    title: "Sharing and retention",
    paragraphs: [
      "Information may be processed by trusted service providers that support website hosting, data storage and communications. It may also be disclosed where required by law or necessary to protect users, Woodbay or the public.",
      "We retain information only for as long as reasonably necessary for the relevant enquiry, service, record-keeping, security or legal purpose.",
    ],
  },
  {
    title: "Your choices and contact",
    paragraphs: [
      "You may ask Woodbay to review, correct or delete personal information you previously submitted, subject to applicable legal and operational requirements.",
      "For privacy questions or requests, use the Contact page and identify the request as a privacy enquiry.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      introduction="This policy explains how information submitted through the Woodbay website is handled."
      sections={sections}
    />
  );
}
