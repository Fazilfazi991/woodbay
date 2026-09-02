import type { CartLine } from "./types";

function variantDetails(line: CartLine) {
  if (!line.variant) return [];
  return [
    line.variant.name,
    line.variant.sku ? `Code: ${line.variant.sku}` : null,
    line.variant.size ? `Size: ${line.variant.size}` : null,
    line.variant.dimension ? `Dimension: ${line.variant.dimension}` : null,
    line.variant.finish ? `Finish: ${line.variant.finish}` : null,
    line.variant.colour ? `Colour: ${line.variant.colour}` : null,
  ].filter((value): value is string => Boolean(value));
}

export function buildCartEnquiryMessage(lines: CartLine[]) {
  const products = lines
    .map((line, index) => {
      const details = variantDetails(line);
      return [
        `${index + 1}. ${line.product.name}`,
        line.product.productCode
          ? `   Product code: ${line.product.productCode}`
          : null,
        ...details.map((detail) => `   ${detail}`),
        `   Quantity: ${line.quantity}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
  return `Hello WoodBay,\n\nI would like to enquire about the following products:\n\n${products}\n\nPlease share further details.`;
}

export function cartWhatsAppHref(
  whatsappUrl: string | null,
  lines: CartLine[],
) {
  if (!whatsappUrl || !lines.length) return null;
  return `${whatsappUrl}${whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent(buildCartEnquiryMessage(lines))}`;
}
