"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCart } from "./cart-provider";
import { buildCartEnquiryMessage, cartWhatsAppHref } from "./enquiry";

export function CartPage() {
  const { lines, itemCount, hydrated, removeItem, setQuantity, clearCart } =
    useCart();
  if (!hydrated)
    return (
      <div className="min-h-64 animate-pulse border-y border-[color:var(--border-light)]" />
    );
  if (!lines.length)
    return (
      <div className="border-y border-[color:var(--border-light)] py-16 text-center">
        <h2 className="font-display text-4xl">
          Your cart is ready when you are.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[color:var(--muted-dark)]">
          Save products here as you browse, then send the complete list to
          WoodBay for availability and specifications.
        </p>
        <Link href="/products" className={buttonClassName("primary", "mt-7")}>
          Explore products <ArrowRight size={15} />
        </Link>
      </div>
    );
  const whatsapp = cartWhatsAppHref(siteConfig.whatsappUrl, lines);
  const contactHref = `/contact?subject=${encodeURIComponent("Cart enquiry")}&message=${encodeURIComponent(buildCartEnquiryMessage(lines))}`;
  return (
    <div className="cart-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
      <section
        aria-label="Cart items"
        className="divide-y divide-[color:var(--border-light)] border-y border-[color:var(--border-light)]"
      >
        {lines.map((line) => (
          <article
            key={line.lineId}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:gap-6"
          >
            <Link
              href={line.product.detailPath}
              className="relative aspect-square overflow-hidden bg-[color:var(--surface-muted)]"
            >
              {line.product.image ? (
                <Image
                  src={line.product.image.src}
                  alt={line.product.image.alt}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              ) : (
                <span className="grid h-full place-items-center px-2 text-center text-[10px] text-[color:var(--muted-dark)]">
                  Image coming soon
                </span>
              )}
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[.12em] text-[#8a681f] uppercase">
                {line.product.categoryName ?? "WoodBay collection"}
              </p>
              <Link
                href={line.product.detailPath}
                className="font-display mt-1 block text-2xl leading-tight hover:text-[#8a681f]"
              >
                {line.product.name}
              </Link>
              {line.product.productCode && (
                <p className="mt-1 text-xs text-[color:var(--muted-dark)]">
                  Code: {line.product.productCode}
                </p>
              )}
              {line.variant && (
                <p className="mt-2 text-sm text-[color:var(--muted-dark)]">
                  {[
                    line.variant.name,
                    line.variant.size,
                    line.variant.finish,
                    line.variant.colour,
                  ]
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(" · ")}
                </p>
              )}
              <div className="mt-4 inline-flex items-center border border-[color:var(--border-light)]">
                <button
                  type="button"
                  aria-label={`Decrease ${line.product.name} quantity`}
                  onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                  className="grid size-11 place-items-center hover:bg-[color:var(--surface-muted)]"
                >
                  <Minus size={14} />
                </button>
                <span
                  aria-label={`Quantity ${line.quantity}`}
                  className="min-w-10 text-center text-sm font-semibold tabular-nums"
                >
                  {line.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase ${line.product.name} quantity`}
                  onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                  className="grid size-11 place-items-center hover:bg-[color:var(--surface-muted)]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(line.lineId)}
              className="col-start-2 inline-flex min-h-11 items-center gap-2 self-start justify-self-start text-xs font-semibold text-[color:var(--muted-dark)] hover:text-[color:var(--destructive)] sm:col-start-3 sm:row-start-1 sm:justify-self-end"
              aria-label={`Remove ${line.product.name} from cart`}
            >
              <Trash2 size={15} /> Remove
            </button>
          </article>
        ))}
      </section>
      <aside className="bg-[#24251f] p-6 text-[color:var(--foreground-light)] sm:p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-3xl">Enquiry summary</h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          {itemCount} item{itemCount === 1 ? "" : "s"} across {lines.length}{" "}
          product{lines.length === 1 ? "" : "s"}. WoodBay will confirm product
          details and availability.
        </p>
        <div className="mt-7 grid gap-3">
          <Link
            href={contactHref}
            className={buttonClassName("gold", "w-full")}
          >
            Send cart enquiry <ArrowRight size={15} />
          </Link>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName("secondary", "w-full")}
            >
              <MessageCircle size={16} /> WhatsApp cart
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="mt-6 min-h-11 text-xs font-semibold text-[color:var(--muted)] underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}
