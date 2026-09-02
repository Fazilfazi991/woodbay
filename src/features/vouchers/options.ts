import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type VoucherOption = { id: string; slug: string; label: string };

export async function getVoucherOptions() {
  const db = createAdminClient();
  const [{ data: products, error: productError }, { data: dealers, error: dealerError }] =
    await Promise.all([
      db.from("products").select("id,name,slug,product_categories(name)").eq("status", "published").order("name"),
      db.from("dealers").select("id,business_name,slug,area,district").eq("status", "active").eq("is_visible", true).order("business_name"),
    ]);
  if (productError || dealerError) throw new Error("Unable to load voucher choices.");
  return {
    products: (products ?? []).map((item) => {
      const category = Array.isArray(item.product_categories) ? item.product_categories[0] : item.product_categories;
      return { id: item.id, slug: item.slug, label: `${item.name}${category?.name ? ` — ${category.name}` : ""}` };
    }),
    dealers: (dealers ?? []).map((item) => ({
      id: item.id,
      slug: item.slug,
      label: `${item.business_name} — ${item.area || item.district}`,
    })),
  } satisfies { products: VoucherOption[]; dealers: VoucherOption[] };
}
