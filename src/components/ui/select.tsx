import type { SelectHTMLAttributes } from "react";
export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`min-h-12 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-base focus:outline-2 focus:outline-[color:var(--primary)] sm:text-sm ${className}`} {...props} />; }
