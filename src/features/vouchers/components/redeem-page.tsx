import { ShieldCheck } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import type { VoucherOption } from "../options";
import { RedeemForm } from "./redeem-form";

export function RedeemPage({ initialCode, products, dealers }: { initialCode: string; products: VoucherOption[]; dealers: VoucherOption[] }) {
  return (
    <div className="redeem-page">
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-14 sm:py-20">
          <h1 className="font-display max-w-3xl text-[2.5rem] leading-[.94] sm:text-7xl">
            Register your WoodBay voucher.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Enter the code supplied with your product. Registration is immediate and each voucher can be used once.
          </p>
        </Container>
      </section>
      <Section tone="light">
        <Container className="max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <ShieldCheck className="text-[color:var(--gold)]" />
              <h2 className="font-display mt-5 text-4xl">A secure, one-time registration.</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted-dark)]">
                Your details are checked and recorded securely. A successful submission permanently registers the voucher to the selected product and dealer.
              </p>
            </div>
            <div className="border border-[#d7cebf] bg-white p-5 sm:p-8">
              <RedeemForm key={initialCode} initialCode={initialCode} products={products} dealers={dealers} />
            </div>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Need help with verification?"
        description="Contact Woodbay if you are unsure which reference or product details to provide."
        action={{ label: "Contact Woodbay", href: "/contact" }}
      />
    </div>
  );
}
