import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/validation/common";
const optionalText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .transform((value) => value || null);
const dimension = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().positive().max(100000).optional(),
);
export const furnitureTypes = [
  "Kitchen",
  "Wardrobe",
  "Bedroom",
  "TV Unit",
  "Living Room",
  "Study Furniture",
  "Other",
] as const;
export const factoryVisitInterests = [
  "Kitchen",
  "Wardrobe",
  "Bedroom",
  "TV Unit",
  "Living Room",
  "Study",
  "General Factory Visit",
] as const;
export const furnitureEnquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  email: z
    .union([emailSchema, z.literal("")])
    .transform((value) => value || null),
  location: z.string().trim().min(2).max(160),
  district: optionalText,
  furniture_type: z.enum(furnitureTypes),
  requirement_type: optionalText,
  front_colour_name: optionalText,
  body_colour_name: optionalText,
  finish_preference: optionalText,
  width: dimension,
  height: dimension,
  depth: dimension,
  dimensions_note: optionalText,
  message: optionalText,
});
export const factoryVisitSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: phoneSchema,
  email: z
    .union([emailSchema, z.literal("")])
    .transform((value) => value || null),
  location: z.string().trim().min(2).max(160),
  preferred_date: z
    .string()
    .trim()
    .refine(
      (value) =>
        !value ||
        new Date(`${value}T00:00:00`) >= new Date(new Date().toDateString()),
      "Choose today or a future date.",
    )
    .transform((value) => value || null),
  furniture_interest: z.enum(factoryVisitInterests),
  message: optionalText,
});
export const furnitureOutletSchema = z.object({
  person_name: z.string().trim().min(2).max(120),
  showroom_name: optionalText,
  phone: phoneSchema,
  email: z
    .union([emailSchema, z.literal("")])
    .transform((value) => value || null),
  location: z.string().trim().min(2).max(160),
  district: optionalText,
  showroom_size_sqft: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number().int().positive().max(1000000).optional(),
  ),
  message: optionalText,
});
