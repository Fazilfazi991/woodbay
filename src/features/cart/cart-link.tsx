"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";
import { formatCartBadgeCount } from "./badge";

export function CartLink({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { itemCount, hydrated } = useCart();
  const count = hydrated ? itemCount : 0;
  const badgeCount = formatCartBadgeCount(count);
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={count ? `Cart with ${count} items` : "Cart"}
      className={
        mobile
          ? "flex min-h-14 items-center justify-between border-b border-[color:var(--border-dark)] text-sm font-bold tracking-[.12em] !text-[#f7f3eb] uppercase"
          : "relative grid min-h-11 min-w-11 place-items-center !text-[#f7f3eb] transition-colors hover:!text-[color:var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] active:!text-[color:var(--gold-hover)]"
      }
    >
      {mobile ? (
        <>
          <span>Cart</span>
          <span className="inline-flex items-center gap-2">
            <ShoppingBag size={18} />
            {count > 0 && <span>{count}</span>}
          </span>
        </>
      ) : (
        <>
          <ShoppingBag size={21} strokeWidth={1.7} aria-hidden="true" />
          {badgeCount && (
            <span className="absolute top-0 right-0 grid min-h-5 min-w-5 place-items-center rounded-full border border-[color:var(--background-dark)] bg-[color:var(--gold)] px-1 text-[10px] leading-none font-bold text-[#171711] tabular-nums">
              {badgeCount}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
