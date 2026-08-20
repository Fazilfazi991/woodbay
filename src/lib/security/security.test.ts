import { describe, expect, it } from "vitest";
import { getExpectedMediaObjectKey } from "./media";
import { isSafeImageUpload } from "./upload";
import { isSafeHttpsUrl } from "./url";

describe("security helpers", () => {
  it("rejects unsafe external URL protocols", () => {
    expect(isSafeHttpsUrl("https://maps.google.com/?q=woodbay")).toBe(true);
    expect(isSafeHttpsUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpsUrl("data:text/html,unsafe")).toBe(false);
  });

  it("only resolves media keys within the owning namespace", () => {
    expect(getExpectedMediaObjectKey("products/111/image.jpg", "products", "111")).toBe("products/111/image.jpg");
    expect(getExpectedMediaObjectKey("projects/222/image.jpg", "projects", "222")).toBe("projects/222/image.jpg");
    expect(getExpectedMediaObjectKey("projects/111/image.jpg", "products", "111")).toBeNull();
    expect(getExpectedMediaObjectKey("products/111/../../private.txt", "products", "111")).toBeNull();
  });

  it("requires an image signature in addition to MIME type", async () => {
    const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "image.png", { type: "image/png" });
    const spoofed = new File(["not an image"], "image.png", { type: "image/png" });
    expect(await isSafeImageUpload(png)).toBe(true);
    expect(await isSafeImageUpload(spoofed)).toBe(false);
  });
});
