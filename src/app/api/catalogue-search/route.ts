import { NextResponse } from "next/server";
import {
  getGlobalCatalogueSearch,
  primaryImage,
  productDetailPath,
} from "@/features/products/data/catalogue";

export async function GET(request: Request) {
  const q =
    new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2)
    return NextResponse.json({ products: [], categories: [], total: 0 });

  try {
    const result = await getGlobalCatalogueSearch(q, 6);
    return NextResponse.json({
      total: result.total,
      categories: result.categories.map(({ name, href }) => ({ name, href })),
      products: result.products.map((product) => {
        const image = primaryImage(product);
        return {
          name: product.name,
          code: product.product_code,
          category: product.category?.name ?? "Woodbay Collection",
          href: productDetailPath(product),
          image: image?.storage_key ?? null,
          alt: image?.alt_text ?? `${product.name} by Woodbay`,
        };
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Search is temporarily unavailable." },
      { status: 503 },
    );
  }
}
