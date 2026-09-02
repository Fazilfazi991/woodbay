import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/validation/common";

export const contactEnquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  phone: phoneSchema,
  email: z
    .union([emailSchema, z.literal("")])
    .optional()
    .transform((value) => value || null),
  subject: z.string().trim().min(2).max(160),
  message: z
    .string()
    .trim()
    .min(10, "Tell us what you would like to enquire about.")
    .max(5000),
});
