"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveAdmin } from "@/lib/auth/admin";
import { isSafeHttpsUrl } from "@/lib/security/url";
import { createAdminClient } from "@/lib/supabase/admin";

const statusSchema = z.enum(["all", "new", "approved", "rejected"]);
const idSchema = z.string().uuid();

export type DealerApplicationRow = {
  id: string; businessName: string; contactPerson: string; phone: string;
  location: string; state: string; district: string; status: "new" | "contacted" | "approved" | "rejected";
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
    status: row.status as DealerApplicationRow["status"], createdAt: String(row.created_at), dealerId: row.dealer_id ? String(row.dealer_id) : null,
  };
}

export async function listDealerApplications(input: Record<string, string | undefined>) {
  await requireAdmin();
  const q = (input.q ?? "").trim().slice(0, 120);
  const status = statusSchema.catch("all").parse(input.status ?? "all");
  const db = createAdminClient();
  let query = db.from("dealer_applications").select("id,business_name,contact_person,phone,location,state,district,status,created_at,dealer_id", { count: "exact" }).order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (q) query = query.or(`business_name.ilike.%${q}%,contact_person.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data, error, count } = await query;
  if (error) throw new Error("Unable to load dealer applications.");
  return { rows: (data ?? []).map((row) => mapApplication(row as Record<string, unknown>)), count: count ?? 0, q, status };
}

export async function getDealerApplication(id: string) {
  await requireAdmin();
  const { data, error } = await createAdminClient().from("dealer_applications").select("id,business_name,contact_person,phone,email,state,district,location,address,message,status,admin_notes,created_at,dealer_id").eq("id", idSchema.parse(id)).maybeSingle();
  if (error || !data) throw new Error("Dealer application not found.");
  let dealer = null;
  if (data.dealer_id) {
    const result = await createAdminClient().from("dealers").select("id,business_name,contact_person,phone,email,state,district,area,address,google_maps_url,latitude,longitude,payment_qr_image,status,is_visible,slug").eq("id", data.dealer_id).maybeSingle();
    dealer = result.data;
  }
  return { application: data, dealer };
}

export async function reviewDealerApplication(formData: FormData) {
  await requireAdmin();
  const id = idSchema.parse(formData.get("id"));
  const decision = z.enum(["approved", "rejected"]).parse(formData.get("decision"));
  const notes = z.string().trim().max(1000).optional().parse(formData.get("notes") || undefined) ?? null;
  const { error } = await createAdminClient().rpc("review_dealer_application", { p_application_id: id, p_decision: decision, p_admin_notes: notes });
  if (error) throw new Error("Unable to review this application.");
  revalidatePath("/admin/dealers");
  revalidatePath(`/admin/dealers/${id}`);
  revalidatePath("/dealers");
}

export async function updateDealer(formData: FormData) {
  await requireAdmin();
  const httpsUrl = z.string().trim().refine((value) => value === "" || isSafeHttpsUrl(value), "Use a valid HTTPS URL.");
  const values = z.object({
    id: idSchema, business_name: z.string().trim().min(2).max(160), contact_person: z.string().trim().max(120).optional(),
    phone: z.string().trim().min(7).max(20), email: z.string().trim().email().or(z.literal("")), state: z.string().trim().min(2).max(120),
    district: z.string().trim().min(2).max(120), area: z.string().trim().max(160).optional(), address: z.string().trim().min(2).max(500), google_maps_url:httpsUrl, payment_qr_image:httpsUrl, latitude:z.coerce.number().min(-90).max(90).optional(),longitude:z.coerce.number().min(-180).max(180).optional(),
    status: z.enum(["pending", "active", "inactive"]), is_visible: z.boolean(),
  }).parse({ ...Object.fromEntries(formData), is_visible: formData.get("is_visible") === "on" });
  const { id, ...dealer } = values;
  const { error } = await createAdminClient().from("dealers").update({ ...dealer, email: dealer.email || null, contact_person: dealer.contact_person || null, area: dealer.area || null, google_maps_url:dealer.google_maps_url||null,payment_qr_image:dealer.payment_qr_image||null,latitude:Number.isFinite(dealer.latitude)?dealer.latitude:null,longitude:Number.isFinite(dealer.longitude)?dealer.longitude:null }).eq("id", id);
  if (error) throw new Error("Unable to update dealer.");
  revalidatePath("/admin/dealers"); revalidatePath("/dealers");
}
