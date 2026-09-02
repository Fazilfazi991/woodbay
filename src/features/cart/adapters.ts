import { localProductImage } from "@/features/products/data/local-images";
import { divisionSlugForCategory } from "@/features/products/data/taxonomy";
import type {
  CatalogueProduct,
  ProductVariant,
} from "@/features/products/types";
import type { CartProduct, CartVariant } from "./types";

export function toCartProduct(product: CatalogueProduct): CartProduct {
  const image =
    [...product.images].sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.sort_order - b.sort_order,
    )[0] ?? localProductImage(product.slug, product.name);
  const categorySlug = product.category?.slug ?? "collection";
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    productCode: product.product_code,
    categoryName: product.category?.name ?? null,
    detailPath: `/products/${divisionSlugForCategory(categorySlug)}/${categorySlug}/${product.slug}`,
    image: image
      ? {
          src: image.storage_key,
          alt: image.alt_text ?? `${product.name} by Woodbay`,
        }
      : null,
  };
}

export function toCartVariant(variant: ProductVariant): CartVariant {
  return {
    id: variant.id,
    name: variant.name,
    sku: variant.sku,
    dimension: variant.dimension,
    size: variant.size ?? null,
    finish: variant.finish,
    colour: variant.colour ?? null,
    material: variant.material ?? null,
  };
}
