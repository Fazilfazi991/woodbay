import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { FurnitureOutletForm } from "@/features/furniture/components/furniture-forms";
export const metadata: Metadata = {
  title: "Become a Woodbay Furniture Outlet",
  description: "Express interest in a Woodbay Furniture showroom opportunity.",
};
export default function Page() {
  return (
    <Section tone="dark">
      <Container className="max-w-3xl py-14">
        <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
          Furniture showroom opportunity
        </p>
        <h1 className="font-display mt-4 text-6xl">
          Become a Woodbay Furniture Outlet.
        </h1>
        <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
          This form is for Furniture Outlet opportunities only, not the
          Accessories Dealer network.
        </p>
        <div className="mt-10">
          <FurnitureOutletForm />
        </div>
      </Container>
    </Section>
  );
}
