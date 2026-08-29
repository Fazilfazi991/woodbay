import type { ButtonHTMLAttributes } from "react";
export type ButtonVariant = "primary" | "gold" | "secondary" | "light" | "text";
const styles: Record<ButtonVariant, string> = {
  primary:
    "border border-[color:var(--background-dark)] bg-[color:var(--background-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-[color:var(--background-dark)]",
  gold: "border border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--background-dark)] hover:border-[color:var(--gold-hover)] hover:bg-[color:var(--gold-hover)]",
  secondary:
    "border border-[color:var(--gold)] bg-transparent text-[color:var(--foreground-light)] hover:bg-[color:var(--gold)] hover:text-[color:var(--background-dark)]",
  light:
    "border border-[color:var(--foreground-dark)] bg-transparent text-[color:var(--foreground-dark)] hover:bg-[color:var(--foreground-dark)] hover:text-[color:var(--foreground-light)]",
  text: "px-0 text-[color:var(--gold)] hover:text-[color:var(--gold-hover)]",
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`woodbay-button woodbay-button--${variant} group inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-[11px] leading-none font-medium tracking-[.14em] uppercase transition-[background-color,border-color,color] duration-250 ease-out focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--gold)] disabled:pointer-events-none disabled:opacity-45 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
