"use server";

import { createClient } from "@/lib/supabase/server";
import { dealerApplicationSchema } from "../validation/dealer";

type DealerFormState = { ok: boolean; message: string };

function isSafeSubmission(formData: FormData) {
  return (
    formData.get("website") === "" &&
    Number(formData.get("started_at") ?? 0) < Date.now() - 800
  );
}

export async function submitDealerApplication(
  _: DealerFormState,
  formData: FormData,
): Promise<DealerFormState> {
  if (!isSafeSubmission(formData)) {
    return { ok: false, message: "Please wait a moment and try again." };
  }

  const result = dealerApplicationSchema.safeParse(
    {
      ...Object.fromEntries(formData),
      product_interests: formData.getAll("product_interests"),
    },
  );
  if (!result.success) {
    return {
      ok: false,
      message:
        result.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("dealer_applications")
    .insert(result.data);
  if (error?.code === "23505") {
    return { ok: true, message: "Application Received" };
  }
  return error
    ? {
        ok: false,
        message: "We could not send your application. Please try again.",
      }
    : {
        ok: true,
        message: "Application Received",
      };
}
