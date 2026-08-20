import type { TextareaHTMLAttributes } from "react";
export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`min-h-24 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-base focus:outline-2 focus:outline-[color:var(--primary)] sm:text-sm ${className}`} {...props} />; }
