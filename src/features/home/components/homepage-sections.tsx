import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  CirclePlay,
  Handshake,
  MapPin,
  Sparkles,
} from "lucide-react";
import { homepage } from "@/config/homepage";
import {
  CTASection,
  Container,
  Eyebrow,
  ProductCategoryCard,
  Section,
  SectionHeader,
} from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { getPublishedProjectPreviews } from "@/features/projects/data";
import { productDivisions } from "@/features/products/data/taxonomy";
import { getHomepageCatalogueProducts } from "@/features/products/data/catalogue";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import type { CatalogueProduct } from "@/features/products/types";

const solutionLinks = [
  {
    title: "Pantry",
    href: "/products/kitchen-wardrobe-accessories?subcategory=pantry-solutions",
    image: "/images/categories/pantry-solutions.png",
    imageClassName: "object-cover object-center",
  },
  {
    title: "Pull-Outs",
    href: "/products/kitchen-wardrobe-accessories?subcategory=pullout-solutions",
    image: "/images/categories/pullout-solutions.png",
    imageClassName: "object-cover object-center",
  },
  {
    title: "Wardrobe",
    href: "/products/kitchen-wardrobe-accessories?subcategory=wardrobe-series",
    image: "/images/categories/wardrobe-accessories.png",
    imageClassName: "object-cover object-center",
  },
  {
    title: "Hardware",
    href: "/products/hardware-fittings?subcategory=cabinet-hinges",
    image: "/images/products/full-ss-3d-304-hydraulic-hinge.webp",
    imageClassName: "object-contain object-center p-2",
  },
  {
    title: "Profiles",
    href: "/products/hardware-fittings?subcategory=aluminium-profiles",
    image: "/images/products/j-gola.webp",
    imageClassName: "object-contain object-center p-2",
  },
  {
    title: "Wallpaper",
    href: "/products/home-decor?subcategory=wallpaper",
    image: "/images/products/wallpaper.webp",
    imageClassName: "object-cover object-center",
  },
  {
    title: "Smart Furniture",
    href: "/products/smart-furniture",
    image: "/images/products/smart-wifi-side-table.webp",
    imageClassName: "object-cover object-center",
  },
  {
    title: "Smart Sinks",
    href: "/products/kitchen-wardrobe-accessories?subcategory=smart-kitchen-waterfall-sinks",
    image: "/images/products/waterfall-sink.webp",
    imageClassName: "object-cover object-center",
  },
] as const;

const divisionPresentation = {
  "kitchen-wardrobe-accessories": {
    title: "Smart Kitchen & Wardrobe Solutions",
    mobileTitle: "Smart Kitchen & Wardrobe",
    mobileDescription: "Pantry, pullout and wardrobe solutions.",
    image: "/images/products/satin-pantry.webp",
    imageClassName: "object-[center_48%]",
    containImageOnMobile: false,
  },
  "hardware-fittings": {
    title: "Hardware Fittings & Aluminium Profiles",
    mobileTitle: "Hardware & Profiles",
    mobileDescription: "Fittings, hinges and aluminium systems.",
    image: "/images/products/full-ss-3d-304-hydraulic-hinge.webp",
    imageClassName: "object-center",
    containImageOnMobile: true,
  },
  "smart-furniture": {
    title: "Smart Furniture",
    mobileTitle: "Smart Furniture",
    mobileDescription: "Connected furniture for modern living.",
    image: "/images/products/extendable-study-table-box-desk.webp",
    imageClassName: "object-center",
    containImageOnMobile: false,
  },
  "home-decor": {
    title: "Home Decor",
    mobileTitle: "Home Decor",
    mobileDescription: "Wall and interior finishing solutions.",
    image: "/images/homepage/home-decor-category-v2.png",
    imageClassName: "object-center",
    containImageOnMobile: false,
  },
} as const;

