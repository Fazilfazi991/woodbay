import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/validation/common";

const optionalText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((value) => value || null);

export const dealerApplicationSchema = z.object({
  business_name: z.string().trim().min(2, "Enter your business name.").max(160),
  contact_person: z.string().trim().min(2, "Enter a contact person.").max(120),
  phone: phoneSchema,
  email: z
    .union([emailSchema, z.literal("")])
    .transform((value) => value || null),
  state: z.string().trim().min(2, "Select or enter your state.").max(120),
  district: z.string().trim().min(2, "Enter your district.").max(120),
  location: z.string().trim().min(2, "Enter your location or area.").max(160),
  address: optionalText,
  message: optionalText,
});

export type DealerApplication = z.infer<typeof dealerApplicationSchema>;
