import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  CirclePlay,
  Cog,
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
import { getFeaturedProducts } from "@/features/products/data/catalogue";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import type { CatalogueProduct } from "@/features/products/types";

const featuredDiscovery = [
  {
    title: "Smart Kitchen Solutions",
    href: "/products/kitchen-wardrobe-accessories",
    description: "Pantry, pullout, corner and sink solutions.",
    image: "/images/categories/kitchen-accessories.png",
  },
  {
    title: "Wallpapers & Wall Decor",
    href: "/products/home-decor/wallpaper",
    description: "Explore Woodbay wallpaper and wall decor collections.",
    image: "/images/categories/decor-products.png",
  },
  {
    title: "Wardrobe Solutions",
    href: "/products/kitchen-wardrobe-accessories?subcategory=wardrobe-series",
    description: "Organisers, racks, hangers and wardrobe lift systems.",
    image: "/images/categories/wardrobe-accessories.png",
  },
  {
    title: "Hardware & Profiles",
    href: "/products/hardware-fittings-aluminium-profiles",
    description: "Hardware fittings and aluminium profile systems.",
    image: "/images/categories/hardware-fittings.png",
  },
  {
    title: "Smart Furniture",
    href: "/products/smart-furniture",
    description: "Genuine connected and adaptable furniture products.",
    image: "/images/categories/smart-products.png",
  },
] as const;

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
          <h1 className="font-display mt-5 text-5xl leading-[.92] whitespace-pre-line sm:text-6xl lg:text-8xl">
            {homepage.hero.title}
          </h1>
          <p
            className={`mt-7 max-w-xl text-base leading-7 ${light ? "text-[#626262]" : "text-[#d7d1c6]"}`}
          >
            {homepage.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/products">
              <Button className={light ? "home-two-button" : ""}>
                Explore Products <ArrowRight size={15} />
              </Button>
            </Link>
            <Link href="/furniture/factory-visit">
              <Button variant={light ? "light" : "secondary"}>
                Book Factory Visit
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
      className={`relative border-t border-[color:var(--border-gold)] backdrop-blur-sm ${light ? "bg-white/75" : "bg-black/35"}`}
    >
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-[color:var(--border-gold)] lg:grid-cols-4 lg:divide-y-0">
          {homepage.trust.map((item, index) => {
            const Icon = icons[index];
            return (
              <div key={item.title} className="p-5 lg:px-7 lg:py-6">
                <Icon
                  size={19}
                  strokeWidth={1.25}
                  className="text-[color:var(--gold)]"
                />
                <h2 className="mt-3 text-xs font-bold tracking-[.12em] uppercase">
                  {item.title}
                </h2>
                <p
                  className={`mt-2 text-xs leading-5 ${light ? "text-[#626262]" : "text-[#bcb6ac]"}`}
                >
                  {item.text}
                </p>
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Our Products"
            title="Designed for Modern Living"
            description="Intelligent systems and elevated finishes for every room in the home."
          />
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] text-[color:var(--foreground-dark)] uppercase hover:text-[color:var(--gold)]"
          >
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
          {productDivisions.map((category) => (
            <ProductCategoryCard
              key={category.slug}
              title={category.name}
              href={`/products/${category.slug}`}
              description={category.description}
              image={category.image}
              tone="light"
            />
          ))}
        </div>
        <div className="mt-12 border-t border-[#d7cebf] pt-10">
          <p className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Popular product areas
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {featuredDiscovery.map((area) => (
              <ProductCategoryCard key={area.href} {...area} tone="light" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
export async function FeaturedProductsSection() {
  let products: CatalogueProduct[] = [];
  try {
    products = await getFeaturedProducts(8);
  } catch {
    /* safe empty state below */
  }
  return (
    <Section tone="dark">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Featured products"
            title="Browse the Woodbay catalogue."
            description="A focused selection of catalogue products, ready to explore or enquire about."
          />
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 border border-[color:var(--border-gold)] p-6 text-sm text-[color:var(--muted)]">
            Featured catalogue products will appear here as they are published.
          </p>
        )}
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
            <div className="mt-8 grid grid-cols-2 gap-x-7 gap-y-1 sm:grid-cols-3">
              {homepage.capabilityLabels.map((label) => (
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
            <div className="mt-3 grid grid-cols-3 gap-3 text-[10px] font-bold tracking-[.1em] text-[color:var(--muted)] uppercase sm:grid-cols-6">
              {[
                "Advanced Machinery",
                "Precision Production",
                "Quality Inspection",
                "Packaging",
                "Distribution",
                "Support",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-0 border-y border-[color:var(--border-gold)] sm:grid-cols-5">
          {homepage.manufacturingFeatures.map((item) => (
            <div
              className="flex min-h-20 items-center gap-3 border-b border-[color:var(--border-gold)] px-4 text-xs font-bold tracking-[.1em] uppercase last:border-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              key={item}
            >
              <Check size={15} className="text-[color:var(--gold)]" />
              {item}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export function SmartSection() {
  return (
    <Section tone="light">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeader
              eyebrow="Smart Products"
              title="Innovation, quietly integrated."
              description="Thoughtful systems that bring more ease and possibility to modern living."
            />
            <Link
              href="/products/smart-furniture"
              className="mt-8 inline-block"
            >
              <Button variant="light">
                Explore Smart Products <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {homepage.smart.map((item) => (
              <article
                key={item.title}
                className="border border-[#d7cebf] bg-white p-7"
              >
                <Cog
                  size={25}
                  strokeWidth={1.15}
                  className="text-[color:var(--gold)]"
                />
                <h3 className="font-display mt-14 text-4xl leading-none">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted-dark)]">
                  {item.text}
                </p>
              </article>
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
      <Section tone="dark">
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
              <div className="mt-8 grid grid-cols-2 gap-y-3 text-sm text-[color:var(--decor-list-text)]">
                {homepage.decor.map((item) => (
                  <span className="flex items-center gap-2" key={item}>
                    <span className="size-1 bg-[color:var(--gold)]" />
                    {item}
                  </span>
                ))}
              </div>
              <Link href="/products/home-decor" className="mt-9 inline-block">
                <Button variant="secondary">
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
              src={homepage.assets.interiors}
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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/furniture">
                  <Button>
                    Explore Furniture <ArrowRight size={15} />
                  </Button>
                </Link>
                <Link href="/furniture/factory-visit">
                  <Button variant="secondary">Book Factory Visit</Button>
                </Link>
              </div>
              <div className="mt-10 border-t border-[color:var(--border-gold)] pt-5">
                <p className="text-xs tracking-[.12em] text-[color:var(--gold)] uppercase">
                  Interested in opening a Woodbay Furniture outlet?
                </p>
                <Link
                  href="/furniture/outlets"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] uppercase"
                >
                  Become a Furniture Outlet <ArrowRight size={15} />
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
    <Section tone="dark">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Our Projects"
            title="Spaces made personal."
            description="A glimpse of the places where Woodbay details make a difference."
          />
          <Link
            href="/projects"
            className="hidden shrink-0 items-center gap-2 text-xs font-bold tracking-[.12em] text-[color:var(--gold)] uppercase sm:inline-flex"
          >
            View All Projects <ArrowRight size={15} />
          </Link>
        </div>
        {unavailable ? (
          <p className="mt-12 border border-[color:var(--border-gold)] p-6 text-sm text-[color:var(--muted)]">
            Project highlights are temporarily unavailable. Please check back
            shortly.
          </p>
        ) : projects.length === 0 ? (
          <p className="mt-12 border border-[color:var(--border-gold)] p-6 text-sm text-[color:var(--muted)]">
            New Woodbay project highlights will appear here soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-5">
            {projects.map((project) => {
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
                      sizes="(max-width: 768px) 50vw, 20vw"
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
                    <h3 className="font-display text-3xl">{project.title}</h3>
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
      <Section tone="light">
        <Container>
          <div className="grid gap-10 border-y border-[#cfc5b4] py-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <Eyebrow>Woodbay Dealer Network</Eyebrow>
              <h2 className="font-display mt-4 text-5xl leading-none">
                Find Woodbay Near You
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted-dark)]">
                Discover authorised Woodbay accessories dealers in your area, or
                join our growing dealer network.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/dealers">
                <Button variant="light">
                  <MapPin size={15} />
                  Find a Dealer
                </Button>
              </Link>
              <Link href="/dealers/become-a-dealer">
                <Button variant="light">Become a Dealer</Button>
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
