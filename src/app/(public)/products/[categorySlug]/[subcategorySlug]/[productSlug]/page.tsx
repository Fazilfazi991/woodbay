import { notFound } from "next/navigation";
import ProductPage from "../../product/[productSlug]/page";
import { getCategoryBySlug, getProductBySlug } from "@/features/products/data/catalogue";
import { getProductDivision } from "@/features/products/data/taxonomy";

type Props = { params: Promise<{ categorySlug: string; subcategorySlug: string; productSlug: string }> };
export const dynamic = "force-dynamic";
export default async function CatalogueProductPage({ params }: Props) {
  const { categorySlug, subcategorySlug, productSlug } = await params;
  const [division, category, product] = await Promise.all([Promise.resolve(getProductDivision(categorySlug)), getCategoryBySlug(subcategorySlug), getProductBySlug(productSlug)]);
  if (!division || !category || !product || product.category_id !== category.id) notFound();
  return ProductPage({ params: Promise.resolve({ categorySlug: product.parentCategory?.slug ?? product.category?.slug ?? categorySlug, productSlug }) });
}
