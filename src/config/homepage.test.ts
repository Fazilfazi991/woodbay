import { describe, expect, it } from "vitest";
import { homepage } from "./homepage";
describe("homepage configuration", () => { it("uses internal destinations for homepage categories", () => expect(homepage.categories.every((category) => category.href.startsWith("/products"))).toBe(true)); it("does not publish unverified numeric capability claims", () => expect(homepage.capabilityLabels.every((label) => !/\d/.test(label))).toBe(true)); });
