import { siteConfig } from "@/config/site";

type ProductEnquiry = {
  name: string;
  slug: string;
  product_code?: string | null;
  category?: { name: string } | null;
};

export type ProductEnquirySelection = {
  variant?: string | null;
  size?: string | null;
  finish?: string | null;
  model?: string | null;
  link?: string | null;
};

export function buildWhatsAppEnquiryUrl(
  whatsappUrl: string,
  product: ProductEnquiry,
  selection: ProductEnquirySelection = {},
) {
  const selectedDetails = [
    selection.variant,
    selection.size,
    selection.finish,
    selection.model,
  ].filter((value): value is string => Boolean(value?.trim()));
  const productContext = [product.name, ...selectedDetails].join(" — ");
  const categoryContext = product.category?.name
    ? ` from ${product.category.name}`
    : "";
  const introduction = `Hi WoodBay, I’m interested in ${productContext}${categoryContext}.`;
  const message = selection.link
    ? `${introduction}\nProduct: ${selection.link}\nPlease share more details.`
    : `${introduction} Please share more details.`;
  const separator = whatsappUrl.includes("?") ? "&" : "?";
  return `${whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
}

export function productEnquiryHref(
  product: ProductEnquiry,
  selection?: ProductEnquirySelection,
) {
  if (!siteConfig.whatsappUrl) return null;
  return buildWhatsAppEnquiryUrl(siteConfig.whatsappUrl, product, selection);
}
