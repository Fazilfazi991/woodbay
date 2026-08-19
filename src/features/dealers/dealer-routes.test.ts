import { describe, expect, it } from "vitest";
import { primaryNavigation } from "@/config/navigation";

describe("dealer workflow routing", () => {
  it("keeps Accessories Dealer registration separate from Furniture Outlet", () => {
    const dealers = primaryNavigation.find((item) => item.label === "Dealers");
    expect(dealers?.children).toContainEqual({
      label: "Become a Dealer",
      href: "/dealers/become-a-dealer",
    });
    expect(
      dealers?.children?.some((item) => item.href === "/furniture/outlets"),
    ).toBe(false);
  });
});
