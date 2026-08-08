import type { TextareaHTMLAttributes } from "react";
export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 focus:outline-2 focus:outline-[color:var(--primary)] ${className}`} {...props} />; }