export function HeroSection({
  variant = "default",
}: {
  variant?: "default" | "light";
}) {
  const light = variant === "light";
  return (
    <section
      className={`relative isolate min-h-[72svh] overflow-hidden ${light ? "bg-[#f2faf3] text-[#171717]" : "bg-[color:var(--background-dark)] text-[color:var(--foreground-light)]"} sm:min-h-[calc(88svh-5rem)] lg:min-h-[calc(92vh-5rem)]`}
    >
      <Image
        src={homepage.assets.hero}
        alt="Contemporary dark Woodbay kitchen interior"
        fill
        priority
        sizes="100vw"
        className={`-z-20 object-cover object-[63%_center] ${light ? "opacity-25" : ""}`}
      />
      <div
        className={`absolute inset-0 -z-10 ${light ? "bg-[linear-gradient(105deg,rgba(250,250,247,.98)_0%,rgba(250,250,247,.91)_49%,rgba(242,250,243,.58)_100%)]" : "bg-[linear-gradient(90deg,rgba(9,10,8,.94)_0%,rgba(9,10,8,.74)_45%,rgba(9,10,8,.18)_100%)]"}`}
      />
      <Container className="flex min-h-[72svh] flex-col justify-center py-12 sm:min-h-[calc(88svh-5rem)] sm:py-16 lg:min-h-[calc(92vh-5rem)] lg:py-24">
        <div className="max-w-2xl">
          <Eyebrow>{homepage.hero.eyebrow}</Eyebrow>
          <h1 className="font-display mt-5 text-[2.35rem] leading-[.96] whitespace-pre-line sm:text-6xl lg:text-[5.75rem]">
            {homepage.hero.title}
          </h1>
          <p
            className={`mt-7 max-w-xl text-base leading-7 ${light ? "text-[#626262]" : "text-[#d7d1c6]"}`}
          >
            {homepage.hero.description}
          </p>
          <div className="mt-8 flex justify-center sm:mt-9 sm:justify-start">
            <Link href="/products" className="inline-block">
              <Button
                variant={light ? "primary" : "gold"}
                className={`h-12 w-auto !px-5 py-0 !text-[13px] !tracking-[.08em] sm:h-auto sm:!px-6 sm:py-3 sm:!text-[11px] sm:!tracking-[.14em] ${light ? "home-two-button" : ""}`}
              >
                Explore Products <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      <TrustStrip light={light} />
    </section>
  );
}
function TrustStrip({ light = false }: { light?: boolean }) {
  const icons = [Award, Sparkles, Check, Handshake];
  return (
    <div
      className={`relative z-[41] py-4 sm:py-5 lg:py-6 ${light ? "bg-white" : "bg-[#11120e]"}`}
    >
      <Container>
        <div className="grid grid-cols-2 border border-[color:var(--border-gold)] lg:grid-cols-4">
          {homepage.trust.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={item.title}
                className={`flex min-h-[4.5rem] items-center gap-3 px-3 py-3 lg:min-h-[6.5rem] lg:items-start lg:px-5 lg:py-5 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b" : ""} ${index < 3 ? "lg:border-r" : "lg:border-r-0"} border-[color:var(--border-gold)] lg:border-b-0`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.25}
                  className="shrink-0 text-[color:var(--gold)] lg:mt-0.5"
                />
                <div className="min-w-0">
                  <h2 className="text-[10px] leading-4 font-bold tracking-[.1em] uppercase sm:text-[11px] lg:text-xs">
                    {item.title}
                  </h2>
                  <p
                    className={`mt-1.5 hidden text-xs leading-5 lg:block ${light ? "text-[#626262]" : "text-[#bcb6ac]"}`}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
export function CategoriesSection() {
  return (
    <Section tone="light">
      <Container>
        <div>
          <SectionHeader
            eyebrow="Our Products"
            title="Designed for Modern Living"
            description="Considered solutions for kitchens, wardrobes and contemporary interiors."
          />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {productDivisions.map((category) => {
            const presentation =
              divisionPresentation[
                category.slug as keyof typeof divisionPresentation
              ];
            return (
              <ProductCategoryCard
                key={category.slug}
                title={presentation.title}
                mobileTitle={presentation.mobileTitle}
                href={`/products/${category.slug}`}
                description={category.description}
                mobileDescription={presentation.mobileDescription}
                image={presentation.image}
                imageClassName={presentation.imageClassName}
                containImageOnMobile={presentation.containImageOnMobile}
                tone="light"
              />
            );
          })}
        </div>
        <nav
          aria-label="Explore products by solution"
          className="mt-12 border-t border-[#d7cebf] pt-8"
        >
          <p className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Explore by solution
          </p>
          <div className="category-chips-scroll -mx-5 mt-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-8 md:gap-3 md:px-0">
            {solutionLinks.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group block w-[104px] shrink-0 snap-start md:w-auto"
              >
                <span className="relative block aspect-square overflow-hidden border border-[#d7cebf] bg-white transition-colors group-hover:border-[color:var(--gold)]">
                  <Image
                    src={area.image}
                    alt={`${area.title} solutions by Woodbay`}
                    fill
                    sizes="(max-width: 767px) 104px, 12vw"
                    className={`${area.imageClassName} transition duration-500 group-hover:scale-[1.025]`}
                  />
                </span>
                <span className="mt-2 flex min-h-11 items-start justify-between gap-1 text-[11px] leading-4 font-semibold text-[color:var(--foreground-dark)]">
                  {area.title}
                  <ArrowRight
                    size={12}
                    className="mt-0.5 shrink-0 text-[color:var(--gold)] transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </Container>
    </Section>
  );
}
export async function FeaturedProductsSection() {
  let products: CatalogueProduct[] = [];
  try {
    products = await getHomepageCatalogueProducts();
  } catch {
    /* safe empty state below */
  }
  return (
    <Section tone="muted">
      <Container>
        <div>
          <SectionHeader
            eyebrow="Featured products"
            title="Browse the Woodbay catalogue."
            description="A focused selection of catalogue products, ready to explore or enquire about."
          />
        </div>
        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:mt-12 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-[color:var(--border-light)] bg-[color:var(--surface-elevated)] p-6 text-sm text-[color:var(--muted-dark)]">
            Featured catalogue products will appear here as they are published.
          </p>
        )}
        <Link
          href="/products"
          className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[color:var(--foreground-dark)] text-xs font-bold tracking-[.12em] text-[color:var(--foreground-dark)] uppercase transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] sm:mt-8"
        >
          Browse All Products <ArrowRight size={15} />
        </Link>
      </Container>
    </Section>
  );
}
export function ManufacturingSection({ variant }: { variant?: "home-two" }) {
  return (
    <Section
      tone="dark"
      className={`border-t border-[color:var(--border-dark)] ${variant === "home-two" ? "home-two-manufacturing" : ""}`}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Global Manufacturing Excellence</Eyebrow>
            <h2 className="font-display mt-4 text-5xl leading-[.93] sm:text-6xl">
              Precision Manufacturing.
              <br />
              Trusted Worldwide.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
              Woodbay is built around careful production, consistent quality
              control, precision engineering and dependable distribution—so
              every detail arrives ready for the space it is made for.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-7 gap-y-1">
              {[
                "Manufacturing Quality",
                "Reliable Supply",
                "Product Innovation",
                "Dealer Network",
              ].map((label) => (
                <div
                  className="border-t border-[color:var(--border-gold)] py-4"
                  key={label}
                >
                  <p className="text-xs leading-5 tracking-[.11em] text-[#d0cac0] uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="group relative aspect-[4/3] overflow-hidden border border-[color:var(--border-gold)]">
              <Image
                src={homepage.assets.factory}
                alt="Woodbay precision manufacturing facility"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/20">
                <span
                  aria-label="Factory tour preview"
                  className="grid size-16 place-items-center rounded-full border border-[color:var(--gold)] bg-black/30 text-[color:var(--gold)]"
                >
                  <CirclePlay size={30} strokeWidth={1.2} />
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-bold tracking-[.1em] text-[color:var(--muted)] uppercase sm:grid-cols-4">
              {[
                "Precision Production",
                "Quality Inspection",
                "Packaging",
                "Distribution",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function SmartSection() {
  const smartFeatures = [
    {
      title: "Smart Furniture",
      text: "Connected comfort, seamlessly built into everyday furniture.",
      image: "/images/products/smart-wifi-side-table.webp",
      href: "/products/smart-furniture",
    },
    {
      title: "Smart Waterfall Sinks",
      text: "Advanced preparation, rinsing and utility in one refined workspace.",
      image: "/images/products/waterfall-sink.webp",
      href: "/products/kitchen-wardrobe-accessories?subcategory=smart-kitchen-waterfall-sinks",
    },
  ] as const;
  return (
    <Section tone="light" className="lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(17rem,.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="max-w-md lg:pb-8">
            <SectionHeader
              eyebrow="Smart Products"
              title="Innovation, quietly integrated."
              description="Technology designed to disappear into the way you live."
            />
            <Link
              href="/products/smart-furniture"
              className="mt-8 flex justify-center sm:inline-flex"
            >
              <Button variant="light">
                Explore Smart Products <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
          <div className="grid items-start gap-5 sm:grid-cols-12 sm:gap-6">
            {smartFeatures.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group block ${index === 0 ? "sm:col-span-7" : "sm:col-span-5 sm:mt-20"}`}
              >
                <div
                  className={`relative overflow-hidden bg-[#ddd6c9] ${index === 0 ? "aspect-[5/4]" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.title} by Woodbay`}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 640px) 100vw, 40vw"
                        : "(max-width: 640px) 100vw, 28vw"
                    }
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="border-b border-[#cfc5b4] py-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={`font-display leading-none ${index === 0 ? "text-4xl" : "text-3xl"}`}
                    >
                      {item.title}
                    </h3>
                    <ArrowRight
                      size={18}
                      className="shrink-0 text-[color:var(--gold)] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--muted-dark)]">
                    {item.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function DecorAndFurnitureSection({
  variant,
}: {
  variant?: "home-two";
}) {
  return (
    <>
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--border-gold)]">
              <Image
                src={homepage.assets.interiors}
                alt="Woodbay decor interior with material-led finishes"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
            </div>
            <div>
              <SectionHeader
                eyebrow="Woodbay Decor"
                title="Elevate your space with premium decor solutions."
                description="A carefully curated direction for surfaces, lighting and material-led visual character."
              />
              <div className="mt-8 grid grid-cols-2 gap-y-3 text-sm text-[color:var(--muted-dark)]">
                {homepage.decor.map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <span className="size-1 bg-[color:var(--gold)]" />
                    {item}
                  </span>
                ))}
              </div>
              <Link
                href="/products/home-decor"
                className="mt-9 flex justify-center sm:inline-flex"
              >
                <Button variant="light">
                  Explore Decor <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div
            className={`relative overflow-hidden bg-[color:var(--background-deep)] px-6 py-14 text-[color:var(--foreground-light)] sm:px-10 lg:px-16 lg:py-20 ${variant === "home-two" ? "home-two-factory-promise" : ""}`}
          >
            <Image
              src="/images/home-2/hero-interiors.png"
              alt="Custom furniture interior"
              fill
              sizes="100vw"
              className={
                variant === "home-two"
                  ? "object-cover opacity-55"
                  : "object-cover opacity-30"
              }
            />
            <div className="relative z-10 max-w-2xl">
              <Eyebrow>Factory Direct Furniture</Eyebrow>
              <h2 className="font-display mt-4 text-5xl leading-[.92] sm:text-6xl">
                Designed Around Your Space.
                <br />
                Built Direct from Our Factory.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--furniture-copy)]">
                Bring your vision closer with premium materials, considered
                design and direct consultation from the factory.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-stretch">
                <Link href="/furniture">
                  <Button>
                    Explore Furniture <ArrowRight size={15} />
                  </Button>
                </Link>
                <Link href="/furniture/factory-visit">
                  <Button variant="secondary">Book Factory Visit</Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
export async function ProjectsSection() {
  let projects: Awaited<ReturnType<typeof getPublishedProjectPreviews>> = [];
  let unavailable = false;

  try {
    projects = await getPublishedProjectPreviews();
  } catch {
    // Projects are supplementary homepage content. A failed public query must
    // not take down the whole site while the data service recovers.
    unavailable = true;
  }

  return (
    <Section tone="muted">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Our Projects"
            title="Spaces made personal."
            description="A glimpse of the places where Woodbay details make a difference."
          />
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-2 text-xs font-bold tracking-[.12em] text-[color:var(--foreground-dark)] uppercase hover:text-[color:var(--gold)] sm:inline-flex"
          >
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>
        {unavailable ? (
          <p className="mt-12 border border-[color:var(--border-light)] bg-[color:var(--surface-elevated)] p-6 text-sm text-[color:var(--muted-dark)]">
            Project highlights are temporarily unavailable. Please check back
            shortly.
          </p>
        ) : projects.length === 0 ? (
          <p className="mt-12 border border-[color:var(--border-light)] bg-[color:var(--surface-elevated)] p-6 text-sm text-[color:var(--muted-dark)]">
            New Woodbay project highlights will appear here soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project) => {
              const image = project.featured_image;
              const canPreview =
                image && (image.startsWith("http") || image.startsWith("/"));

              return (
                <Link
                  href={`/projects/${project.slug}`}
                  key={project.id}
                  className="group relative aspect-[3/4] overflow-hidden border border-[color:var(--border-dark)] bg-[color:var(--surface-dark)]"
                >
                  {canPreview ? (
                    <Image
                      src={image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <span className="font-display text-3xl tracking-[.12em] text-[color:var(--gold)]">
                        WOODBAY
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-5">
                    <p className="mb-2 text-[10px] font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                      {project.category}
                    </p>
                    <h3 className="font-display text-3xl text-white">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
export function DealerAndCatalogueSection() {
  return (
    <>
      <Section tone="light" className="!py-8 sm:!py-16 md:!py-20 lg:!py-28">
        <Container>
          <div className="grid gap-7 border-y border-[#cfc5b4] py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <Eyebrow>Woodbay Dealer Network</Eyebrow>
              <h2 className="font-display mt-4 text-[2.6rem] leading-none sm:text-5xl">
                Find Woodbay Near You
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted-dark)]">
                Discover authorised Woodbay accessories dealers in your area, or
                join our growing dealer network.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-[auto_auto] lg:justify-self-end">
              <Link href="/dealers" className="min-w-0">
                <Button
                  variant="gold"
                  aria-label="Find a dealer"
                  className="h-13 w-full !gap-1.5 !px-2 py-0 !text-[10px] !tracking-[.04em] whitespace-nowrap min-[360px]:!text-[12px] min-[390px]:!text-[13px] sm:h-14 sm:!gap-2 sm:!px-6 sm:!text-[11px] sm:!tracking-[.14em]"
                >
                  <MapPin size={14} className="hidden sm:block" />
                  <span className="sm:hidden">Find Dealer</span>
                  <span className="hidden sm:inline">Find a Dealer</span>
                </Button>
              </Link>
              <Link href="/dealers/become-a-dealer" className="min-w-0">
                <Button
                  variant="light"
                  aria-label="Become a dealer"
                  className="h-13 w-full !px-2 py-0 !text-[10px] !tracking-[.04em] whitespace-nowrap min-[360px]:!text-[12px] min-[390px]:!text-[13px] sm:h-14 sm:!px-6 sm:!text-[11px] sm:!tracking-[.14em]"
                >
                  <span className="sm:hidden">Become Dealer</span>
                  <span className="hidden sm:inline">Become a Dealer</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
export function FinalHomeCta() {
  return (
    <CTASection
      title="Let’s Build Better Spaces Together."
      description="Talk to Woodbay about your next interior, factory visit or accessories dealer opportunity."
      action={{ label: "Contact Woodbay", href: "/contact" }}
    />
  );
}
