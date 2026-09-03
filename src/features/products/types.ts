export type CatalogueCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  catalogue_group?: string | null;
  landing_content?: Record<string, unknown>;
};
export type CatalogueImage = {
  storage_key: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  image_role?: "primary" | "gallery" | "installed_lifestyle";
  raw_catalogue_reference?: string | null;
};
export type CatalogueProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description?: string | null;
  product_code: string | null;
  category_id: string;
  created_at: string;
  catalogue_page_number?: string | null;
  catalogue_source_reference?: string | null;
  raw_catalogue_data?: Record<string, unknown> | null;
  whatsapp_enabled?: boolean;
  category?: Pick<CatalogueCategory, "name" | "slug"> | null;
  images: CatalogueImage[];
  variants?: Pick<ProductVariant, "id">[];
};
export type ProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  dimension: string | null;
  size?: string | null;
  finish: string | null;
  colour?: string | null;
  material?: string | null;
  packing_information?: string | null;
  raw_catalogue_data?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  sort_order: number;
};
export type ProductDetail = Omit<CatalogueProduct, "category"> & {
  category: CatalogueCategory | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  variants: ProductVariant[];
  parentCategory: CatalogueCategory | null;
  features: string[];
};
export type CatalogueParams = {
  q: string;
  subcategory: string | null;
  page: number;
  sort: "default" | "name-asc" | "name-desc";
};
