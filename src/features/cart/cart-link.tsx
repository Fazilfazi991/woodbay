"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartLink({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { itemCount, hydrated } = useCart();
  const count = hydrated ? itemCount : 0;
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={count ? `Cart with ${count} items` : "Cart"}
      className={
        mobile
          ? "flex min-h-14 items-center justify-between border-b border-[color:var(--border-dark)] text-sm font-bold tracking-[.12em] !text-[#f7f3eb] uppercase"
          : "relative grid min-h-11 min-w-11 place-items-center text-[#d7d2c8] transition-colors hover:text-[color:var(--gold)]"
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
          <ShoppingBag size={20} strokeWidth={1.6} />
          {count > 0 && (
            <span className="absolute top-0.5 right-0 grid min-h-5 min-w-5 place-items-center rounded-full bg-[color:var(--gold)] px-1 text-[10px] leading-none font-bold text-[#171711]">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
