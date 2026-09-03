import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  CatalogueCategory,
  CatalogueParams,
  CatalogueProduct,
  ProductDetail,
  ProductVariant,
} from "../types";
import type { ProductDivision } from "./taxonomy";
import { divisionSlugForCategory, divisionSubcategorySlugs } from "./taxonomy";
import { localProductImage } from "./local-images";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/env";
import { catalogueSearchScore, matchesCatalogueSearch } from "./search";
export {
  catalogueSearchScore,
  matchesCatalogueSearch,
  normalizeCatalogueSearch,
} from "./search";
export const PAGE_SIZE = 12;
export function parseCatalogueParams(
  input: Record<string, string | string[] | undefined>,
): CatalogueParams {
  const rawPage = Array.isArray(input.page) ? input.page[0] : input.page;
  const sort = Array.isArray(input.sort) ? input.sort[0] : input.sort;
  const rawSubcategory = Array.isArray(input.subcategory)
    ? input.subcategory[0]
    : input.subcategory;
  return {
    q: (Array.isArray(input.q) ? input.q[0] : (input.q ?? ""))
      .trim()
      .slice(0, 100),
    subcategory: rawSubcategory?.trim() || null,
    page: Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1),
    sort: sort === "name-asc" || sort === "name-desc" ? sort : "default",
  };
}
export function primaryImage(product: CatalogueProduct) {
  return (
    [...product.images].sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.sort_order - b.sort_order,
    )[0] ?? localProductImage(product.slug, product.name)
  );
}
export function productDetailPath(
  product: Pick<CatalogueProduct, "slug" | "category">,
) {
  const subcategory = product.category?.slug ?? "collection";
  return `/products/${divisionSlugForCategory(subcategory)}/${subcategory}/${product.slug}`;
}

export type ProductSpecificationEntry = {
  label: string;
  value: string | string[];
};

