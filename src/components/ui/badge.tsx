import type { HTMLAttributes } from "react";
export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) { return <span className={`inline-flex rounded-full bg-[color:var(--primary)]/10 px-2 py-1 text-xs font-medium text-[color:var(--primary)] ${className}`} {...props} />; }
