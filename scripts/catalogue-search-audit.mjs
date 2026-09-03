import { createClient } from "@supabase/supabase-js";
import {
  matchesCatalogueSearch,
  normalizeCatalogueSearch,
} from "../src/features/products/data/search.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Supabase public environment is required");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const [
  { data: categories, error: categoryError },
  { data: products, error: productError },
] = await Promise.all([
  supabase
    .from("product_categories")
    .select("id,name,slug,parent_id,is_active,sort_order")
    .order("sort_order"),
  supabase
    .from("products")
    .select(
      "id,name,slug,status,category_id,product_code,short_description,description,raw_catalogue_data",
    ),
]);
if (categoryError) throw categoryError;
if (productError) throw productError;

const categoryById = new Map(
  categories.map((category) => [category.id, category]),
);
const activeCategories = categories.filter((category) => category.is_active);
const publishedProducts = products.filter(
  (product) => product.status === "published",
);
const productsByCategory = new Map();
for (const product of publishedProducts) {
  const list = productsByCategory.get(product.category_id) ?? [];
  list.push(product);
  productsByCategory.set(product.category_id, list);
}

function fieldsFor(product) {
  const category = categoryById.get(product.category_id);
  const parent = category?.parent_id
    ? categoryById.get(category.parent_id)
    : category;
  return {
    productName: product.name,
    productSlug: product.slug,
    productCode: product.product_code,
    shortDescription: product.short_description,
    description: product.description,
    rawCatalogueData: product.raw_catalogue_data,
    categoryName: category?.name,
    categorySlug: category?.slug,
    parentName: parent?.name,
    parentSlug: parent?.slug,
  };
}

function searchablePublished(query, categoryId) {
  return publishedProducts.filter(
    (product) =>
      (!categoryId || product.category_id === categoryId) &&
      matchesCatalogueSearch(query, fieldsFor(product)),
  );
}

function usefulPartial(value) {
  return (
    normalizeCatalogueSearch(value)
      .filter((term) => term.length >= 4)
      .sort((a, b) => b.length - a.length)[0]
      ?.slice(0, 4) ?? value
  );
}

const categoryRows = activeCategories.map((category) => {
  const directProducts = productsByCategory.get(category.id) ?? [];
  const descendants = category.parent_id
    ? directProducts
    : publishedProducts.filter((product) => {
        let current = categoryById.get(product.category_id);
        while (current?.parent_id) {
          if (current.parent_id === category.id) return true;
          current = categoryById.get(current.parent_id);
        }
        return product.category_id === category.id;
      });
  const exact = searchablePublished(category.name).filter((product) =>
    descendants.some((expected) => expected.id === product.id),
  ).length;
  const partialQuery = usefulPartial(category.name);
  const partial = searchablePublished(partialQuery).filter((product) =>
    descendants.some((expected) => expected.id === product.id),
  ).length;
  const variations = [
    category.name,
    category.name.toLowerCase(),
    category.name.toUpperCase(),
    `  ${category.name}  `,
    category.slug,
  ];
  const variationsPass =
    descendants.length === 0 ||
    variations.every((query) =>
      descendants.every((product) =>
        matchesCatalogueSearch(query, fieldsFor(product)),
      ),
    );
  return {
    Category: category.name,
    Active: category.is_active,
    Published: descendants.length,
    Exact: exact,
    Partial: partial,
    Result:
      descendants.length === 0 ? "EMPTY" : variationsPass ? "PASS" : "FAIL",
  };
});

const productRows = publishedProducts.map((product) => {
  const fields = fieldsFor(product);
  const category = categoryById.get(product.category_id);
  const partial = usefulPartial(product.name);
  const exactPass = [
    product.name,
    product.name.toLowerCase(),
    product.name.toUpperCase(),
    `  ${product.name}  `,
  ].every((query) => matchesCatalogueSearch(query, fields));
  const partialPass = matchesCatalogueSearch(partial, fields);
  const categoryPass = category
    ? matchesCatalogueSearch(category.name, fields)
    : false;
  return {
    Product: product.name,
    Published: true,
    Category: category?.name ?? "MISSING",
    Exact: exactPass,
    Partial: partialPass,
    CategorySearch: categoryPass,
    Result: exactPass && partialPass && categoryPass ? "PASS" : "FAIL",
  };
});

const brokenRelationships = publishedProducts.filter((product) => {
  const category = categoryById.get(product.category_id);
  return !category || !category.is_active;
});
const emptyCategories = categoryRows.filter((row) => row.Published === 0);
const categoryFailures = categoryRows.filter(
  (row) => row.Published > 0 && row.Result === "FAIL",
);
const productFailures = productRows.filter((row) => row.Result === "FAIL");

console.log("\nCATEGORY SEARCH AUDIT");
console.table(categoryRows);
console.log("\nPRODUCT SEARCH AUDIT");
console.table(productRows);
console.log("\nSUMMARY");
console.log(
  JSON.stringify(
    {
      activeRootCategories: activeCategories.filter(
        (category) => !category.parent_id,
      ).length,
      activeSubcategories: activeCategories.filter(
        (category) => category.parent_id,
      ).length,
      publishedProducts: publishedProducts.length,
      categorySearchCases: categoryRows.length * 6,
      productSearchCases: productRows.length * 6,
      automatedSearchCases:
        categoryRows.length * 6 + productRows.length * 6 + 8,
      emptyCategories: emptyCategories.map((row) => row.Category),
      categoryFailures: categoryFailures.map((row) => row.Category),
      productFailures: productFailures.map((row) => row.Product),
      brokenRelationships: brokenRelationships.map((product) => product.name),
      normalizationCases: [
        "case",
        "outer whitespace",
        "multiple spaces",
        "singular/plural",
        "hyphenated/separated/joined terms",
        "aluminium/aluminum",
        "partial terms",
        "category slugs",
      ],
    },
    null,
    2,
  ),
);

if (
  categoryFailures.length ||
  productFailures.length ||
  brokenRelationships.length
) {
  process.exitCode = 1;
}
