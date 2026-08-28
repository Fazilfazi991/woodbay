"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveAdmin } from "@/lib/auth/admin";
import { verificationRequestSchema } from "./verification-request-schema";

export type VerificationRequestState = { ok?: boolean; error?: string };

export async function submitVerificationRequest(
  _: VerificationRequestState,
  form: FormData,
): Promise<VerificationRequestState> {
  const parsed = verificationRequestSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  const value = { ...parsed.data };
  delete value.website;
  const { error } = await createAdminClient()
    .from("voucher_verification_requests")
    .insert({
      ...value,
      product_code: value.product_code || null,
      purchase_date: value.purchase_date || null,
      additional_information: value.additional_information || null,
    });
  return error
    ? { error: "We could not submit your request. Please try again." }
    : { ok: true };
}

export async function listVerificationRequests() {
  if (!(await getActiveAdmin())) throw new Error("Unauthorized");
  const { data, error } = await createAdminClient()
    .from("voucher_verification_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error("Unable to load verification requests.");
  return data ?? [];
}

export async function reviewVerificationRequest(form: FormData) {
  const actor = await getActiveAdmin();
  if (!actor) throw new Error("Unauthorized");
  const id = z.string().uuid().parse(form.get("id"));
  const status = z.enum(["verified", "rejected"]).parse(form.get("status"));
  const admin_notes = z
    .string()
    .trim()
    .max(2000)
    .parse(form.get("admin_notes") ?? "");
  const { error } = await createAdminClient()
    .from("voucher_verification_requests")
    .update({
      status,
      admin_notes: admin_notes || null,
      reviewed_by: actor.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending");
  if (error) throw new Error("Unable to review request.");
  revalidatePath("/admin/voucher-verifications");
}
