"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProductDetail, ProductVariant } from "../types";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const [index, setIndex] = useState(0);
  const image = product.images[index];
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
        {product.images.length > 1 && (
          <>
            <button
              aria-label="Previous product image"
              onClick={() =>
                setIndex(
                  (index - 1 + product.images.length) % product.images.length,
                )
              }
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center border border-[color:var(--border-gold)] bg-black/50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next product image"
              onClick={() => setIndex((index + 1) % product.images.length)}
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center border border-[color:var(--border-gold)] bg-black/50"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {product.images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {product.images.map((item, itemIndex) => (
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
            className="grid grid-cols-[minmax(8rem,.7fr)_1fr] gap-4 py-4 text-sm"
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

export function ProductVariants({ variants }: { variants: ProductVariant[] }) {
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
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="grid gap-2 py-4 text-sm sm:grid-cols-3"
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
              {[variant.dimension, variant.finish].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductActions({ product }: { product: ProductDetail }) {
  return (
    <section className="border-y border-[color:var(--border-gold)] py-6">
      <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
        Interested in this product?
      </p>
      <div className="mt-4 grid gap-3 sm:flex sm:flex-row">
        <Link
          href={`/contact?product=${product.slug}`}
          className="max-sm:block"
        >
          <Button className="max-sm:w-full">
            <MessageCircle size={16} /> Enquire now
          </Button>
        </Link>
        <Link href="/dealers" className="max-sm:block">
          <Button variant="secondary" className="max-sm:w-full">
            <MapPin size={16} /> Find a dealer
          </Button>
        </Link>
        <Link href="/redeem" className="max-sm:block">
          <Button variant="secondary" className="max-sm:w-full">
            <ShieldCheck size={16} /> Verify voucher
          </Button>
        </Link>
      </div>
    </section>
  );
}
