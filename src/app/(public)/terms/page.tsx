import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/components/legal-page";

export const metadata: Metadata = {
  title: "Website Terms | Woodbay",
  description: "Terms governing use of the Woodbay website and enquiries.",
};

const sections = [
  {
    title: "Using this website",
    paragraphs: [
      "You may use the Woodbay website to learn about products and services, locate dealers, submit genuine enquiries and access other published information. You must not misuse the website, attempt unauthorised access, interfere with its operation or submit unlawful or misleading content.",
    ],
  },
  {
    title: "Product and service information",
    paragraphs: [
      "Images, descriptions, dimensions, finishes and availability are provided for general information and may change. Screen colours and photography may not exactly represent physical finishes.",
      "An enquiry, application or form submission does not create an order, appointment, dealership, outlet appointment or other binding agreement. Woodbay will confirm applicable commercial terms separately where relevant.",
    ],
  },
  {
    title: "Intellectual property",
    paragraphs: [
      "The Woodbay name, branding, website design, text, photography, catalogues and other published materials are owned by or licensed to Woodbay. They may not be copied, republished or commercially used without permission, except as allowed by law.",
    ],
  },
  {
    title: "Availability and responsibility",
    paragraphs: [
      "We work to keep the website accurate and available, but do not guarantee uninterrupted access or that every item will always be error-free or available. To the extent permitted by law, Woodbay is not responsible for indirect loss arising solely from reliance on general website information.",
      "These terms do not exclude rights or responsibilities that cannot lawfully be excluded. Questions about these terms can be sent through the Contact page.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      title="Website Terms"
      introduction="These terms apply when you browse the Woodbay website or submit an enquiry through it."
      sections={sections}
    />
  );
}
