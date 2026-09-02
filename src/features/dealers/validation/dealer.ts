import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/validation/common";

const optionalText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((value) => value || null);

export const dealerBusinessTypes = [
  "Furniture Store",
  "Interior Design Company",
  "Hardware Store",
  "Kitchen / Wardrobe Dealer",
  "Architect / Contractor",
  "Home Decor Store",
  "Distributor",
  "Other",
] as const;

export const dealerProductInterests = [
  "Smart Kitchen & Wardrobe Solutions",
  "Hardware Fittings & Aluminium Profiles",
  "Smart Furniture",
  "Home Decor",
] as const;

export const dealerApplicationSchema = z.object({
  business_name: z.string().trim().min(2, "Enter your business name.").max(160),
  contact_person: z.string().trim().min(2, "Enter a contact person.").max(120),
  phone: phoneSchema,
  whatsapp: z.union([phoneSchema, z.literal("")]).transform((value) => value || null),
  email: z
    .union([emailSchema, z.literal("")])
    .transform((value) => value || null),
  state: z.string().trim().min(2, "Select or enter your state.").max(120),
  district: z.string().trim().min(2, "Enter your district.").max(120),
  location: z.string().trim().min(2, "Enter your location or area.").max(160),
  address: optionalText,
  business_type: z.enum(dealerBusinessTypes),
  years_in_business: z.preprocess(
    (value) => value === "" ? null : value,
    z.coerce.number().int().min(0).max(150).nullable(),
  ),
  has_showroom: z.enum(["yes", "no"]).transform((value) => value === "yes"),
  areas_served: z.string().trim().min(2, "Enter at least one area you serve.").max(500),
  product_interests: z.preprocess(
    (value) => Array.isArray(value) ? value : [value],
    z.array(z.enum(dealerProductInterests)).min(1, "Select at least one product division."),
  ),
  message: optionalText,
  consent: z.literal("on", { error: "Confirm that WoodBay may contact you." }).transform(() => true),
  submission_token: z.string().uuid(),
});

export type DealerApplication = z.infer<typeof dealerApplicationSchema>;
