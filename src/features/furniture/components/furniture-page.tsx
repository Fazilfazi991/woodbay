import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, Palette, Ruler, Store } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { furniture } from "@/config/furniture";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import {
  getCategoryBySlug,
  getProducts,
} from "@/features/products/data/catalogue";
import type { CatalogueProduct } from "@/features/products/types";

export async function FurniturePage() {
  let smartProducts: CatalogueProduct[] = [];

  try {
    const smartCategory = await getCategoryBySlug("smart-products");
    if (smartCategory) {
      smartProducts = (
        await getProducts(smartCategory, [], {
          q: "",
          subcategory: null,
          page: 1,
          sort: "default",
        })
      ).products.slice(0, 3);
    }
  } catch {
    // The furniture page remains available while the optional catalogue data is unavailable.
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[color:var(--background-dark)] text-[color:var(--foreground-light)]">
        <Image
          src="/images/homepage/furniture-decor-preview.png"
          alt="Woodbay custom furniture interior"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-50"
        />
        <Container className="py-24 sm:py-32">
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            {furniture.hero.eyebrow}
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-[2.5rem] leading-[.94] whitespace-pre-line sm:text-8xl">
            {furniture.hero.title}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[color:var(--muted)]">
            {furniture.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/furniture/factory-visit">
              <Button>Book factory visit</Button>
            </Link>
            <Link href="/furniture/design">
              <Button variant="secondary">
                Design your furniture <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      <Section tone="light">
        <Container>
          <div className="grid gap-px bg-[#d7cebf] sm:grid-cols-2 lg:grid-cols-3">
            {furniture.benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="bg-[color:var(--surface-light)] p-6"
              >
                <Factory size={20} className="text-[color:var(--gold)]" />
                <h2 className="font-display mt-12 text-3xl">{benefit.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted-dark)]">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="muted">
        <Container>
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Furniture categories
          </p>
          <h2 className="font-display mt-3 text-5xl">
            Made for the whole home.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {furniture.categories.map((category) => (
              <Link
                key={category}
                href={`/furniture/design?type=${encodeURIComponent(category)}`}
                className="group border border-[color:var(--border-dark)] p-7 hover:border-[color:var(--gold)]"
              >
                <Ruler size={22} className="text-[color:var(--gold)]" />
                <h3 className="font-display mt-16 text-4xl">{category}</h3>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold tracking-[.12em] text-[color:var(--gold)] uppercase">
                  Design this space <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-8">
            <article className="border border-[#d7cebf] p-7 sm:p-9">
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Smart furniture
              </p>
              <h2 className="font-display mt-4 text-5xl">
                Add intelligence where it matters.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[color:var(--muted-dark)]">
                Pair your made-to-measure furniture brief with Woodbay smart
                products for more considered everyday living.
              </p>
              <Link
                href="/products/smart-products"
                className="mt-7 inline-block"
              >
                <Button variant="light">Explore smart products</Button>
              </Link>
            </article>
            {smartProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-x-2.5 gap-y-4 sm:gap-4 lg:grid-cols-3">
                {smartProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <article className="bg-[color:var(--background-deep)] p-7 text-[color:var(--foreground-light)] sm:p-9">
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Projects
              </p>
              <h2 className="font-display mt-4 text-5xl">
                Spaces worth studying.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
                Explore Woodbay work across kitchens, wardrobes, living rooms,
                bedrooms and study spaces.
              </p>
              <Link href="/projects" className="mt-7 inline-block">
                <Button>View projects</Button>
              </Link>
            </article>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Colours & finishes
              </p>
              <h2 className="font-display mt-3 text-5xl">
                Build a considered combination.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted-dark)]">
                Choose front and body finishes separately as a starting point
                for a Woodbay consultation.
              </p>
              <Link href="/furniture/design" className="mt-7 inline-block">
                <Button variant="light">
                  <Palette size={16} /> Explore finishes
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {furniture.demoColours.map((colour) => (
                <div
                  key={colour.name}
                  className="min-h-28 border border-[#d7cebf] p-4"
                  style={{
                    backgroundColor: colour.hex,
                    color: colour.name === "Warm Ivory" ? "#1e1f1c" : "#fff",
                  }}
                >
                  <p className="text-xs font-bold tracking-[.12em] uppercase">
                    {colour.name}
                  </p>
                  <p className="mt-1 text-xs opacity-80">
                    Temporary sample finish
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Design process
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {furniture.process.map((step, index) => (
              <article
                key={step}
                className="border-t border-[color:var(--border-gold)] pt-5"
              >
                <p className="text-xs text-[color:var(--gold)]">0{index + 1}</p>
                <h2 className="font-display mt-3 text-3xl">{step}</h2>
              </article>
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-6 border-y border-[#d7cebf] py-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Factory experience
              </p>
              <h2 className="font-display mt-3 text-5xl">
                See where your furniture comes to life.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[color:var(--muted-dark)]">
                Visit, consult on materials and finishes, and discuss your
                requirements with Woodbay.
              </p>
              <Link
                href="/furniture/factory-visit"
                className="mt-7 inline-block"
              >
                <Button variant="light">Book factory visit</Button>
              </Link>
            </div>
            <div className="bg-[color:var(--background-deep)] p-8 text-[color:var(--foreground-light)]">
              <Store size={24} className="text-[color:var(--gold)]" />
              <h2 className="font-display mt-16 text-4xl">
                Become a Woodbay Furniture Outlet
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                A furniture showroom and business opportunity, distinct from the
                Woodbay Accessories Dealer network.
              </p>
              <Link href="/furniture/outlets" className="mt-7 inline-block">
                <Button>Become an outlet</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Ready to design around your space?"
        description="Share your furniture requirement and start a conversation with Woodbay."
        action={{ label: "Design your furniture", href: "/furniture/design" }}
      />
    </>
  );
}
