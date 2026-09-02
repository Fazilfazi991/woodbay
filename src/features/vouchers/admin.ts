"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeCsvValue } from "./admin-utils";

const filtersSchema = z.object({
  q: z.string().optional().default(""),
  status: z
    .enum(["all", "available", "redeemed", "disabled", "expired"])
    .optional()
    .default("all"),
  page: z.coerce.number().int().min(1).default(1),
  product: z.string().uuid().or(z.literal("")).optional().default(""),
  dealer: z.string().uuid().or(z.literal("")).optional().default(""),
});
const generationSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(100),
  expiry: z.string().optional(),
  idempotency: z.string().uuid(),
  product_id: z.string().uuid().or(z.literal("")).transform((value) => value || null),
  dealer_id: z.string().uuid().or(z.literal("")).transform((value) => value || null),
});
export type GenerationActionState = {
  error?: string;
  codes?: string[];
  quantity?: number;
  voucherId?: string;
};
type VoucherStatus = "available" | "redeemed" | "disabled";
export type VoucherRow = {
  id: string;
  code: string;
  batchReference: string | null;
  valueBenefit: string | null;
  status: VoucherStatus;
  createdAt: string;
  expiresAt: string | null;
  redeemedAt: string | null;
  createdBy: { fullName: string } | null;
  product: { name: string } | null;
  dealer: { businessName: string } | null;
  customerName: string | null;
};
type RawVoucherRow = {
  id: string;
  code: string;
  batch_reference: string | null;
  value_benefit: string | null;
  status: VoucherStatus;
  created_at: string;
  expires_at: string | null;
  redeemed_at: string | null;
  admin_profiles: { full_name: string } | { full_name: string }[] | null;
  products: { name: string } | { name: string }[] | null;
  dealers: { business_name: string } | { business_name: string }[] | null;
  voucher_redemptions: { customer_name: string } | { customer_name: string }[] | null;
};
async function admin() {
  const actor = await getActiveAdmin();
  if (!actor) throw new Error("Unauthorized");
  return actor;
}
export async function listVouchers(input: unknown) {
  await admin();
  const f = filtersSchema.parse(input);
  const from = (f.page - 1) * 20;
  const db = createAdminClient();
  let query = db
    .from("voucher_codes")
    .select(
      "id,code,batch_reference,value_benefit,status,created_at,expires_at,redeemed_at,admin_profiles!voucher_codes_created_by_fkey(full_name),products(name),dealers(business_name),voucher_redemptions(customer_name)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, from + 19);
  if (f.q) query = query.ilike("code", `%${f.q.toUpperCase()}%`);
  if (f.status !== "all" && f.status !== "expired")
    query = query.eq("status", f.status);
  if (f.status === "expired")
    query = query
      .eq("status", "available")
      .lt("expires_at", new Date().toISOString().slice(0, 10));
  if (f.product) query = query.eq("product_id", f.product);
  if (f.dealer) query = query.eq("dealer_id", f.dealer);
  const { data, count, error } = await query;
  if (error) throw new Error("Unable to load vouchers.");
  const rows = (data ?? []).map((raw: RawVoucherRow): VoucherRow => {
    const profile = Array.isArray(raw.admin_profiles)
      ? (raw.admin_profiles[0] ?? null)
      : raw.admin_profiles;
    const product = Array.isArray(raw.products) ? raw.products[0] : raw.products;
    const dealer = Array.isArray(raw.dealers) ? raw.dealers[0] : raw.dealers;
    const redemption = Array.isArray(raw.voucher_redemptions) ? raw.voucher_redemptions[0] : raw.voucher_redemptions;
    return {
      id: raw.id,
      code: raw.code,
      batchReference: raw.batch_reference,
      valueBenefit: raw.value_benefit,
      status: raw.status,
      createdAt: raw.created_at,
      expiresAt: raw.expires_at,
      redeemedAt: raw.redeemed_at,
      createdBy: profile ? { fullName: profile.full_name } : null,
      product: product ? { name: product.name } : null,
      dealer: dealer ? { businessName: dealer.business_name } : null,
      customerName: redemption?.customer_name ?? null,
    };
  });
  return { rows, count: count ?? 0, filters: f };
}
export async function generateVouchers(
  _: GenerationActionState,
  form: FormData,
): Promise<GenerationActionState> {
  const actor = await admin();
  const parsed = generationSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter a quantity from 1 to 100." };
  const data = parsed.data;
  const db = createAdminClient();
  const reference = `WB-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${data.idempotency.slice(0, 8).toUpperCase()}`;
  const { data: batchResult, error } = await db.rpc("generate_voucher_batch", {
    p_actor_id: actor.userId,
    p_reference: reference,
    p_quantity: data.quantity,
    p_value_benefit: "",
    p_expires_at: data.expiry || null,
    p_admin_note: "",
    p_idempotency_key: data.idempotency,
    p_product_id: data.product_id,
    p_dealer_id: data.dealer_id,
  });
  if (error) return { error: "Voucher generation failed. Please try again." };
  const batch = batchResult?.[0] as { batch_id?: string } | undefined;
  if (!batch?.batch_id) return { error: "Voucher generation did not return a batch." };
  const { data: vouchers, error: voucherError } = await db
    .from("voucher_codes")
    .select("id,code")
    .eq("batch_id", batch.batch_id)
    .order("created_at", { ascending: true });
  if (voucherError) return { error: "Voucher generation completed, but the codes could not be loaded." };
  revalidatePath("/admin/vouchers");
  return {
    codes: (vouchers ?? []).map((voucher) => voucher.code),
    quantity: data.quantity,
    voucherId: vouchers?.[0]?.id,
  };
}
export async function disableVoucher(form: FormData) {
  const actor = await admin();
  const id = z.string().uuid().parse(form.get("id"));
  const db = createAdminClient();
  const { data, error } = await db
    .from("voucher_codes")
    .update({ status: "disabled" })
    .eq("id", id)
    .eq("status", "available")
    .select("id")
    .maybeSingle();
  if (error || !data)
    throw new Error("Only an available voucher can be disabled.");
  await db.from("voucher_admin_audit_events").insert({
    actor_id: actor.userId,
    action: "voucher_disabled",
    voucher_id: id,
    metadata: {},
  });
  revalidatePath("/admin/vouchers");
}
export async function getVoucherDetail(id: string) {
  await admin();
  const voucherId = z.string().uuid().parse(id);
  const db = createAdminClient();
  const [{ data: voucher, error }, { data: audits }] = await Promise.all([
    db
      .from("voucher_codes")
      .select(
        "id,code,batch_reference,value_benefit,status,created_at,expires_at,redeemed_at,admin_note,admin_profiles!voucher_codes_created_by_fkey(full_name),products(name,slug),dealers(business_name,slug),voucher_redemptions(customer_name,phone,location,district,dealer_name,redeemed_at,products(name,slug),dealers(business_name,slug))",
      )
      .eq("id", voucherId)
      .maybeSingle(),
    db
      .from("voucher_admin_audit_events")
      .select(
        "action,created_at,metadata,admin_profiles!voucher_admin_audit_events_actor_id_fkey(full_name)",
      )
      .eq("voucher_id", voucherId)
      .order("created_at", { ascending: false }),
  ]);
  if (error || !voucher) throw new Error("Voucher not found.");
  return { voucher, audits: audits ?? [] };
}
export async function exportVouchers(input: unknown) {
  const filters = filtersSchema.parse(input);
  await admin();
  const db = createAdminClient();
  let query = db
    .from("voucher_codes")
    .select(
      "id,code,batch_reference,value_benefit,status,created_at,expires_at,redeemed_at,admin_profiles!voucher_codes_created_by_fkey(full_name),products(name),dealers(business_name),voucher_redemptions(customer_name)",
    )
    .order("created_at", { ascending: false });
  if (filters.q) query = query.ilike("code", `%${filters.q.toUpperCase()}%`);
  if (filters.status !== "all" && filters.status !== "expired")
    query = query.eq("status", filters.status);
  if (filters.status === "expired")
    query = query
      .eq("status", "available")
      .lt("expires_at", new Date().toISOString().slice(0, 10));
  if (filters.product) query = query.eq("product_id", filters.product);
  if (filters.dealer) query = query.eq("dealer_id", filters.dealer);
  const { data, error } = await query;
  if (error) throw new Error("Unable to export vouchers.");
  const rows = (data ?? []).map((raw: RawVoucherRow): VoucherRow => {
    const profile = Array.isArray(raw.admin_profiles)
      ? (raw.admin_profiles[0] ?? null)
      : raw.admin_profiles;
    const product = Array.isArray(raw.products) ? raw.products[0] : raw.products;
    const dealer = Array.isArray(raw.dealers) ? raw.dealers[0] : raw.dealers;
    const redemption = Array.isArray(raw.voucher_redemptions) ? raw.voucher_redemptions[0] : raw.voucher_redemptions;
    return {
      id: raw.id,
      code: raw.code,
      batchReference: raw.batch_reference,
      valueBenefit: raw.value_benefit,
      status: raw.status,
      createdAt: raw.created_at,
      expiresAt: raw.expires_at,
      redeemedAt: raw.redeemed_at,
      createdBy: profile ? { fullName: profile.full_name } : null,
      product: product ? { name: product.name } : null,
      dealer: dealer ? { businessName: dealer.business_name } : null,
      customerName: redemption?.customer_name ?? null,
    };
  });
  const header =
    "Voucher Code,Status,Product,Dealer,Customer,Campaign,Value,Created,Expiry,Redeemed,Created By";
  const lines = rows.map((r) =>
    [
      r.code,
      r.status,
      r.product?.name,
      r.dealer?.businessName,
      r.customerName,
      r.batchReference,
      r.valueBenefit,
      r.createdAt,
      r.expiresAt,
      r.redeemedAt,
      r.createdBy?.fullName,
    ]
      .map(escapeCsvValue)
      .map((v) => `"${v}"`)
      .join(","),
  );
  return `${header}\n${lines.join("\n")}`;
}
