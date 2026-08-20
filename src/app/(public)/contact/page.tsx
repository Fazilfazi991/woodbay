import Link from "next/link";
import { ArrowRight, Building2, Ruler, Store } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";

const contactPaths = [
  {
    Icon: Ruler,
    title: "Plan custom furniture",
    description:
      "Tell us about a furniture requirement and preferred finishes.",
    href: "/furniture/design",
    label: "Design furniture",
  },
  {
    Icon: Building2,
    title: "Arrange a factory visit",
    description:
      "Request a visit and the Woodbay team will confirm the next available step.",
    href: "/furniture/factory-visit",
    label: "Book a visit",
  },
  {
    Icon: Store,
    title: "Discuss a dealer opportunity",
    description: "Share details about your business and dealer interest.",
    href: "/dealers/become-a-dealer",
    label: "Become a dealer",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <Section tone="dark" className="pt-14 sm:pt-20">
        <Container className="max-w-4xl">
          <Eyebrow>Woodbay</Eyebrow>
          <h1 className="font-display mt-4 text-[clamp(3rem,10vw,5.5rem)] leading-[.9]">
            Start a conversation.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Choose the route that best fits your project, furniture requirement,
            factory visit, or dealer enquiry.
          </p>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {contactPaths.map(({ Icon, title, description, href, label }) => (
              <article
                key={href}
                className="flex min-h-72 flex-col border border-[#d7cebf] bg-white p-7"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-[color:var(--gold)]"
                />
                <h2 className="font-display mt-12 text-4xl leading-none">
                  {title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted-dark)]">
                  {description}
                </p>
                <Link href={href} className="mt-auto pt-7">
                  <Button variant="light">
                    {label} <ArrowRight size={15} />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
