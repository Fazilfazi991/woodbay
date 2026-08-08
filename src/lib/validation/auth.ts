import { z } from "zod";
import { emailSchema } from "./common";
export const adminLoginSchema = z.object({ email: emailSchema, password: z.string().min(8, "Password must be at least 8 characters.") });
