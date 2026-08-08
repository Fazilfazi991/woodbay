import type { SelectHTMLAttributes } from "react";
export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 focus:outline-2 focus:outline-[color:var(--primary)] ${className}`} {...props} />; }