function specificationValue(value: unknown): string | string[] | null {
  if (Array.isArray(value)) {
    const items = value
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .filter(
        (item): item is string | number | boolean =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean",
      )
      .map((item) => String(item).trim())
      .filter(Boolean);
    return items.length ? items : null;
  }

  if (typeof value === "string") {
    const clean = value.trim();
    if (!clean) return null;

    if (clean.startsWith("[") && clean.endsWith("]")) {
      try {
        return specificationValue(JSON.parse(clean));
      } catch {
        // Keep malformed legacy text readable instead of failing the page.
      }
    }

    const lines = clean
      .split(/\r?\n|\\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length > 1 ? lines : clean;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return null;
}

export function productSpecifications(product: ProductDetail) {
  const primary = product.variants[0];
  const entries = [
    { label: "Product Code", value: product.product_code },
    { label: "Dimension", value: primary?.dimension },
    { label: "Size", value: primary?.size },
    { label: "Finish", value: primary?.finish },
    { label: "Colour", value: primary?.colour },
    { label: "Material", value: primary?.material },
    { label: "Packing", value: primary?.packing_information },
    { label: "Catalogue Page", value: product.catalogue_page_number },
    ...Object.entries(primary?.metadata ?? {}).map(([label, value]) => ({
      label: label
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()),
      value: specificationValue(value),
    })),
  ];
  return entries
    .map((entry) => ({ ...entry, value: specificationValue(entry.value) }))
    .filter(
      (entry): entry is ProductSpecificationEntry => entry.value !== null,
    );
}
export async function getTopLevelCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("id,name,slug,description,parent_id,sort_order,is_active")
    .is("parent_id", null)
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data as CatalogueCategory[];
}
export const getCategoryBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("id,name,slug,description,parent_id,sort_order,is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data as CatalogueCategory | null;
});
export async function getChildCategories(parentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("id,name,slug,description,parent_id,sort_order,is_active")
    .eq("parent_id", parentId)
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data as CatalogueCategory[];
}
export async function getDivisionCategories(division: ProductDivision) {
  const supabase = await createClient();
  const allowed = new Set(
    divisionSubcategorySlugs[
      division.slug as keyof typeof divisionSubcategorySlugs
    ],
  );
  const requestedSlugs = [
    ...new Set([...division.sourceCategorySlugs, ...allowed]),
  ];
  const { data: direct, error } = await supabase
    .from("product_categories")
    .select("id,name,slug,description,parent_id,sort_order,is_active")
    .in("slug", requestedSlugs)
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  const roots = (direct ?? []).filter(
    (category) => !category.parent_id,
  ) as CatalogueCategory[];
  const children = roots.length
    ? await Promise.all(roots.map((root) => getChildCategories(root.id)))
    : [];
  const all = [...(direct ?? []), ...children.flat()] as CatalogueCategory[];
  const unique = new Map(all.map((category) => [category.id, category]));
  if (division.slug === "smart-furniture")
    return [...unique.values()].filter(
      (category) => category.slug === "smart-furniture",
    );
  const eligible = [...unique.values()].filter((category) =>
    allowed.has(category.slug as never),
  );
  if (!eligible.length) return [];
  const { data: populated, error: populatedError } = await supabase
    .from("products")
    .select("category_id")
    .in(
      "category_id",
      eligible.map((category) => category.id),
    )
    .eq("status", "published");
  if (populatedError) throw populatedError;
  const populatedIds = new Set((populated ?? []).map((row) => row.category_id));
  return eligible.filter((category) => populatedIds.has(category.id));
}
export async function getDivisionProducts(
  division: ProductDivision,
  categories: CatalogueCategory[],
  params: CatalogueParams,
) {
  let selected = categories;
  if (params.subcategory) {
    const match = categories.find(
      (category) => category.slug === params.subcategory,
    );
    if (match) selected = [match];
  }
  if (!selected.length)
    return { products: [] as CatalogueProduct[], count: 0, pageCount: 1 };
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id,name,slug,short_description,description,product_code,category_id,created_at,raw_catalogue_data,product_categories(name,slug),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id)",
      { count: "exact" },
    )
    .in(
      "category_id",
      selected.map((category) => category.id),
    )
    .eq("status", "published");
  query =
    params.sort === "name-desc"
      ? query.order("name", { ascending: false })
      : params.sort === "name-asc"
        ? query.order("name", { ascending: true })
        : query.order("sort_order").order("name");
  const from = (params.page - 1) * PAGE_SIZE;
  const { data, error, count } = params.q
    ? await query
    : await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  const mapped = (data ?? []).map((product) => ({
    ...product,
    category: Array.isArray(product.product_categories)
      ? (product.product_categories[0] ?? null)
      : product.product_categories,
    images: product.product_images ?? [],
    variants: product.product_variants ?? [],
  })) as CatalogueProduct[];
  const searchFields = (product: CatalogueProduct) => ({
    productName: product.name,
    productSlug: product.slug,
    productCode: product.product_code,
    shortDescription: product.short_description,
    description: product.description,
    rawCatalogueData: product.raw_catalogue_data,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    parentName: division.name,
    parentSlug: division.slug,
  });
  const matching = params.q
    ? mapped
        .filter((product) =>
          matchesCatalogueSearch(params.q, searchFields(product)),
        )
        .sort((a, b) =>
          params.sort === "default"
            ? catalogueSearchScore(params.q, searchFields(b)) -
              catalogueSearchScore(params.q, searchFields(a))
            : 0,
        )
    : mapped;
  const total = params.q ? matching.length : (count ?? 0);
  const products = params.q ? matching.slice(from, from + PAGE_SIZE) : matching;
  return {
    products,
    count: total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
export async function getProducts(
  category: CatalogueCategory,
  children: CatalogueCategory[],
  params: CatalogueParams,
) {
  const categoryIds = [category.id, ...children.map((child) => child.id)];
  if (params.subcategory) {
    const match = children.find((child) => child.slug === params.subcategory);
    if (match) categoryIds.splice(0, categoryIds.length, match.id);
  }
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id,name,slug,short_description,description,product_code,category_id,created_at,raw_catalogue_data,product_categories(name,slug),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id)",
      { count: "exact" },
    )
    .in("category_id", categoryIds)
    .eq("status", "published");
  query =
    params.sort === "name-desc"
      ? query.order("name", { ascending: false })
      : query.order("name", { ascending: true });
  const from = (params.page - 1) * PAGE_SIZE;
  const { data, error, count } = params.q
    ? await query
    : await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  const mapped = (data ?? []).map((product) => ({
    ...product,
    category: Array.isArray(product.product_categories)
      ? (product.product_categories[0] ?? null)
      : product.product_categories,
    images: product.product_images ?? [],
    variants: product.product_variants ?? [],
  })) as CatalogueProduct[];
  const searchFields = (product: CatalogueProduct) => ({
    productName: product.name,
    productSlug: product.slug,
    productCode: product.product_code,
    shortDescription: product.short_description,
    description: product.description,
    rawCatalogueData: product.raw_catalogue_data,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    parentName: category.name,
    parentSlug: category.slug,
  });
  const matching = params.q
    ? mapped
        .filter((product) =>
          matchesCatalogueSearch(params.q, searchFields(product)),
        )
        .sort((a, b) =>
          params.sort === "default"
            ? catalogueSearchScore(params.q, searchFields(b)) -
              catalogueSearchScore(params.q, searchFields(a))
            : 0,
        )
    : mapped;
  const total = params.q ? matching.length : (count ?? 0);
  const products = params.q ? matching.slice(from, from + PAGE_SIZE) : matching;
  return {
    products,
    count: total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}
