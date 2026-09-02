"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { buttonClassName } from "@/components/ui/button";
import type { ProductDetail, ProductVariant } from "../types";
import { productEnquiryHref } from "../data/enquiry";
import { localProductImage } from "../data/local-images";
import type { ProductSpecificationEntry } from "../data/catalogue";
import { AddToCartButton } from "@/features/cart/product-cart";
import { toCartProduct, toCartVariant } from "@/features/cart/adapters";
import { siteConfig } from "@/config/site";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const [index, setIndex] = useState(0);
  const fallback = localProductImage(product.slug, product.name);
  const images =
    product.images.length > 0 ? product.images : fallback ? [fallback] : [];
  const image = images[index];
  if (!image)
    return (
      <div className="grid aspect-square place-items-center border border-[color:var(--border-dark)] bg-[color:var(--surface-dark)] px-6 text-center">
        <div>
          <span className="block text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Product imagery
          </span>
          <span className="font-display mt-3 block text-3xl text-[color:var(--muted)]">
            Image coming soon
          </span>
        </div>
      </div>
    );
  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-[color:var(--border-dark)] bg-[color:var(--surface-dark)]">
        <Image
          src={image.storage_key}
          alt={image.alt_text ?? `${product.name} by Woodbay`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous product image"
              onClick={() =>
                setIndex((index - 1 + images.length) % images.length)
              }
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center border border-[color:var(--border-gold)] bg-black/50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next product image"
              onClick={() => setIndex((index + 1) % images.length)}
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center border border-[color:var(--border-gold)] bg-black/50"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((item, itemIndex) => (
            <button
              key={`${item.storage_key}-${itemIndex}`}
              aria-label={`Show image ${itemIndex + 1}`}
              aria-current={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className={`relative size-16 overflow-hidden border ${itemIndex === index ? "border-[color:var(--gold)]" : "border-[color:var(--border-dark)]"}`}
            >
              <Image
                src={item.storage_key}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductSpecifications({
  entries,
}: {
  entries: ProductSpecificationEntry[];
}) {
  if (!entries.length) return null;
  return (
    <section
      aria-labelledby="specifications-heading"
      className="border-t border-[color:var(--border-dark)] pt-8"
    >
      <h2 id="specifications-heading" className="font-display text-3xl">
        Technical specifications
      </h2>
      <dl className="mt-5 divide-y divide-[color:var(--border-dark)] border-y border-[color:var(--border-dark)]">
        {entries.map((entry) => (
          <div
            key={entry.label}
            className="grid gap-1 py-4 text-sm sm:grid-cols-[minmax(8rem,.7fr)_1fr] sm:gap-4"
          >
            <dt className="font-bold tracking-[.1em] text-[color:var(--gold)] uppercase">
              {entry.label}
            </dt>
            <dd>
              {Array.isArray(entry.value) ? (
                <ul className="grid gap-2" aria-label={entry.label}>
                  {entry.value.map((item) => (
                    <li key={item} className="flex gap-2.5 leading-6">
                      <span
                        aria-hidden="true"
                        className="mt-[.6rem] size-1 shrink-0 rounded-full bg-[color:var(--gold)]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                entry.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProductVariants({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId?: string | null;
  onSelect?: (variant: ProductVariant) => void;
}) {
  if (!variants.length) return null;
  return (
    <section
      aria-labelledby="variants-heading"
      className="product-variants border-t border-[color:var(--border-dark)] pt-5"
    >
      <h2 id="variants-heading" className="font-display text-3xl">
        Available variants
      </h2>
      <div className="mt-5 divide-y divide-[color:var(--border-dark)] border-y border-[color:var(--border-dark)]">
        {variants.map((variant) => {
          const Wrapper = onSelect ? "button" : "div";
          return (
            <Wrapper
              key={variant.id}
              type={onSelect ? "button" : undefined}
              aria-pressed={onSelect ? selectedId === variant.id : undefined}
              onClick={onSelect ? () => onSelect(variant) : undefined}
              className={`grid w-full gap-2 py-4 text-left text-sm transition-colors sm:grid-cols-3 ${selectedId === variant.id ? "bg-white/[.035] text-[color:var(--foreground-light)]" : "text-[color:var(--muted)] hover:bg-white/[.02] hover:text-[color:var(--foreground-light)]"}`}
            >
              <p className="flex items-center gap-2 font-semibold">
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${selectedId === variant.id ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--background-dark)]" : "border-[color:var(--border-dark)]"}`}
                >
                  {selectedId === variant.id && (
                    <Check size={12} strokeWidth={2.2} />
                  )}
                </span>
                {variant.name}
              </p>
              <p>
                {variant.sku && (
                  <>
                    <span className="mr-2 text-[10px] font-bold tracking-[.1em] text-[color:var(--gold)] uppercase">
                      Code
                    </span>
                    {variant.sku}
                  </>
                )}
              </p>
              <p>
                {[variant.dimension, variant.finish]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}

export function ProductActions({
  product,
  variant,
}: {
  product: ProductDetail;
  variant?: ProductVariant | null;
}) {
  const productPath = toCartProduct(product).detailPath;
  const enquiry = productEnquiryHref(
    product,
    variant
      ? {
          variant: variant.name,
          size: variant.size,
          finish: variant.finish,
          link: new URL(productPath, siteConfig.url).toString(),
        }
      : { link: new URL(productPath, siteConfig.url).toString() },
  );
  return (
    <section className="product-actions border-t border-[color:var(--border-gold)] pt-5">
      <div className="grid grid-cols-[1.2fr_.8fr] gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
        <AddToCartButton
          product={toCartProduct(product)}
          variant={variant ? toCartVariant(variant) : null}
          disabled={product.variants.length > 0 && !variant}
          className="col-span-2 min-h-11 px-4 max-sm:w-full sm:col-span-1"
        />
        <Link
          href={`/contact?subject=${encodeURIComponent(`Product enquiry: ${product.name}`)}&message=${encodeURIComponent(`Hello WoodBay, I would like to enquire about ${product.name}${variant ? ` — ${variant.name}` : ""}. Please share further details.`)}`}
          className={buttonClassName(
            "secondary",
            "min-h-11 px-3 tracking-[.1em] max-sm:w-full sm:px-4 sm:tracking-[.14em]",
          )}
        >
          Send enquiry <ArrowRight size={14} />
        </Link>
        {enquiry ? (
          <a
            href={enquiry}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName(
              "text",
              "min-h-11 px-2 max-sm:w-full sm:px-3",
            )}
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        ) : (
          <span
            aria-disabled="true"
            title="WhatsApp enquiries are temporarily unavailable"
            className={buttonClassName(
              "text",
              "min-h-11 cursor-not-allowed px-2 opacity-45 max-sm:w-full sm:px-3",
            )}
          >
            <MessageCircle size={15} /> WhatsApp
          </span>
        )}
      </div>
      {product.variants.length > 0 && !variant && (
        <p className="mt-3 text-xs text-[color:var(--muted)]">
          Select an option first to add this product to your cart.
        </p>
      )}
    </section>
  );
}

export function ProductOptionsAndActions({
  product,
}: {
  product: ProductDetail;
}) {
  const [selected, setSelected] = useState<ProductVariant | null>(null);
  return (
    <div className="grid gap-6">
      {product.variants.length > 0 && (
        <div>
          <ProductVariants
            variants={product.variants}
            selectedId={selected?.id}
            onSelect={(variant) =>
              setSelected(selected?.id === variant.id ? null : variant)
            }
          />
        </div>
      )}
      <ProductActions product={product} variant={selected} />
    </div>
  );
}
