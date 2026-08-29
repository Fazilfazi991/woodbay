import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Compass,
  Gem,
  Lightbulb,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { about } from "@/config/about";
import {
  CTASection,
  Container,
  Eyebrow,
  FeatureItem,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
export function AboutHero() {
  return (
    <PageHero
      eyebrow="About Woodbay"
      title={"Where Design Meets\nPrecision."}
      description="Woodbay creates premium kitchen accessories, wardrobe solutions, furniture, smart products and decor-led interior solutions for modern spaces."
      image={about.assets.hero}
      breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
    />
  );
}
export function BrandIntroduction() {
  return (
    <Section tone="light">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <h2 className="font-display text-5xl leading-[.92] whitespace-pre-line sm:text-6xl">
            {about.intro.title}
          </h2>
          <div className="space-y-5 text-base leading-8 text-[color:var(--muted-dark)]">
            {about.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="relative mt-14 aspect-[16/7] overflow-hidden border border-[#d4c9b8]">
          <Image
            src={about.assets.story}
            alt="Premium Woodbay kitchen interior"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </Section>
  );
}
export function BrandValues() {
  const icons = [Gem, Lightbulb, ShieldCheck, Compass];
  return (
    <Section tone="muted">
      <Container>
        <SectionHeader
          eyebrow="What we stand for"
          title="A clearer standard for everyday spaces."
          description="The principles behind every Woodbay solution."
        />
        <div className="mt-12 grid gap-0 border-y border-[color:var(--border-gold)] md:grid-cols-4">
          {about.values.map((value, index) => (
            <FeatureItem
              key={value.title}
              icon={icons[index]}
              title={value.title}
            >
              {value.description}
            </FeatureItem>
          ))}
        </div>
      </Container>
    </Section>
  );
}
function FounderPortrait() {
  if (about.assets.founderPortrait)
    return (
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={about.assets.founderPortrait}
          alt="Ansar A, Founder and Managing Director"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  return (
    <div className="relative grid aspect-[4/5] place-items-center overflow-hidden border border-[color:var(--border-gold)] bg-[color:var(--background-deep)]">
      <Image
        src={about.assets.interiors}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover opacity-20"
      />
      <div className="relative z-10 text-center">
        <p className="font-display text-7xl text-[color:var(--gold)]">AA</p>
        <p className="mt-4 text-[10px] font-bold tracking-[.2em] text-[#d2cbbf] uppercase">
          Founder portrait pending
        </p>
      </div>
    </div>
  );
}
export function FounderSection() {
  return (
    <Section tone="light">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <FounderPortrait />
          <div>
            <Eyebrow>Leadership</Eyebrow>
            <h2 className="font-display mt-4 text-5xl leading-[.92] whitespace-pre-line sm:text-6xl">
              {about.founder.title}
            </h2>
            <p className="mt-7 border-l-2 border-[color:var(--gold)] pl-5 text-base leading-8 text-[color:var(--muted-dark)]">
              {about.founder.message}
            </p>
            <div className="mt-8">
              <p className="font-display text-3xl">{about.founder.name}</p>
              <p className="mt-1 text-xs font-bold tracking-[.15em] text-[color:var(--gold)] uppercase">
                {about.founder.role}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function VisionMission() {
  return (
    <Section tone="light">
      <Container>
        <div className="grid border-y border-[color:var(--border-gold)] lg:grid-cols-2">
          <article className="py-10 lg:pr-12">
            <Eyebrow>Vision</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-none">
              Better environments, thoughtfully shaped.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[color:var(--muted)]">
              {about.vision}
            </p>
          </article>
          <article className="border-t border-[color:var(--border-gold)] py-10 lg:border-t-0 lg:border-l lg:pl-12">
            <Eyebrow>Mission</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-none">
              Useful innovation, beautifully delivered.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[color:var(--muted)]">
              {about.mission}
            </p>
          </article>
        </div>
      </Container>
    </Section>
  );
}
export function DivisionsAndFurniture() {
  return (
    <Section tone="light">
      <Container>
        <SectionHeader
          eyebrow="The Woodbay ecosystem"
          title="Solutions that meet the whole space."
          description="From the smallest hardware detail to the larger interior experience."
        />
        <div className="mt-12 grid gap-px bg-[#d8cebf] sm:grid-cols-2 lg:grid-cols-4">
          {about.divisions.map((division) => (
            <Link
              key={division.title}
              href={division.href}
              className="group bg-[color:var(--surface-light)] p-6 hover:bg-white"
            >
              <PackageCheck
                size={22}
                strokeWidth={1.2}
                className="text-[color:var(--gold)]"
              />
              <h3 className="font-display mt-14 text-3xl leading-none">
                {division.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[color:var(--muted-dark)]">
                {division.description}
              </p>
              <ArrowRight
                size={17}
                className="mt-7 text-[color:var(--gold)] transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
        <div className="mt-14 grid gap-7 bg-[color:var(--background-deep)] p-7 text-[color:var(--foreground-light)] lg:grid-cols-[1fr_.8fr] lg:p-10">
          <div>
            <Eyebrow>Factory Direct Furniture</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-none">
              Furniture made around the way you live.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
              Woodbay’s furniture offering connects wardrobes, bedrooms and
              modular interiors with direct consultation and considered design.
            </p>
          </div>
          <div className="flex items-center">
            <Link href="/furniture">
              <Button>
                Explore Furniture <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function ManufacturingStory() {
  return (
    <Section tone="dark">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Built with purpose</Eyebrow>
            <h2 className="font-display mt-4 text-5xl leading-[.92] sm:text-6xl">
              Precision at Every Stage.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[color:var(--muted)]">
              From product development and material selection through finishing,
              quality checking, packaging and distribution, Woodbay’s approach
              is built around disciplined attention to detail.
            </p>
            <div className="mt-8 flex flex-col border-y border-[color:var(--border-gold)] sm:flex-row sm:items-center">
              {about.process.map((step, index) => (
                <div
                  className="flex flex-1 items-center gap-3 border-b border-[color:var(--border-gold)] py-4 text-xs font-bold tracking-[.1em] uppercase last:border-0 sm:border-b-0"
                  key={step}
                >
                  <span className="text-[color:var(--gold)]">0{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--border-gold)]">
            <Image
              src={about.assets.manufacturing}
              alt="Woodbay manufacturing process"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function JourneyAndWhy() {
  return (
    <>
      <Section tone="light">
        <Container>
          <SectionHeader
            eyebrow="Our story"
            title="Built by expanding the possibilities of the interior."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {about.journey.map((stage, index) => (
              <article
                key={stage.title}
                className="border-t border-[#b8a070] pt-5"
              >
                <p className="font-display text-4xl text-[color:var(--gold)]">
                  0{index + 1}
                </p>
                <h3 className="mt-7 text-sm font-bold tracking-[.11em] uppercase">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted-dark)]">
                  {stage.text}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="muted">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <SectionHeader
              eyebrow="Why Woodbay"
              title="Practical detail. Lasting confidence."
              description="A product philosophy designed to make every stage feel more considered."
            />
            <div className="grid gap-x-8 border-t border-[color:var(--border-gold)] sm:grid-cols-2">
              {about.whyChoose.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-[color:var(--border-gold)] py-5 text-sm"
                >
                  <Check size={17} className="text-[color:var(--gold)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
export function LocationAndCta() {
  return (
    <>
      <Section tone="light">
        <Container>
          <div className="grid gap-8 border-y border-[#d1c6b5] py-10 md:grid-cols-2">
            <div>
              <Eyebrow>Presence</Eyebrow>
              <h2 className="font-display mt-4 text-4xl leading-none">
                A place for ideas to take shape.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {about.locations.map((location) => (
                <article key={location.title}>
                  <MapPin
                    size={19}
                    strokeWidth={1.2}
                    className="text-[color:var(--gold)]"
                  />
                  <h3 className="mt-4 text-xs font-bold tracking-[.13em] uppercase">
                    {location.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-dark)]">
                    {location.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Discover What Woodbay Can Bring to Your Space."
        description="Explore considered interior solutions built around design, performance and the way people live."
        action={{ label: "Explore Products", href: "/products" }}
      />
    </>
  );
}
