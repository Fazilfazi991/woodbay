import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import {
  CatalogueControls,
  CategoryChips,
  EmptyProducts,
  Pagination,
  ProductCard,
} from "@/features/products/components/catalogue-ui";
import {
  getDivisionCategories,
  getDivisionProducts,
  parseCatalogueParams,
} from "@/features/products/data/catalogue";
import { getProductDivision } from "@/features/products/data/taxonomy";
import type {
  CatalogueCategory,
  CatalogueProduct,
} from "@/features/products/types";
import { divisionSeo, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const division = getProductDivision((await params).categorySlug);
  if (!division) notFound();
  const seo = divisionSeo[division.slug];
  return pageMetadata({ title: seo.title, description: seo.description, path: `/products/${division.slug}`, image: division.image });
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const division = getProductDivision((await params).categorySlug);
  if (!division) notFound();
  const parsed = parseCatalogueParams(await searchParams);
  let categories: CatalogueCategory[] = [];
  let result: {
    products: CatalogueProduct[];
    count: number;
    pageCount: number;
  } = { products: [], count: 0, pageCount: 1 };
  let failed = false;
  try {
    categories = await getDivisionCategories(division);
    result = await getDivisionProducts(division, categories, parsed);
  } catch {
    failed = true;
  }
  const path = `/products/${division.slug}`;
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-10 sm:py-14">
          <nav className="text-[10px] tracking-[.12em] text-[color:var(--muted)] uppercase">
            Home / Products / {division.name}
          </nav>
          <p className="mt-8 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Woodbay catalogue
          </p>
            <h1 className="font-display mt-3 max-w-4xl text-[2.5rem] leading-[.94] sm:text-7xl">
            {division.name}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {divisionSeo[division.slug].intro}
          </p>
        </Container>
      </section>
      <Section tone="dark">
        <Container>
          {categories.length > 0 && (
            <CategoryChips
              categories={categories}
              active={parsed.subcategory}
              basePath={path}
            />
          )}
          <div className="mt-6">
            <CatalogueControls
              path={path}
              q={parsed.q}
              subcategory={parsed.subcategory}
              sort={parsed.sort}
              categories={categories}
            />
          </div>
          <p className="mt-6 text-sm text-[color:var(--muted)]">
            {result.count
              ? `${result.count} catalogue product${result.count === 1 ? "" : "s"}`
              : "No published products"}
          </p>
          {failed ? (
            <div className="mt-8 border border-[color:var(--border-gold)] p-8 text-sm text-[color:var(--muted)]">
              The catalogue could not be loaded right now.
            </div>
          ) : result.products.length ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
            subcategory={parsed.subcategory}
            sort={parsed.sort}
          />
        </Container>
      </Section>
      <Section tone="light">
        <Container className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl">Choosing products for your Kollam project</h2>
            <p className="mt-5 max-w-[70ch] text-sm leading-7 text-[color:var(--muted-dark)]">Use the category filters to narrow the catalogue, then review the product page for recorded dimensions, finishes and model details. Woodbay can help with product enquiries and dealer availability; final compatibility should be confirmed before cabinet fabrication or installation.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl">Common questions</h2>
            <h3 className="mt-5 font-semibold">Can I confirm availability online?</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-dark)]">The catalogue shows published products. Send an enquiry for current availability and the appropriate option for your project.</p>
            <h3 className="mt-5 font-semibold">How do I choose a compatible model?</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-dark)]">Share the product name or code together with relevant cabinet or room dimensions. Compatibility is confirmed separately.</p>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Need help choosing a Woodbay product?"
        description="Send the product name or code to our team for availability and specifications."
        action={{ label: "Contact Woodbay", href: "/contact" }}
      />
    </>
  );
}
