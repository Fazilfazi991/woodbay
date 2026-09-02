"use client";

import { Check, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import type { CartProduct, CartVariant } from "./types";

export function AddToCartButton({
  product,
  variant,
  compact = false,
  disabled = false,
  className = "",
}: {
  product: CartProduct;
  variant?: CartVariant | null;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const add = () => {
    addItem({ product, variant });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  if (compact)
    return (
      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="inline-flex h-10 min-w-0 items-center justify-center gap-1 rounded-[3px] border border-[color:var(--gold)] px-2 text-[10px] font-semibold whitespace-nowrap text-[#8a681f] transition-colors hover:bg-[color:var(--gold)] hover:text-[#171711] disabled:cursor-not-allowed disabled:opacity-45 sm:gap-1.5 sm:px-3 sm:text-xs"
      >
        {added ? <Check size={13} /> : <Plus size={13} />}{" "}
        {added ? "Added" : "Add to cart"}
      </button>
    );
  return (
    <Button
      type="button"
      onClick={add}
      disabled={disabled}
      className={className}
    >
      {added ? <Check size={16} /> : <ShoppingBag size={16} />}{" "}
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
