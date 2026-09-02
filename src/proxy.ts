import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { divisionSlugForCategory } from "@/features/products/data/taxonomy";

export async function proxy(request: NextRequest) {
  const [, , divisionSlug, subcategorySlug, productSlug] = request.nextUrl.pathname.split("/");
  if (!divisionSlug || !subcategorySlug || !productSlug || divisionSlugForCategory(subcategorySlug) !== divisionSlug) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !key) return NextResponse.next();

  const endpoint = new URL("/rest/v1/products", supabaseUrl);
  endpoint.searchParams.set("select", "id,product_categories!inner(slug)");
  endpoint.searchParams.set("slug", `eq.${productSlug}`);
  endpoint.searchParams.set("status", "eq.published");
  endpoint.searchParams.set("product_categories.slug", `eq.${subcategorySlug}`);

  try {
    const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!response.ok) return NextResponse.next();
    const rows = await response.json() as unknown[];
    if (rows.length) return NextResponse.next();
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  } catch {
    // Catalogue availability must not depend on a transient validation request.
    return NextResponse.next();
  }
}

export const config = { matcher: "/products/:division/:subcategory/:product" };
