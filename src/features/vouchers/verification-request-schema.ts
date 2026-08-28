import { z } from "zod";
import { phoneSchema } from "@/lib/validation/common";

export const verificationRequestSchema = z.object({
  product_name: z.string().trim().min(2).max(160),
  product_code: z.string().trim().max(100).optional(),
  dealer_name: z.string().trim().min(2).max(160),
  customer_name: z.string().trim().min(2).max(160),
  contact_number: phoneSchema,
  address: z.string().trim().min(5).max(500),
  voucher_or_invoice_number: z.string().trim().min(3).max(120),
  purchase_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid purchase date.")
    .or(z.literal(""))
    .optional(),
  additional_information: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
});
