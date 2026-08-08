import { describe, expect, it } from "vitest";
import { hasActiveAdminProfile } from "./admin";
describe("admin access", () => { it("requires an active profile", () => { expect(hasActiveAdminProfile({ is_active: true })).toBe(true); expect(hasActiveAdminProfile({ is_active: false })).toBe(false); expect(hasActiveAdminProfile(null)).toBe(false); }); });
