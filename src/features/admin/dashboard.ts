"use server";

import { getActiveAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminDashboard() {
  if (!(await getActiveAdmin())) throw new Error("Unauthorized");
  const db = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const results = await Promise.all([
    db
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    db
      .from("dealer_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("dealers")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("is_visible", true),
    db
      .from("voucher_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "available")
      .or(`expires_at.is.null,expires_at.gte.${today}`),
    db
      .from("voucher_codes")
      .select("id", { count: "exact", head: true })
      .eq("status", "redeemed"),
    db
      .from("furniture_enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("dealer_applications")
      .select("id,business_name,contact_person,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    db
      .from("furniture_enquiries")
      .select("id,name,furniture_type,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    db
      .from("voucher_redemptions")
      .select("id,customer_name,dealer_name,redeemed_at,voucher_id")
      .order("redeemed_at", { ascending: false })
      .limit(4),
  ]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error("Unable to load the admin overview.");
  const [
    products,
    applications,
    dealers,
    vouchers,
    redeemed,
    enquiries,
    recentApplications,
    recentEnquiries,
    recentRedemptions,
  ] = results;
  return {
    metrics: {
      publishedProducts: products.count ?? 0,
      newApplications: applications.count ?? 0,
      publicDealers: dealers.count ?? 0,
      availableVouchers: vouchers.count ?? 0,
      redeemedVouchers: redeemed.count ?? 0,
      newEnquiries: enquiries.count ?? 0,
    },
    recentApplications: recentApplications.data ?? [],
    recentEnquiries: recentEnquiries.data ?? [],
    recentRedemptions: recentRedemptions.data ?? [],
  };
}
