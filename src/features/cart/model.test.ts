import { describe, expect, it } from "vitest";
import {
  addCartLine,
  cartItemCount,
  parseStoredCart,
  setCartLineQuantity,
} from "./model";
import type { CartProduct, CartVariant } from "./types";

const product: CartProduct = {
  id: "product-1",
  name: "Drawer",
  slug: "drawer",
  productCode: "DR-1",
  categoryName: "Kitchen",
  detailPath: "/products/kitchen/drawers/drawer",
  image: null,
};
const variant: CartVariant = {
  id: "variant-1",
  name: "Walnut",
  sku: null,
  dimension: null,
  size: null,
  finish: "Walnut",
  colour: null,
  material: null,
};

describe("cart model", () => {
  it("increments identical product and variant lines", () => {
    const once = addCartLine([], { product, variant });
    const twice = addCartLine(once, { product, variant });
    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it("keeps different variants as different lines", () => {
    const lines = addCartLine(addCartLine([], { product }), {
      product,
      variant,
    });
    expect(lines).toHaveLength(2);
  });

  it("removes a line when its quantity reaches zero", () => {
    const lines = addCartLine([], { product });
    expect(setCartLineQuantity(lines, lines[0].lineId, 0)).toEqual([]);
  });

  it("counts quantities and ignores malformed persisted data", () => {
    const lines = addCartLine([], { product, quantity: 3 });
    expect(cartItemCount(lines)).toBe(3);
    expect(parseStoredCart("not-json")).toEqual([]);
  });
});
