import { ZodError } from "zod";
export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; message: string; fieldErrors?: Record<string, string[]> };
export function normalizeError(error: unknown): ActionResult<never> { if (error instanceof ZodError) return { ok: false, message: "Please correct the highlighted fields.", fieldErrors: error.flatten().fieldErrors }; console.error("Server operation failed", error); return { ok: false, message: "Something went wrong. Please try again." }; }
