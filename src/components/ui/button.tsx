import type { ButtonHTMLAttributes } from "react";
export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`rounded-md bg-[color:var(--primary)] px-4 py-2 font-medium text-white focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--gold)] disabled:opacity-50 ${className}`} {...props} />; }
