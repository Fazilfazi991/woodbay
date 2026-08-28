import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CTASection,
  Container,
  PageHero,
  Section,
} from "@/components/layout/primitives";
import {
  CatalogueControls,
  EmptyProducts,
  Pagination,
  ProductCard,
} from "@/features/products/components/catalogue-ui";
import {
  getCategoryBySlug,
  getProducts,
  parseCatalogueParams,
} from "@/features/products/data/catalogue";
import type { CatalogueProduct } from "@/features/products/types";
const wallpaperSections = [
  "Wallpaper Collections",
  "Living Room Wallpapers",
  "Bedroom Wallpapers",
  "Office / Commercial Wallpapers",
  "Modern / Premium Designs",
  "Textured Wallpapers",
  "Wall Decor Solutions",
  "Installation / Enquiry",
  "FAQs",
  "Service / Location Content",
];
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}): Promise<Metadata> {
  const { subcategorySlug } = await params;
  const category = await getCategoryBySlug(subcategorySlug);
  return category
    ? {
        title: `${category.name} | Woodbay`,
        description:
          category.description ??
          `Explore Woodbay ${category.name.toLowerCase()}.`,
      }
    : {};
}
export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { categorySlug, subcategorySlug } = await params;
  const [parent, category] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategoryBySlug(subcategorySlug),
  ]);
  if (!parent || !category || category.parent_id !== parent.id) notFound();
  const parsed = parseCatalogueParams(await searchParams);
  let result: {
    products: CatalogueProduct[];
    count: number;
    pageCount: number;
  } = { products: [], count: 0, pageCount: 1 };
  let failed = false;
  try {
    result = await getProducts(category, [], parsed);
  } catch {
    failed = true;
  }
  const path = `/products/${parent.slug}/${category.slug}`;
  return (
    <>
      <PageHero
        eyebrow={parent.name}
        title={category.name}
        description={
          category.description ??
          `Explore Woodbay ${category.name.toLowerCase()}.`
        }
        image="/images/preview/woodbay-kitchen-preview.png"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: parent.name, href: `/products/${parent.slug}` },
          { label: category.name },
        ]}
      />
      <Section tone="dark">
        <Container>
          <CatalogueControls
            path={path}
            q={parsed.q}
            subcategory={null}
            sort={parsed.sort}
            categories={[]}
          />
          <p className="mt-7 text-sm text-[color:var(--muted)]">
            {result.count === 0
              ? "No published products"
              : `Showing ${(parsed.page - 1) * 12 + 1}–${Math.min(parsed.page * 12, result.count)} of ${result.count} products`}
          </p>
          {failed ? (
            <div className="mt-8 border border-[color:var(--border-gold)] p-8 text-sm text-[color:var(--muted)]">
              The catalogue could not be loaded right now. Please try again
              shortly.
            </div>
          ) : result.products.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyProducts path={path} />
            </div>
          )}
          <Pagination
            path={path}
            page={parsed.page}
            pageCount={result.pageCount}
            q={parsed.q}
            subcategory={null}
            sort={parsed.sort}
          />
        </Container>
      </Section>
      {category.slug === "wallpaper" && (
        <Section tone="light">
          <Container>
            <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
              Wallpaper content architecture
            </p>
            <h2 className="font-display mt-3 max-w-3xl text-5xl">
              A dedicated place for wallpaper discovery.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted-dark)]">
              This landing structure is ready for approved Woodbay collection
              content, installation information, FAQs and relevant Kollam
              service information. No unapproved ranking or business claims are
              included.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-px bg-[#d7cebf] md:grid-cols-3">
              {wallpaperSections.map((title) => (
                <section
                  key={title}
                  className="min-h-32 bg-[color:var(--surface-light)] p-5"
                >
                  <h3 className="font-display text-2xl">{title}</h3>
                </section>
              ))}
            </div>
          </Container>
        </Section>
      )}
      <CTASection
        title="Explore the Complete Woodbay Collection"
        description="Discover more Woodbay solutions or connect with an authorised dealer."
        action={{ label: "Find a Dealer", href: "/dealers" }}
      />
    </>
  );
}
