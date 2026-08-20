import { describe, expect, it } from "vitest";
import { projectSlug, projectStatusLabel } from "./admin-utils";

describe("project admin helpers", () => {
  it("normalizes project slugs safely", () => {
    expect(projectSlug("  Luxury Villa / Dubai  ")).toBe("luxury-villa-dubai");
  });

  it("uses readable labels without changing canonical status values", () => {
    expect(projectStatusLabel("draft")).toBe("Hidden / Draft");
    expect(projectStatusLabel("published")).toBe("Published");
    expect(projectStatusLabel("archived")).toBe("Archived");
  });

  it("keeps unknown legacy statuses displayable", () => {
    expect(projectStatusLabel("legacy_state")).toBe("legacy_state");
  });
});
