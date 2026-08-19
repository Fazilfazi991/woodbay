import { ArrowRight, LockKeyhole, ScanLine, ShieldCheck } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { RedeemForm } from "./redeem-form";
export function RedeemPage({ initialCode }: { initialCode: string }) {
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-20 sm:py-28">
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Verify your Woodbay product
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-6xl leading-[.9] sm:text-8xl">
            Verify &amp; Redeem Your Voucher.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Enter the voucher code supplied with your Woodbay product to verify
            the code and complete your redemption.
          </p>
          <a href="#redeem" className="mt-9 inline-block">
            <Button>
              Verify voucher <ArrowRight size={16} />
            </Button>
          </a>
        </Container>
      </section>
      <Section tone="light">
        <Container className="max-w-3xl">
          <div id="redeem" className="grid scroll-mt-16 gap-8">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Voucher verification
              </p>
              <h2 className="font-display mt-3 text-5xl">
                Complete your redemption.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted-dark)]">
                Only an available Woodbay voucher can be redeemed. We will never
                show another customer’s redemption details.
              </p>
            </div>
            <div className="border border-[#d7cebf] bg-white p-5 sm:p-8">
              <RedeemForm initialCode={initialCode} />
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="dark">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <ShieldCheck size={26} className="text-[color:var(--gold)]" />
              <h2 className="font-display mt-5 text-4xl">
                A careful, private verification.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
              Your details are collected only when a valid voucher is redeemed.
              Voucher codes and redemption records are not publicly searchable,
              and a redeemed code cannot be used again.
            </p>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            How it works
          </p>
          <div className="mt-7 grid gap-px bg-[#d7cebf] md:grid-cols-3">
            {[
              [
                ScanLine,
                "Enter your code",
                "Use the code printed with your Woodbay product or open its QR link.",
              ],
              [
                ShieldCheck,
                "We verify it securely",
                "We check its status without exposing voucher or customer records.",
              ],
              [
                LockKeyhole,
                "Redeem once",
                "A valid voucher records your details and is then permanently marked redeemed.",
              ],
            ].map(([Icon, title, text]) => {
              const StepIcon = Icon as typeof ScanLine;
              return (
                <article
                  key={title as string}
                  className="bg-[color:var(--surface-light)] p-6"
                >
                  <StepIcon size={20} className="text-[color:var(--gold)]" />
                  <h2 className="font-display mt-12 text-3xl">
                    {title as string}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted-dark)]">
                    {text as string}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
      <CTASection
        title="Need help with your voucher?"
        description="Our Woodbay team can help if a voucher cannot be redeemed."
        action={{
          label: "Contact Woodbay",
          href: `mailto:${siteConfig.contact.email}`,
        }}
      />
    </>
  );
}
