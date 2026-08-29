import { Check, Compass, Layers3 } from "lucide-react";
import { Container, Section } from "@/components/layout/primitives";
import type { ProductContent } from "../data/content";

export function ProductEditorial({ content }: { content: ProductContent }) {
  return (
    <>
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <section aria-labelledby="about-product">
              <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                {content.family}
              </p>
              <h2
                id="about-product"
                className="font-display mt-3 text-4xl sm:text-5xl"
              >
                About this product
              </h2>
              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[color:var(--muted-dark)]">
                {content.overview}
              </p>
            </section>
            <section aria-labelledby="why-choose">
              <h2 id="why-choose" className="font-display text-4xl">
                Why choose this solution
              </h2>
              <ul className="mt-6 divide-y divide-[color:var(--border-light)] border-y border-[color:var(--border-light)]">
                {content.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex min-h-12 items-center gap-3 py-3 text-sm"
                  >
                    <Check
                      size={17}
                      className="shrink-0 text-[color:var(--gold)]"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </Section>
      <Section tone="muted">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            <section aria-labelledby="product-features">
              <Layers3 size={22} className="text-[color:var(--gold)]" />
              <h2 id="product-features" className="font-display mt-4 text-4xl">
                Product features
              </h2>
              <ul className="mt-6 grid gap-3 text-sm leading-6 text-[color:var(--muted-dark)] sm:grid-cols-2">
                {content.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-l border-[color:var(--gold)] pl-4"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="ideal-for">
              <Compass size={22} className="text-[color:var(--gold)]" />
              <h2 id="ideal-for" className="font-display mt-4 text-4xl">
                Ideal for
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {content.applications.map((application) => (
                  <span
                    key={application}
                    className="border border-[color:var(--border-light)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm"
                  >
                    {application}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </Section>
      <Section tone="dark">
        <Container>
          <div
            className={`grid gap-10 ${content.planningNote ? "lg:grid-cols-2 lg:gap-20" : "max-w-2xl"}`}
          >
            <section aria-labelledby="design-note">
              <h2 id="design-note" className="font-display text-4xl">
                Designed for considered spaces
              </h2>
              <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
                {content.designNote}
              </p>
            </section>
            {content.planningNote && (
              <section
                aria-labelledby="planning-note"
                className="border-t border-[color:var(--border-gold)] pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
              >
                <h2 id="planning-note" className="font-display text-4xl">
                  Planning your installation
                </h2>
                <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
                  {content.planningNote}
                </p>
              </section>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
