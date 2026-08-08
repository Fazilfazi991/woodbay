import type { InputHTMLAttributes } from "react";
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 focus:outline-2 focus:outline-[color:var(--primary)] ${className}`} {...props} />; }
