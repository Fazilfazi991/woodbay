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
  getGlobalCatalogueSearch,
} from "@/features/products/data/catalogue";
import {
  EmptyProducts,
  ProductCard,
} from "@/features/products/components/catalogue-ui";
import type { CatalogueProduct } from "@/features/products/types";
import { productDivisions } from "@/features/products/data/taxonomy";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = pageMetadata({
  title: "Interior Products & Furniture Accessories in Kollam",
  description:
    "Browse Woodbay kitchen and wardrobe accessories, hardware fittings, aluminium profiles, smart furniture and home decor products in Kollam.",
  path: "/products",
});
const image = "/images/preview/woodbay-kitchen-preview.png";
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const rawQuery = (await searchParams).q;
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : (rawQuery ?? ""))
    .trim()
    .slice(0, 100);
  let featured: CatalogueProduct[] = [];
  let searchResults: CatalogueProduct[] = [];
  try {
    if (q.length >= 2)
      searchResults = (await getGlobalCatalogueSearch(q)).products;
    else featured = await getFeaturedProducts(8);
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
            eyebrow={q ? "Catalogue search" : "Featured range"}
            title={q ? `Results for “${q}”` : "Explore the collection."}
            description={
              q
                ? `${searchResults.length} matching product${searchResults.length === 1 ? "" : "s"} across the full Woodbay catalogue.`
                : "Featured products appear here as they are published in the Woodbay catalogue."
            }
          />
          <form
            id="catalogue-search"
            action="/products"
            className="mt-8 flex flex-col gap-2 sm:flex-row"
          >
            <label className="flex-1">
              <span className="sr-only">Search catalogue</span>
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products, categories, codes…"
                className="min-h-12 w-full border border-[color:var(--border-dark)] bg-transparent px-4 text-sm text-[color:var(--foreground-light)] outline-none placeholder:text-[#85847d] focus:border-[color:var(--gold)]"
              />
            </label>
            <button className="min-h-12 bg-[color:var(--gold)] px-6 text-xs font-bold tracking-[.14em] text-[#11120f] uppercase">
              Search
            </button>
            {q && (
              <Link
                href="/products#catalogue-search"
                className="inline-flex min-h-12 items-center justify-center border border-white/20 px-5 text-xs font-bold tracking-[.12em] uppercase"
              >
                Clear
              </Link>
            )}
          </form>
          <div className="mt-12 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:gap-4 lg:grid-cols-4">
            {(q ? searchResults : featured).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {q && searchResults.length === 0 && (
            <div className="mt-10">
              <EmptyProducts clearPath="/products#catalogue-search" />
            </div>
          )}
          {!q && featured.length === 0 && (
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
