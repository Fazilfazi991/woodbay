import { describe, expect, it } from "vitest";
import { effectiveVoucherStatus, escapeCsvValue } from "./admin-utils";

describe("voucher administration helpers", () => {
  it("derives expired status without changing the stored lifecycle", () => {
    expect(effectiveVoucherStatus("available", "2026-08-19", "2026-08-20")).toBe("expired");
    expect(effectiveVoucherStatus("available", "2026-08-20", "2026-08-20")).toBe("available");
    expect(effectiveVoucherStatus("redeemed", "2026-08-19", "2026-08-20")).toBe("redeemed");
  });

  it("escapes formula cells and quotes for CSV", () => {
    expect(escapeCsvValue("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
    expect(escapeCsvValue("+123")).toBe("'+123");
    expect(escapeCsvValue('Woodbay "Voucher"')).toBe('Woodbay ""Voucher""');
  });
});
