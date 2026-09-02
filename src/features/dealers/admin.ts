"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveAdmin } from "@/lib/auth/admin";
import { isSafeHttpUrl } from "@/lib/security/url";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStorageProvider } from "@/lib/storage";
import { getExpectedMediaObjectKey } from "@/lib/security/media";
import { isSafeImageUpload } from "@/lib/security/upload";

const applicationStatuses = ["new", "contacted", "qualified", "approved", "rejected"] as const;
const statusSchema = z.enum(["all", ...applicationStatuses]);
const idSchema = z.string().uuid();

export type DealerApplicationRow = {
  id: string; businessName: string; contactPerson: string; phone: string;
  location: string; state: string; district: string; businessType: string | null; productInterests: string[];
  status: "new" | "contacted" | "qualified" | "approved" | "rejected";
  createdAt: string; dealerId: string | null;
};

async function requireAdmin() {
  const admin = await getActiveAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function mapApplication(row: Record<string, unknown>): DealerApplicationRow {
  return {
    id: String(row.id), businessName: String(row.business_name), contactPerson: String(row.contact_person), phone: String(row.phone),
    location: String(row.location), state: String(row.state), district: String(row.district),
    businessType: row.business_type ? String(row.business_type) : null,
    productInterests: Array.isArray(row.product_interests) ? row.product_interests.map(String) : [],
    status: row.status as DealerApplicationRow["status"], createdAt: String(row.created_at), dealerId: row.dealer_id ? String(row.dealer_id) : null,
  };
}

export async function listDealerApplications(input: Record<string, string | undefined>) {
  await requireAdmin();
  const q = (input.q ?? "").trim().slice(0, 120);
  const status = statusSchema.catch("all").parse(input.status ?? "all");
  const location = (input.location ?? "").trim().slice(0, 120);
  const businessType = (input.business_type ?? "").trim().slice(0, 80);
  const productInterest = (input.product_interest ?? "").trim().slice(0, 120);
  const db = createAdminClient();
  let query = db.from("dealer_applications").select("id,business_name,contact_person,phone,location,state,district,business_type,product_interests,status,created_at,dealer_id", { count: "exact" }).order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (q) query = query.or(`business_name.ilike.%${q}%,contact_person.ilike.%${q}%,phone.ilike.%${q}%`);
  if (location) query = query.or(`location.ilike.%${location}%,district.ilike.%${location}%`);
  if (businessType) query = query.eq("business_type", businessType);
  if (productInterest) query = query.contains("product_interests", [productInterest]);
  const { data, error, count } = await query;
  if (error) throw new Error("Unable to load dealer applications.");
  return { rows: (data ?? []).map((row) => mapApplication(row as Record<string, unknown>)), count: count ?? 0, q, status, location, businessType, productInterest };
}

export async function getDealerApplication(id: string) {
  await requireAdmin();
  const client = createAdminClient();
  const { data, error } = await client.from("dealer_applications").select("id,business_name,contact_person,phone,whatsapp,email,state,district,location,address,business_type,years_in_business,has_showroom,areas_served,product_interests,message,status,admin_notes,created_at,updated_at,dealer_id").eq("id", idSchema.parse(id)).maybeSingle();
  if (error || !data) throw new Error("Dealer application not found.");
  let dealer = null;
  if (data.dealer_id) {
    const result = await client.from("dealers").select("id,business_name,contact_person,phone,email,state,district,area,address,google_maps_url,latitude,longitude,payment_qr_image,shop_image,status,is_visible,slug").eq("id", data.dealer_id).maybeSingle();
    dealer = result.data;
  }
  const { data: audit } = await client.from("dealer_application_audit_events").select("action,from_status,to_status,metadata,created_at").eq("application_id", data.id).order("created_at", { ascending: false });
  return { application: data, dealer, audit: audit ?? [] };
}

export async function reviewDealerApplication(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const status = z.enum(applicationStatuses).parse(formData.get("status"));
  const client = createAdminClient();
  const { error } = await client.rpc("set_dealer_application_status", { p_application_id: id, p_status: status, p_actor_user_id: admin.userId });
  if (error) throw new Error("Unable to update application status.");
  revalidatePath("/admin/dealers");
  revalidatePath(`/admin/dealers/${id}`);
  revalidatePath("/dealers");
}

export async function createDealerFromApplication(formData: FormData) {
  const admin = await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const { error } = await createAdminClient().rpc("create_dealer_from_application", { p_application_id: id, p_actor_user_id: admin.userId });
  if (error) throw new Error("Unable to create a dealer from this application.");
  revalidatePath("/admin/dealers"); revalidatePath(`/admin/dealers/${id}`); revalidatePath("/dealers");
}

export async function updateDealer(formData: FormData) {
  const admin = await requireAdmin();
  const httpUrl = z.string().trim().refine((value) => value === "" || isSafeHttpUrl(value), "Use a valid HTTP or HTTPS URL.");
  const values = z.object({
    id: idSchema, business_name: z.string().trim().min(2).max(160), contact_person: z.string().trim().max(120).optional(),
    phone: z.string().trim().min(7).max(20), email: z.string().trim().email().or(z.literal("")), state: z.string().trim().min(2).max(120),
    district: z.string().trim().min(2).max(120), area: z.string().trim().max(160).optional(), address: z.string().trim().min(2).max(500), google_maps_url:httpUrl, payment_qr_image:httpUrl, latitude:z.coerce.number().min(-90).max(90).optional(),longitude:z.coerce.number().min(-180).max(180).optional(),
    status: z.enum(["pending", "active", "inactive"]), is_visible: z.boolean(),
  }).parse({ ...Object.fromEntries(formData), is_visible: formData.get("is_visible") === "on" });
  const { id, ...dealer } = values;
  const { error } = await createAdminClient().from("dealers").update({ ...dealer, email: dealer.email || null, contact_person: dealer.contact_person || null, area: dealer.area || null, google_maps_url:dealer.google_maps_url||null,payment_qr_image:dealer.payment_qr_image||null,latitude:Number.isFinite(dealer.latitude)?dealer.latitude:null,longitude:Number.isFinite(dealer.longitude)?dealer.longitude:null }).eq("id", id);
  if (error) throw new Error("Unable to update dealer.");
  const { data: application } = await createAdminClient().from("dealer_applications").select("id").eq("dealer_id", id).maybeSingle();
  if (application) await createAdminClient().from("dealer_application_audit_events").insert({ application_id: application.id, actor_user_id: admin.userId, action: "dealer_updated", metadata: { dealer_id: id } });
  revalidatePath("/admin/dealers"); revalidatePath("/dealers");
}

export type DealerActionState = { ok: boolean; message: string };

export async function updateDealerAction(_previous: DealerActionState, formData: FormData): Promise<DealerActionState> {
  try { await updateDealer(formData); return { ok: true, message: "Dealer updated successfully." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "Unable to update dealer." }; }
}

export async function uploadDealerImage(formData: FormData) {
  await requireAdmin();
  const dealerId = idSchema.parse(formData.get("id"));
  const kind = z.enum(["shop_image", "payment_qr_image"]).parse(formData.get("kind"));
  const file = formData.get("image");
  if (!(file instanceof File) || !(await isSafeImageUpload(file))) throw new Error("Use a valid JPG, PNG, WebP or AVIF image up to 10 MB.");
  const client = createAdminClient();
  const { data: current } = await client.from("dealers").select("shop_image,payment_qr_image").eq("id", dealerId).maybeSingle();
  if (!current) throw new Error("Dealer not found.");
  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const key = `dealers/${dealerId}/${kind}-${randomUUID()}.${extension}`;
  const storage = getStorageProvider();
  await storage.upload({ key, file, contentType: file.type });
  const url = await storage.getUrl(key);
  const { error } = await client.from("dealers").update({ [kind]: url }).eq("id", dealerId);
  if (error) { try { await storage.delete(key); } catch {} throw new Error("Image uploaded but could not be attached to the dealer."); }
  const old = current[kind];
  const oldKey = old ? getExpectedMediaObjectKey(old, "dealers", dealerId) : null;
  if (oldKey) { try { await storage.delete(oldKey); } catch {} }
  revalidatePath("/admin/dealers"); revalidatePath(`/admin/dealers/${dealerId}`); revalidatePath("/dealers");
}

export async function removeDealerImage(formData: FormData) {
  await requireAdmin();
  const dealerId = idSchema.parse(formData.get("id"));
  const kind = z.enum(["shop_image", "payment_qr_image"]).parse(formData.get("kind"));
  const client = createAdminClient();
  const { data } = await client.from("dealers").select("shop_image,payment_qr_image").eq("id", dealerId).maybeSingle();
  if (!data) throw new Error("Dealer not found.");
  const value = data[kind];
  const { error } = await client.from("dealers").update({ [kind]: null }).eq("id", dealerId);
  if (error) throw new Error("Unable to remove dealer image.");
  const key = value ? getExpectedMediaObjectKey(value, "dealers", dealerId) : null;
  if (key) { try { await getStorageProvider().delete(key); } catch {} }
  revalidatePath("/admin/dealers"); revalidatePath(`/admin/dealers/${dealerId}`); revalidatePath("/dealers");
}

export async function deleteDealerApplication(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const client = createAdminClient();
  const { data: application } = await client.from("dealer_applications").select("dealer_id").eq("id", id).maybeSingle();
  if (!application) throw new Error("Dealer application not found.");
  if (application.dealer_id) {
    const { error } = await client.from("dealers").update({ status: "inactive", is_visible: false }).eq("id", application.dealer_id);
    if (error) throw new Error("This approved dealer was archived instead of permanently deleted.");
  } else {
    const { error } = await client.from("dealer_applications").delete().eq("id", id);
    if (error) throw new Error("Unable to delete dealer application.");
  }
  revalidatePath("/admin/dealers"); revalidatePath(`/admin/dealers/${id}`); revalidatePath("/dealers");
}

export async function updateDealerApplicationNote(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const notes = z.string().trim().max(1000).parse(formData.get("admin_notes") ?? "");
  const { error } = await createAdminClient().from("dealer_applications").update({ admin_notes: notes || null }).eq("id", id);
  if (error) throw new Error("Unable to save internal note.");
  revalidatePath(`/admin/dealers/${id}`);
}

export async function updateDealerApplication(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const values = z.object({ business_name: z.string().trim().min(2).max(160), contact_person: z.string().trim().min(2).max(120), phone: z.string().trim().min(7).max(20), whatsapp: z.string().trim().max(20), email: z.string().trim().email().or(z.literal("")), state: z.string().trim().min(2).max(120), district: z.string().trim().min(2).max(120), location: z.string().trim().min(2).max(160), address: z.string().trim().max(500), business_type: z.string().trim().max(80), years_in_business: z.preprocess((value) => value === "" ? null : value, z.coerce.number().int().min(0).max(150).nullable()), has_showroom: z.enum(["yes", "no"]), areas_served: z.string().trim().max(500), product_interests: z.array(z.string().trim().max(120)).max(4), message: z.string().trim().max(2000) }).parse({ ...Object.fromEntries(formData), product_interests: formData.getAll("product_interests") });
  const { error } = await createAdminClient().from("dealer_applications").update({ ...values, whatsapp: values.whatsapp || null, email: values.email || null, address: values.address || null, business_type: values.business_type || null, has_showroom: values.has_showroom === "yes", areas_served: values.areas_served || null, product_interests: values.product_interests.length ? values.product_interests : null, message: values.message || null }).eq("id", id).is("dealer_id", null);
  if (error) throw new Error("Unable to update dealer application.");
  revalidatePath(`/admin/dealers/${id}`); revalidatePath("/admin/dealers");
}
