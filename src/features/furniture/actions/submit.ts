"use server";
import { createClient } from "@/lib/supabase/server";
import {
  factoryVisitSchema,
  furnitureEnquirySchema,
  furnitureOutletSchema,
} from "../validation/furniture";
export type FurnitureFormState = { ok: boolean; message: string };
const initial: FurnitureFormState = { ok: false, message: "" };
export { initial as furnitureFormInitialState };
function safe(values: FormData) {
  return (
    values.get("website") === "" &&
    Number(values.get("started_at") ?? 0) < Date.now() - 800
  );
}
async function submit(
  formData: FormData,
  table:
    | "furniture_enquiries"
    | "factory_visit_requests"
    | "furniture_outlet_enquiries",
  schema:
    | typeof furnitureEnquirySchema
    | typeof factoryVisitSchema
    | typeof furnitureOutletSchema,
  success: string,
): Promise<FurnitureFormState> {
  if (!safe(formData))
    return { ok: false, message: "Please wait a moment and try again." };
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return {
      ok: false,
      message:
        result.error.issues[0]?.message ?? "Check the form and try again.",
    };
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert(result.data as never);
  return error
    ? {
        ok: false,
        message: "We could not send your request. Please try again.",
      }
    : { ok: true, message: success };
}
export async function submitFurnitureEnquiry(
  _: FurnitureFormState,
  formData: FormData,
) {
  return submit(
    formData,
    "furniture_enquiries",
    furnitureEnquirySchema,
    "Thank you. Your furniture requirement has been received.",
  );
}
export async function submitFactoryVisit(
  _: FurnitureFormState,
  formData: FormData,
) {
  return submit(
    formData,
    "factory_visit_requests",
    factoryVisitSchema,
    "Factory visit request received. Our team will contact you.",
  );
}
export async function submitFurnitureOutlet(
  _: FurnitureFormState,
  formData: FormData,
) {
  return submit(
    formData,
    "furniture_outlet_enquiries",
    furnitureOutletSchema,
    "Furniture outlet enquiry received.",
  );
}
