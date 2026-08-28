import { siteConfig } from "@/config/site";

export function productEnquiryHref(product: {
  name: string;
  slug: string;
  product_code?: string | null;
}) {
  if (!siteConfig.whatsappUrl) return `/contact?product=${product.slug}`;
  const page = `${siteConfig.url}/products/${product.slug}`;
  const message = [
    "Hello WoodBay, I'm interested in:",
    `Product: ${product.name}`,
    product.product_code ? `Code: ${product.product_code}` : null,
    `Page: ${page}`,
    "",
    "Please share more details.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  const separator = siteConfig.whatsappUrl.includes("?") ? "&" : "?";
  return `${siteConfig.whatsappUrl}${separator}text=${encodeURIComponent(message)}`;
}

export function isWhatsAppEnquiry() {
  return Boolean(siteConfig.whatsappUrl);
}
