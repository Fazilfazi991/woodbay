import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { FurnitureDesignForm } from "@/features/furniture/components/furniture-forms";
export const metadata: Metadata = {
  title: "Design Your Furniture | Woodbay",
  description:
    "Share your custom furniture requirements, approximate dimensions and finish preferences with Woodbay.",
};
export default function Page() {
  return (
    <Section tone="dark">
      <Container className="max-w-3xl py-14">
        <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
          Custom furniture enquiry
        </p>
        <h1 className="font-display mt-4 text-[2.5rem] leading-[.94] sm:text-6xl">Design your furniture.</h1>
        <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
          Selections are a consultation starting point, not a manufacturing
          order.
        </p>
        <div className="mt-10">
          <FurnitureDesignForm />
        </div>
      </Container>
    </Section>
  );
}
