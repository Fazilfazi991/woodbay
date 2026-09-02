import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("dealer application admin workflow", () => {
  const source = readFileSync(new URL("./components/dealer-review-actions.tsx", import.meta.url), "utf8");
  const adminSource = readFileSync(new URL("./admin.ts", import.meta.url), "utf8");

  it("remounts the status selector from persisted state and keeps conversion deliberate", () => {
    expect(source).toContain("key={status}");
    expect(source).toContain("Create Dealer from Application");
    expect(source).toContain('status === "approved" && !dealerId');
  });

  it("keeps payment QR management in the dedicated upload workflow", () => {
    expect(adminSource).not.toContain("payment_qr_image:httpUrl");
    expect(adminSource).toContain('kind = z.enum(["shop_image", "payment_qr_image"])');
  });
});
