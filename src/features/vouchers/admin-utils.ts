export type VoucherEffectiveStatus = "available" | "redeemed" | "disabled" | "expired";

export function effectiveVoucherStatus(status: "available" | "redeemed" | "disabled", expiresAt: string | null, today = new Date().toISOString().slice(0, 10)): VoucherEffectiveStatus {
  return status === "available" && expiresAt !== null && expiresAt < today ? "expired" : status;
}

export function escapeCsvValue(value: unknown) {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text.replaceAll('"', '""');
}
