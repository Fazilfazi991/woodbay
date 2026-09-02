import type { Metadata } from "next";
import { Container, Section } from "@/components/layout/primitives";
import { CartPage } from "@/features/cart/cart-page";

export const metadata: Metadata = {
  title: "Cart | WoodBay",
  description: "Review products saved for a WoodBay enquiry.",
};

export default function CartRoute() {
  return (
    <>
      <Section tone="dark" className="pt-14 sm:pt-20">
        <Container>
          <h1 className="font-display text-[3.5rem] leading-[.94] sm:text-[5.5rem]">
            Your product selection.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Review quantities and options, then send the complete selection to
            WoodBay. Pricing and availability are confirmed personally.
          </p>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <CartPage />
        </Container>
      </Section>
    </>
  );
}
