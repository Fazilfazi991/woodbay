import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { FactoryVisitForm } from "@/features/furniture/components/furniture-forms";
export const metadata: Metadata = {
  title: "Book a Factory Visit | Woodbay Furniture",
  description:
    "Request a Woodbay furniture factory visit and discuss your custom furniture requirements.",
};
export default function Page() {
  return (
    <Section tone="dark">
      <Container className="max-w-3xl py-14">
        <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
          Woodbay Furniture
        </p>
        <h1 className="font-display mt-4 text-6xl">Book a factory visit.</h1>
        <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
          This is a request. A Woodbay team member will confirm any visit
          separately.
        </p>
        <div className="mt-10">
          <FactoryVisitForm />
        </div>
      </Container>
    </Section>
  );
}
