# Product details

## Route architecture

Product pages use `/products/[categorySlug]/product/[productSlug]`. The explicit `product` segment prevents a collision with existing `/products/[categorySlug]/[subcategorySlug]` category routes.

## Data and visibility

The detail query reads the existing `products`, `product_categories`, `product_images`, and `product_variants` tables. It filters products to `published`; RLS also limits anonymous reads to published products and their active variants/images. Draft and archived records therefore resolve as not found.

## Specifications and variants

`product_variants` stores a primary SKU, dimension, finish, and JSON metadata for secondary documented attributes. Specifications only render populated values. The rerunnable `supabase/seed-product-details.sql` adds a small representative set of values transcribed from `Woodbay (1).pdf`; ambiguous values are intentionally omitted.

## Images and related products

The gallery uses primary/additional `product_images` when present and otherwise renders the Woodbay fallback. Related products are published products in the same subcategory, excluding the current item.

## Future work

The existing product route preserves enquiry context with `/contact?product=<slug>`. Voucher verification is deliberately not rendered yet; it can be introduced later without changing detail URLs. Product editing/import belongs to the future admin CMS.
