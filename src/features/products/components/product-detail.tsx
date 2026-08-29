"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProductDetail, ProductVariant } from "../types";
import { productEnquiryHref } from "../data/enquiry";
import { localProductImage } from "../data/local-images";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const [index, setIndex] = useState(0);
  const fallback = localProductImage(product.slug, product.name);
  const images =
    product.images.length > 0 ? product.images : fallback ? [fallback] : [];
  const image = images[index];
  if (!image)
    return (
      <div className="grid aspect-square place-items-center border border-[color:var(--border-dark)] bg-[radial-gradient(circle_at_50%_20%,#48483f,transparent_68%),#252620]">
        <span className="font-display text-4xl tracking-[.14em] text-[color:var(--gold)]">
          WOODBAY
        </span>
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
  entries: { label: string; value: string }[];
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
            <dd>{entry.value}</dd>
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
      className="border-t border-[color:var(--border-dark)] pt-8"
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
              className={`grid w-full gap-2 py-4 text-left text-sm sm:grid-cols-3 ${selectedId === variant.id ? "text-[color:var(--foreground-light)]" : "text-[color:var(--muted)]"}`}
            >
              <p className="font-semibold">{variant.name}</p>
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
  const enquiry = productEnquiryHref(
    product,
    variant
      ? { variant: variant.name, size: variant.size, finish: variant.finish }
      : undefined,
  );
  return (
    <section className="border-y border-[color:var(--border-gold)] py-6">
      <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
        Interested in this product?
      </p>
      <div className="mt-4 grid gap-3 sm:flex sm:flex-row">
        {enquiry ? (
          <a
            href={enquiry}
            target="_blank"
            rel="noreferrer"
            className="max-sm:block"
          >
            <Button className="max-sm:w-full">
              <MessageCircle size={16} /> Enquire on WhatsApp
            </Button>
          </a>
        ) : (
          <Button
            disabled
            className="max-sm:w-full"
            title="WhatsApp enquiries are temporarily unavailable"
          >
            <MessageCircle size={16} /> Enquire on WhatsApp
          </Button>
        )}
        <Link href="/dealers" className="max-sm:block">
          <Button variant="secondary" className="max-sm:w-full">
            <MapPin size={16} /> Find a dealer
          </Button>
        </Link>
      </div>
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
    <>
      <ProductActions product={product} variant={selected} />
      {product.variants.length > 0 && (
        <div className="mt-9">
          <ProductVariants
            variants={product.variants}
            selectedId={selected?.id}
            onSelect={(variant) =>
              setSelected(selected?.id === variant.id ? null : variant)
            }
          />
          <p className="mt-3 text-xs text-[color:var(--muted)]">
            Select an option to include it in your WhatsApp enquiry.
          </p>
        </div>
      )}
    </>
  );
}
