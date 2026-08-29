import Image from "next/image";
import Link from "next/link";
import { Eye, MessageCircle, Search, SlidersHorizontal } from "lucide-react";
import { primaryImage, productDetailPath } from "../data/catalogue";
import type { CatalogueCategory, CatalogueProduct } from "../types";
import { Button } from "@/components/ui/button";
import { productEnquiryHref } from "../data/enquiry";
export { CategoryChips } from "./category-chips";
export function ProductCard({ product }: { product: CatalogueProduct }) {
  const image = primaryImage(product);
  const enquiry = productEnquiryHref(product);
  const isolatedHardware = /hinge|profile/i.test(
    `${product.name} ${product.category?.name ?? ""}`,
  );
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#d8d0c3] bg-[#fbf8f1] text-[color:var(--foreground-dark)] transition-colors duration-300 hover:border-[color:var(--gold)]">
      <Link
        href={productDetailPath(product)}
        className="relative block aspect-[10/9] overflow-hidden bg-[color:var(--surface-muted)] sm:aspect-[4/3]"
      >
        {image ? (
          <Image
            src={image.storage_key}
            alt={image.alt_text ?? `${product.name} by Woodbay`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className={`${isolatedHardware ? "object-contain p-2.5" : "object-cover"} transition duration-500 group-hover:scale-[1.025]`}
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center">
            <div>
              <span className="block text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Product imagery
              </span>
              <span className="font-display mt-2 block text-xl text-[color:var(--muted-dark)] sm:text-2xl">
                Image coming soon
              </span>
            </div>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="line-clamp-1 text-[10px] font-semibold tracking-[.1em] text-[color:var(--gold)] uppercase sm:text-[11px] sm:tracking-[.12em]">
          {product.category?.name ?? "Woodbay Collection"}
        </p>
        <h3 className="font-display mt-2 line-clamp-2 min-h-[2.15em] text-[1.3rem] leading-[1.075] sm:text-[1.65rem]">
          {product.name}
        </h3>
        <span
          aria-hidden="true"
          className="mt-2 block h-px w-7 bg-[color:var(--gold)]"
        />
        {product.product_code && (
          <p className="mt-2.5 truncate text-[11px] text-[color:var(--muted-dark)] sm:text-xs">
            Code: {product.product_code}
          </p>
        )}
        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3.5 sm:gap-2 sm:pt-4">
          <Link
            href={productDetailPath(product)}
            className="inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-full border border-[#3f403b] px-1.5 text-[10px] font-semibold whitespace-nowrap transition-colors hover:bg-[color:var(--foreground-dark)] hover:text-[color:var(--foreground-light)] sm:gap-1.5 sm:px-2 sm:text-xs"
          >
            <Eye size={13} strokeWidth={1.6} /> View
          </Link>
          {enquiry ? (
            <a
              href={enquiry}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-full border border-[color:var(--gold)] px-1.5 text-[10px] font-semibold whitespace-nowrap text-[#9a7628] transition-colors hover:bg-[color:var(--gold)] hover:text-[#171711] sm:gap-1.5 sm:px-2 sm:text-xs"
            >
              <MessageCircle size={13} /> Enquire
            </a>
          ) : (
            <span
              aria-disabled="true"
              title="WhatsApp enquiries are temporarily unavailable"
              className="inline-flex h-10 min-w-0 cursor-not-allowed items-center justify-center gap-1 rounded-full border border-[color:var(--gold)]/40 px-1.5 text-[10px] font-semibold whitespace-nowrap text-[#9a7628]/55 sm:gap-1.5 sm:px-2 sm:text-xs"
            >
              <MessageCircle size={13} /> Enquire
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
export function CatalogueControls({
  path,
  q,
  subcategory,
  sort,
  categories,
}: {
  path: string;
  q: string;
  subcategory: string | null;
  sort: string;
  categories: CatalogueCategory[];
}) {
  return (
    <form
      action={path}
      className="grid gap-2.5 border-y border-[color:var(--border-dark)] py-4 md:grid-cols-[1fr_auto_auto]"
    >
      <label className="relative">
        <span className="sr-only">Search products</span>
        <Search
          size={17}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[color:var(--gold)]"
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products or product code"
          className="min-h-12 w-full border border-[color:var(--border-dark)] bg-transparent pr-4 pl-11 text-sm text-[color:var(--foreground-light)] outline-none placeholder:text-[#85847d] focus:border-[color:var(--gold)]"
        />
      </label>
      <label className="flex min-h-12 items-center gap-2 border border-[color:var(--border-dark)] px-3 text-xs text-[color:var(--foreground-light)]">
        <SlidersHorizontal size={15} className="text-[color:var(--gold)]" />
        <span className="sr-only">Filter by subcategory</span>
        <select
          name="subcategory"
          defaultValue={subcategory ?? ""}
          className="h-12 flex-1 bg-transparent outline-none"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <select
        aria-label="Sort products"
        name="sort"
        defaultValue={sort}
        className="min-h-12 border border-[color:var(--border-dark)] bg-transparent px-3 text-xs text-[color:var(--foreground-light)] outline-none"
      >
        <option value="default">Recommended</option>
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
      </select>
      <input type="hidden" name="page" value="1" />
      <Button type="submit" className="md:col-start-3">
        Apply filters
      </Button>
    </form>
  );
}
export function EmptyProducts({ path }: { path: string }) {
  return (
    <div className="border border-[color:var(--border-gold)] bg-[color:var(--surface-dark)] px-5 py-8 text-center sm:px-6 sm:py-10">
      <p className="font-display text-3xl">No products here yet</p>
      <p className="mt-3 text-sm text-[color:var(--muted)]">
        Try another category or browse the full catalogue.
      </p>
      <Link href={path} className="mt-5 inline-block">
        <Button>Browse all products</Button>
      </Link>
    </div>
  );
}
export function Pagination({
  path,
  page,
  pageCount,
  q,
  subcategory,
  sort,
}: {
  path: string;
  page: number;
  pageCount: number;
  q: string;
  subcategory: string | null;
  sort: string;
}) {
  if (pageCount <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams({ page: String(target) });
    if (q) params.set("q", q);
    if (subcategory) params.set("subcategory", subcategory);
    if (sort !== "default") params.set("sort", sort);
    return `${path}?${params}`;
  };
  return (
    <nav
      aria-label="Product pages"
      className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:justify-center sm:gap-3"
    >
      <Link
        aria-disabled={page === 1}
        className="min-h-11 border border-[color:var(--border-dark)] px-3 py-3 text-center text-[11px] tracking-[.08em] uppercase disabled:opacity-40 sm:px-4 sm:text-xs sm:tracking-[.1em]"
        href={page === 1 ? path : href(page - 1)}
      >
        Previous
      </Link>
      <span className="text-center text-xs text-[color:var(--muted)] sm:text-sm">
        Page {page} of {pageCount}
      </span>
      <Link
        aria-disabled={page === pageCount}
        className="min-h-11 border border-[color:var(--border-dark)] px-3 py-3 text-center text-[11px] tracking-[.08em] uppercase sm:px-4 sm:text-xs sm:tracking-[.1em]"
        href={page === pageCount ? path : href(page + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
