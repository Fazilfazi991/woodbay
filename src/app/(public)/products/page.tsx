import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Container,
  CTASection,
  PageHero,
  ProductCategoryCard,
  Section,
  SectionHeader,
} from "@/components/layout/primitives";
import { getFeaturedProducts } from "@/features/products/data/catalogue";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import type { CatalogueProduct } from "@/features/products/types";
import { productDivisions } from "@/features/products/data/taxonomy";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products | Woodbay",
  description:
    "Explore Woodbay kitchen accessories, wardrobe solutions, decor products and smart products.",
};
const image = "/images/preview/woodbay-kitchen-preview.png";
export default async function ProductsPage() {
  let featured: CatalogueProduct[] = [];
  try {
    featured = await getFeaturedProducts(8);
  } catch {
    /* Product pages render a safe catalogue-unavailable state below. */
  }
  return (
    <>
      <PageHero
        eyebrow="Woodbay Collections"
        title="Products Designed for Better Living."
        description="Explore Woodbay’s premium kitchen, wardrobe, smart and decor-led product collections."
        image={image}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <Section tone="light">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Our divisions"
              title="A considered product ecosystem."
              description="Choose a collection to explore product groups, published products and practical solutions."
            />
            <Link
              href="#catalogue-search"
              className="inline-flex min-h-11 w-fit items-center gap-2 border border-[color:var(--foreground-dark)] px-4 text-xs font-bold tracking-[.12em] uppercase transition-colors hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
            >
              Search catalogue <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productDivisions.map((category) => (
              <ProductCategoryCard
                key={category.slug}
                title={category.name}
                href={`/products/${category.slug}`}
                image={category.image}
                description={category.description}
                tone="light"
              />
            ))}
          </div>
        </Container>
      </Section>
      <Section tone="dark">
        <Container>
          <SectionHeader
            eyebrow="Featured range"
            title="Explore the collection."
            description="Featured products appear here as they are published in the Woodbay catalogue."
          />
          <div
            id="catalogue-search"
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {featured.length === 0 && (
            <div className="mt-10 border border-[color:var(--border-gold)] p-8 text-sm text-[color:var(--muted)]">
              No featured products are published yet. Browse a division to
              explore the available category structure.
            </div>
          )}
        </Container>
      </Section>
      <CTASection
        title="Find Woodbay products near you"
        description="Connect with an authorised Woodbay dealer for product availability and local assistance."
        action={{ label: "Find a Dealer", href: "/dealers" }}
      />
    </>
  );
}
