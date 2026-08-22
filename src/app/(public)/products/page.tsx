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
import {
  getFeaturedProducts,
  getTopLevelCategories,
} from "@/features/products/data/catalogue";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import type {
  CatalogueCategory,
  CatalogueProduct,
} from "@/features/products/types";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products | Woodbay",
  description:
    "Explore Woodbay kitchen accessories, wardrobe solutions, decor products and smart products.",
};
const image = "/images/preview/woodbay-kitchen-preview.png";
const categoryImages: Record<string, string> = {
  "kitchen-accessories": "/images/categories/kitchen-accessories.png",
  "wardrobe-accessories": "/images/categories/wardrobe-accessories.png",
  decor: "/images/categories/decor-products.png",
  "smart-products": "/images/categories/smart-products.png",
};
export default async function ProductsPage() {
  let categories: CatalogueCategory[] = [];
  let featured: CatalogueProduct[] = [];
  try {
    [categories, featured] = await Promise.all([
      getTopLevelCategories(),
      getFeaturedProducts(),
    ]);
  } catch {
    /* Product pages render a safe catalogue-unavailable state below. */
  }
  return (
    <>
      <PageHero
        eyebrow="Woodbay Collections"
        title="Products Designed\nfor Better Living."
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
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[.12em] uppercase"
            >
              Search catalogue <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <ProductCategoryCard
                key={category.id}
                title={category.name}
                href={`/products/${category.slug}`}
                image={categoryImages[category.slug] ?? image}
                description={
                  category.description ?? "Explore the Woodbay collection."
                }
                tone="light"
              />
            ))}
          </div>
          {categories.length === 0 && (
            <p className="mt-10 border border-[#d4c9b8] p-6 text-sm text-[color:var(--muted-dark)]">
              The public catalogue is temporarily unavailable. Please try again
              shortly.
            </p>
          )}
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
