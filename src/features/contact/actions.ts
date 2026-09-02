"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactEnquirySchema } from "./validation";

export type ContactEnquiryState = { ok: boolean; message: string };

export async function submitContactEnquiry(
  _: ContactEnquiryState,
  formData: FormData,
): Promise<ContactEnquiryState> {
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (
    formData.get("website") !== "" ||
    !startedAt ||
    startedAt > Date.now() - 800
  ) {
    return { ok: false, message: "Please wait a moment and try again." };
  }
  const result = contactEnquirySchema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return {
      ok: false,
      message:
        result.error.issues[0]?.message ?? "Check the form and try again.",
    };
  const { error } = await createAdminClient()
    .from("contact_enquiries")
    .insert(result.data);
  return error
    ? {
        ok: false,
        message:
          "We could not send your enquiry. Please try WhatsApp or try again shortly.",
      }
    : {
        ok: true,
        message: "Thank you. Your enquiry has been received by WoodBay.",
      };
}
