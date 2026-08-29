import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Section } from "@/components/layout/primitives";
import {
  ProductActions,
  ProductGallery,
  ProductOptionsAndActions,
  ProductSpecifications,
} from "@/features/products/components/product-detail";
import { ProductCard } from "@/features/products/components/catalogue-ui";
import { ProductEditorial } from "@/features/products/components/product-editorial";
import {
  getProductBySlug,
  getRelatedProducts,
  productSpecifications,
} from "@/features/products/data/catalogue";
import { getProductContent } from "@/features/products/data/content";
export const dynamic = "force-dynamic";
type RouteProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};
export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (
    !product ||
    (product.parentCategory?.slug !== categorySlug &&
      product.category?.slug !== categorySlug)
  )
    return {};
  const title =
    product.seo_title ??
    `${product.name} | Woodbay ${product.parentCategory?.name ?? "Products"}`;
  const description =
    product.seo_description ??
    product.short_description ??
    `Explore ${product.name} by Woodbay.`;
  const canonical = `/products/${categorySlug}/product/${product.slug}`;
  const image =
    product.images[0]?.storage_key ??
    "/images/preview/woodbay-kitchen-preview.png";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: image, alt: `${product.name} by Woodbay` }],
    },
  };
}
export default async function ProductPage({ params }: RouteProps) {
  const { categorySlug, productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (
    !product ||
    (product.parentCategory?.slug !== categorySlug &&
      product.category?.slug !== categorySlug)
  )
    notFound();
  const related = await getRelatedProducts(product);
  const category = product.category;
  const content = getProductContent(product);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ?? product.short_description ?? content.overview,
    sku: product.product_code ?? undefined,
    category: category?.name,
    brand: { "@type": "Brand", name: "Woodbay" },
    image: product.images.map((image) => image.storage_key),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Section tone="dark" className="pt-10">
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap gap-2 text-xs tracking-[.1em] text-[color:var(--muted)] uppercase"
          >
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/products">Products</Link>
            <span>›</span>
            <Link href={`/products/${product.parentCategory?.slug}`}>
              {product.parentCategory?.name}
            </Link>
            {category?.parent_id && (
              <>
                <span>›</span>
                <Link
                  href={`/products/${product.parentCategory?.slug}/${category.slug}`}
                >
                  {category.name}
                </Link>
              </>
            )}
            <span>›</span>
            <span className="text-[color:var(--foreground-light)]">
              {product.name}
            </span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery product={product} />
            <div>
              <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                {category?.name ?? product.parentCategory?.name}
              </p>
              <h1 className="font-display mt-4 text-[2.5rem] leading-[.94] sm:text-6xl">
                {product.name}
              </h1>
              {product.product_code && (
                <p className="mt-5 text-sm text-[color:var(--muted)]">
                  Product code{" "}
                  <span className="font-semibold text-[color:var(--foreground-light)]">
                    {product.product_code}
                  </span>
                </p>
              )}
              <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--muted)]">
                {product.short_description ??
                  product.description ??
                  content.overview}
              </p>
              <div className="mt-9">
                <ProductOptionsAndActions product={product} />
              </div>
              <div className="mt-9">
                <ProductSpecifications
                  entries={productSpecifications(product)}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
      <ProductEditorial content={content} />
      {related.length > 0 && (
        <Section tone="dark">
          <Container>
            <h2 className="font-display text-4xl sm:text-5xl">
              You may also like
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}
      <Section tone="dark" className="pt-0">
        <Container>
          <div className="grid gap-6 border-y border-[color:var(--border-gold)] py-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">
                Need help choosing the right model?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
                Share this product with WoodBay for guidance on available
                options, compatibility and the most suitable selection for your
                project.
              </p>
            </div>
            <ProductActions product={product} />
          </div>
        </Container>
      </Section>
    </>
  );
}
