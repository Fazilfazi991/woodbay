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
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const category = await getCategoryBySlug(subcategorySlug);
  if (!category) notFound();
  return pageMetadata({
        title: `${category.name} in Kollam`,
        description: category.description ? `${category.description} Explore Woodbay options in Kollam, Kerala.` : `Explore Woodbay ${category.name.toLowerCase()} in Kollam, Kerala. Review product details and enquire for availability.`,
        path: `/products/${categorySlug}/${subcategorySlug}`,
      });
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
          {result.count > 0 && (
            <p className="mt-7 text-sm text-[color:var(--muted)]">
              Showing {(parsed.page - 1) * 12 + 1}–{Math.min(parsed.page * 12, result.count)} of {result.count} products
            </p>
          )}
          {failed ? (
            <div className="mt-8 border border-[color:var(--border-gold)] p-8 text-sm text-[color:var(--muted)]">
              The catalogue could not be loaded right now. Please try again
              shortly.
            </div>
          ) : result.products.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {result.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyProducts
                clearPath={path}
                browsePath={`/products/${parent.slug}`}
              />
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
          <Container className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
            <div><h2 className="font-display max-w-3xl text-5xl">Wallpaper for homes and interiors in Kollam</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted-dark)]">
              Explore Woodbay wallpaper for living rooms, bedrooms and commercial interiors. Pattern, texture and colour should be reviewed alongside room lighting and adjacent finishes; enquire with the product name for current options and installation guidance.
            </p>
            </div><div><h2 className="font-display text-3xl">Wallpaper questions</h2><h3 className="mt-5 font-semibold">Can I choose from the website image alone?</h3><p className="mt-2 text-sm leading-7 text-[color:var(--muted-dark)]">Screens can display colour and texture differently. Review the available product information and request guidance before final selection.</p><h3 className="mt-5 font-semibold">What should I share in an enquiry?</h3><p className="mt-2 text-sm leading-7 text-[color:var(--muted-dark)]">Share the product name, room type and approximate wall dimensions so the team can respond with relevant next steps.</p></div>
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
