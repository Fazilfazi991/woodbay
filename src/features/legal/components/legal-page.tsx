import { Container, Section } from "@/components/layout/primitives";

export type LegalSection = {
  title: string;
  paragraphs: readonly string[];
};

export function LegalPage({
  title,
  introduction,
  sections,
}: {
  title: string;
  introduction: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-14 sm:py-20 lg:py-28">
          <p className="text-[11px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Woodbay policies
          </p>
          <h1 className="font-display mt-4 text-[2.6rem] leading-none sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            {introduction}
          </p>
        </Container>
      </section>
      <Section tone="light">
        <Container className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[.08em] text-[color:var(--gold)] uppercase">
            Last updated 29 August 2026
          </p>
          <div className="mt-8 divide-y divide-[color:var(--border-light)] border-y border-[color:var(--border-light)]">
            {sections.map((section) => (
              <section key={section.title} className="py-7 sm:py-9">
                <h2 className="font-display text-3xl sm:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-4 grid max-w-[72ch] gap-4 text-sm leading-7 text-[color:var(--muted-dark)] sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
