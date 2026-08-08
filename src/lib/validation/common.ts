import { z } from "zod";
export const emailSchema = z.email("Enter a valid email address.");
export const phoneSchema = z.string().trim().regex(/^[+0-9()\-\s]{7,20}$/, "Enter a valid phone number.");
export const slugSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens.");
export const uuidSchema = z.uuid();
export const paginationSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20) });
