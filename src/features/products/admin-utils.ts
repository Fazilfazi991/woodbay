export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;

export function productSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 120);
}

export function productStatusLabel(status: string) {
  return status === "published" ? "Published" : status === "draft" ? "Hidden / Draft" : status === "archived" ? "Archived" : status;
}

export function isSupportedProductImage(type: string, size: number) {
  return new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]).has(type) && size > 0 && size <= 10 * 1024 * 1024;
}