export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,short_description,product_code,category_id,created_at,product_categories(name,slug),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id)",
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("sort_order")
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((product) => ({
    ...product,
    category: Array.isArray(product.product_categories)
      ? (product.product_categories[0] ?? null)
      : product.product_categories,
    images: product.product_images ?? [],
    variants: product.product_variants ?? [],
  })) as CatalogueProduct[];
}

export async function getSitemapCatalogueEntries() {
  const supabase = await createClient();
  const [
    { data: products, error: productError },
    { data: categories, error: categoryError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("slug,created_at,category_id,product_categories(slug,parent_id)")
      .eq("status", "published"),
    supabase
      .from("product_categories")
      .select("id,slug,parent_id")
      .eq("is_active", true),
  ]);
  if (productError) throw productError;
  if (categoryError) throw categoryError;
  const categoryById = new Map(
    (categories ?? []).map((category) => [category.id, category]),
  );
  const populated = new Set(
    (products ?? []).map((product) => product.category_id),
  );
  const categoryEntries = (categories ?? [])
    .filter((category) => category.parent_id && populated.has(category.id))
    .map((category) => {
      const parent = categoryById.get(category.parent_id!);
      return parent
        ? {
            url: `/products/${divisionSlugForCategory(category.slug)}/${category.slug}`,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const productEntries = (products ?? []).flatMap((product) => {
    const relation = Array.isArray(product.product_categories)
      ? product.product_categories[0]
      : product.product_categories;
    if (!relation) return [];
    return [
      {
        url: `/products/${divisionSlugForCategory(relation.slug)}/${relation.slug}/${product.slug}`,
        lastModified: product.created_at,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ];
  });
  return [...categoryEntries, ...productEntries];
}

export async function getPublishedProductRouteParams() {
  const { url, key } = getSupabasePublicEnv();
  const supabase = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("products")
    .select("slug,product_categories(slug)")
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []).flatMap((product) => {
    const category = Array.isArray(product.product_categories)
      ? product.product_categories[0]
      : product.product_categories;
    if (!category) return [];
    return [
      {
        categorySlug: divisionSlugForCategory(category.slug),
        subcategorySlug: category.slug,
        productSlug: product.slug,
      },
    ];
  });
}

export async function getHomepageCatalogueProducts() {
  const slugs = [
    "glass-pantry-with-bidding",
    "tandem-box-system",
    "wardrobe-lift",
    "wallpaper",
    "soft-close-hinge",
    "bottle-pullout",
    "corner-basket",
    "wardrobe-trouser-rack",
  ];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,short_description,product_code,category_id,created_at,product_categories(name,slug),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id)",
    )
    .eq("status", "published")
    .in("slug", slugs);
  if (error) throw error;
  const order = new Map(slugs.map((slug, index) => [slug, index]));
  return (data ?? [])
    .map((product) => ({
      ...product,
      category: Array.isArray(product.product_categories)
        ? (product.product_categories[0] ?? null)
        : product.product_categories,
      images: product.product_images ?? [],
      variants: product.product_variants ?? [],
    }))
    .sort(
      (a, b) =>
        (order.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
    ) as CatalogueProduct[];
}
export const getProductBySlug = cache(async (productSlug: string) => {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,short_description,description,product_code,category_id,created_at,seo_title,seo_description,catalogue_page_number,catalogue_source_reference,raw_catalogue_data,whatsapp_enabled,product_categories(id,name,slug,parent_id,description,sort_order,is_active),product_images(storage_key,alt_text,sort_order,is_primary,image_role,raw_catalogue_reference),product_variants(id,name,sku,dimension,size,finish,colour,material,packing_information,raw_catalogue_data,metadata,sort_order)",
    )
    .eq("slug", productSlug)
    .eq("status", "published")
    .maybeSingle();
  if (error?.code === "PGRST204" || error?.code === "42703") {
    const legacy = await supabase
      .from("products")
      .select(
        "id,name,slug,short_description,description,product_code,category_id,created_at,seo_title,seo_description,product_categories(id,name,slug,parent_id,description,sort_order,is_active),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id,name,sku,dimension,finish,metadata,sort_order)",
      )
      .eq("slug", productSlug)
      .eq("status", "published")
      .maybeSingle();
    data = legacy.data as typeof data;
    error = legacy.error;
  }
  if (error) throw error;
  if (!data) return null;
  const category = Array.isArray(data.product_categories)
    ? data.product_categories[0]
    : data.product_categories;
  const parentCategory = category?.parent_id
    ? await getCategoryById(category.parent_id)
    : category;
  return {
    ...data,
    category,
    parentCategory,
    images: data.product_images ?? [],
    variants: (data.product_variants ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    features: Array.isArray(
      (
        data.product_variants?.[0]?.metadata as
          Record<string, unknown> | undefined
      )?.features,
    )
      ? (data.product_variants?.[0]?.metadata as { features: string[] })
          .features
      : [],
  } as ProductDetail;
});
async function getCategoryById(id: string) {
  const supabase = await createClient();
  let { data, error } = await supabase
    .from("product_categories")
    .select("id,name,slug,description,parent_id,sort_order,is_active")
    .eq("id", id)
    .maybeSingle();
  if (error?.code === "PGRST204" || error?.code === "42703") {
    const legacy = await supabase
      .from("product_categories")
      .select("id,name,slug,description,parent_id,sort_order,is_active")
      .eq("id", id)
      .maybeSingle();
    data = legacy.data as typeof data;
    error = legacy.error;
  }
  if (error) throw error;
  return data as CatalogueCategory | null;
}
export async function getRelatedProducts(product: ProductDetail, limit = 4) {
  const supabase = await createClient();
  const select =
    "id,name,slug,short_description,product_code,category_id,created_at,product_categories(name,slug),product_images(storage_key,alt_text,sort_order,is_primary),product_variants(id)";
  const map = (items: unknown[]) =>
    items.map((item) => {
      const row = item as {
        product_categories: CatalogueProduct["category"];
        product_images: CatalogueProduct["images"];
        product_variants: Pick<ProductVariant, "id">[];
      } & CatalogueProduct;
      return {
        ...row,
        category: Array.isArray(row.product_categories)
          ? (row.product_categories[0] ?? null)
          : row.product_categories,
        images: row.product_images ?? [],
        variants: row.product_variants ?? [],
      };
    }) as CatalogueProduct[];
  const { data: direct, error } = await supabase
    .from("products")
    .select(select)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("status", "published")
    .order("sort_order")
    .limit(limit);
  if (error) throw error;
  if (
    (direct ?? []).length >= limit ||
    !product.parentCategory ||
    product.parentCategory.id === product.category_id
  )
    return map(direct ?? []);
  const children = await getChildCategories(product.parentCategory.id);
  const { data: fallback, error: fallbackError } = await supabase
    .from("products")
    .select(select)
    .in("category_id", [
      product.parentCategory.id,
      ...children.map((child) => child.id),
    ])
    .neq("id", product.id)
    .eq("status", "published")
    .order("sort_order")
    .limit(limit);
  if (fallbackError) throw fallbackError;
  return map(fallback ?? []);
}
