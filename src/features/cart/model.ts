import type { AddCartItem, CartLine } from "./types";

export const CART_STORAGE_KEY = "woodbay-cart-v1";
export const MAX_CART_QUANTITY = 99;

export function cartLineId(productId: string, variantId?: string | null) {
  return `${productId}:${variantId ?? "default"}`;
}

export function addCartLine(lines: CartLine[], item: AddCartItem): CartLine[] {
  const lineId = cartLineId(item.product.id, item.variant?.id);
  const quantity = Math.max(1, Math.min(MAX_CART_QUANTITY, item.quantity ?? 1));
  const existing = lines.find((line) => line.lineId === lineId);
  if (!existing) {
    return [
      ...lines,
      {
        lineId,
        product: item.product,
        variant: item.variant ?? null,
        quantity,
      },
    ];
  }
  return lines.map((line) =>
    line.lineId === lineId
      ? {
          ...line,
          quantity: Math.min(MAX_CART_QUANTITY, line.quantity + quantity),
        }
      : line,
  );
}

export function setCartLineQuantity(
  lines: CartLine[],
  lineId: string,
  quantity: number,
) {
  if (quantity <= 0) return lines.filter((line) => line.lineId !== lineId);
  return lines.map((line) =>
    line.lineId === lineId
      ? { ...line, quantity: Math.min(MAX_CART_QUANTITY, Math.floor(quantity)) }
      : line,
  );
}

export function cartItemCount(lines: CartLine[]) {
  return lines.reduce((count, line) => count + line.quantity, 0);
}

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Partial<CartLine>;
  return Boolean(
    typeof line.lineId === "string" &&
    line.product &&
    typeof line.product.id === "string" &&
    typeof line.product.name === "string" &&
    typeof line.product.detailPath === "string" &&
    Number.isInteger(line.quantity) &&
    (line.quantity ?? 0) > 0,
  );
}

export function parseStoredCart(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(isCartLine).map((line) => ({
          ...line,
          quantity: Math.min(MAX_CART_QUANTITY, line.quantity),
        }))
      : [];
  } catch {
    return [];
  }
}
