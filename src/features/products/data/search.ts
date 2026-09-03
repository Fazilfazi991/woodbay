export type CatalogueSearchFields = {
  productName: string;
  categoryName?: string | null;
  categorySlug?: string | null;
  parentName?: string | null;
  parentSlug?: string | null;
  productCode?: string | null;
  productSlug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  rawCatalogueData?: unknown;
};

const GENERIC_CATALOGUE_TERMS = new Set([
  "product",
  "solution",
  "system",
  "unit",
]);

const SPELLING_EQUIVALENTS: Record<string, string> = {
  aluminum: "aluminium",
};

export function normalizeCatalogueSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => SPELLING_EQUIVALENTS[term] ?? term)
    .map((term) =>
      term.length > 3 && term.endsWith("s") ? term.slice(0, -1) : term,
    );
}

function searchableTerms(value: unknown) {
  if (value === null || value === undefined) return [];
  const terms = normalizeCatalogueSearch(
    typeof value === "string" ? value : JSON.stringify(value),
  );
  const joined = terms.flatMap((term, index) =>
    index < terms.length - 1 ? [`${term}${terms[index + 1]}`] : [],
  );
  return [...terms, ...joined];
}

function meaningfulQueryTerms(query: string) {
  const queryTerms = normalizeCatalogueSearch(query);
  const specificTerms = queryTerms.filter(
    (term) => !GENERIC_CATALOGUE_TERMS.has(term),
  );
  return specificTerms.length ? specificTerms : queryTerms;
}

function valuesMatch(query: string, values: unknown[]) {
  const terms = meaningfulQueryTerms(query);
  if (!terms.length) return true;
  const documentTerms = values.flatMap(searchableTerms);
  return terms.every((term) =>
    documentTerms.some(
      (candidate) =>
        candidate === term ||
        (term.length >= 3 && candidate.length >= 3 && candidate.includes(term)),
    ),
  );
}

function normalizedPhrase(value: string | null | undefined) {
  return normalizeCatalogueSearch(value ?? "").join(" ");
}

export function isStrongParentCategoryQuery(
  query: string,
  name?: string | null,
  slug?: string | null,
) {
  const queryTerms = meaningfulQueryTerms(query);
  if (queryTerms.length < 2) return false;
  return valuesMatch(query, [name, slug]);
}

export function catalogueSearchScore(
  query: string,
  fields: CatalogueSearchFields,
) {
  const parentEligible = isStrongParentCategoryQuery(
    query,
    fields.parentName,
    fields.parentSlug,
  );
  const primaryValues = [
    fields.productName,
    fields.categoryName,
    fields.categorySlug,
    fields.productCode,
    fields.productSlug,
    fields.shortDescription,
    fields.description,
    fields.rawCatalogueData,
    ...(parentEligible ? [fields.parentName, fields.parentSlug] : []),
  ];
  if (!valuesMatch(query, primaryValues)) return 0;

  const phrase = normalizedPhrase(query);
  if (phrase === normalizedPhrase(fields.productName)) return 1000;
  if (valuesMatch(query, [fields.productName])) return 850;
  if (
    phrase === normalizedPhrase(fields.categoryName) ||
    phrase === normalizedPhrase(fields.categorySlug)
  )
    return 750;
  if (valuesMatch(query, [fields.categoryName, fields.categorySlug]))
    return 650;
  if (parentEligible) return 550;
  if (valuesMatch(query, [fields.productCode, fields.productSlug])) return 450;
  return 250;
}

export function matchesCatalogueSearch(
  query: string,
  fields: CatalogueSearchFields,
) {
  return catalogueSearchScore(query, fields) > 0;
}
