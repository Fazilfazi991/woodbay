import Link from "next/link";
import { ArrowRight, Check, Store } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { dealer } from "@/config/dealers";
import { DealerApplicationForm } from "./dealer-application-form";

export function DealerApplicationPage() {
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-20 sm:py-28">
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            {dealer.hero.eyebrow}
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-6xl leading-[.9] sm:text-8xl">
            {dealer.hero.title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            {dealer.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#application">
              <Button>Apply to become a dealer</Button>
            </a>
            <Link href="/products">
              <Button variant="secondary">
                Explore products <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      <Section tone="light">
        <Container>
          <div className="grid gap-px bg-[#d7cebf] sm:grid-cols-2 lg:grid-cols-3">
            {dealer.benefits.map((benefit) => (
              <article
                key={benefit}
                className="bg-[color:var(--surface-light)] p-6"
              >
                <Check size={19} className="text-[color:var(--gold)]" />
                <h2 className="font-display mt-12 text-3xl">{benefit}</h2>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="dark">
        <Container>
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Who this is for
          </p>
          <h2 className="font-display mt-3 text-5xl">
            A product range for considered businesses.
          </h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dealer.audiences.map((audience) => (
              <p
                key={audience}
                className="border-t border-[color:var(--border-gold)] pt-4 text-sm text-[color:var(--muted)]"
              >
                {audience}
              </p>
            ))}
          </div>
        </Container>
      </Section>
      <div id="application">
        <Section tone="dark">
          <Container className="max-w-3xl">
            <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
              Dealer application
            </p>
            <h2 className="font-display mt-3 text-5xl">
              Tell us about your business.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
              Submitting an application does not create a dealer account or
              confirm approval.
            </p>
            <div className="mt-10">
              <DealerApplicationForm />
            </div>
          </Container>
        </Section>
      </div>
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                What happens next
              </p>
              <h2 className="font-display mt-3 text-5xl">
                A clear, considered start.
              </h2>
            </div>
            <ol className="grid gap-5">
              {dealer.nextSteps.map((step, index) => (
                <li key={step} className="border-t border-[#d7cebf] pt-4">
                  <span className="text-xs text-[color:var(--gold)]">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-sm font-semibold">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-6 border-y border-[#d7cebf] py-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Explore the range
              </p>
              <h2 className="font-display mt-3 text-4xl">
                Products your business can represent.
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {dealer.productLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs font-bold tracking-[.1em] uppercase hover:text-[color:var(--gold)]"
                  >
                    {item.label} <ArrowRight className="inline" size={14} />
                  </Link>
                ))}
              </div>
            </div>
            <aside className="bg-[color:var(--background-deep)] p-7 text-[color:var(--foreground-light)]">
              <Store className="text-[color:var(--gold)]" />
              <h2 className="font-display mt-12 text-3xl">
                Looking for a Furniture Outlet instead?
              </h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                Furniture showroom opportunities have their own application
                path.
              </p>
              <Link href="/furniture/outlets" className="mt-6 inline-block">
                <Button>Furniture outlet enquiry</Button>
              </Link>
            </aside>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Ready to explore a Woodbay partnership?"
        description="Start with a short application and a Woodbay team member will follow up."
        action={{ label: "Apply to become a dealer", href: "#application" }}
      />
    </>
  );
}
