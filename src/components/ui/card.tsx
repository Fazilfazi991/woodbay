import type { HTMLAttributes } from "react";
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 ${className}`} {...props} />; }
