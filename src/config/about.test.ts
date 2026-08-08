import { describe, expect, it } from "vitest";
import { about } from "./about";
describe("about configuration", () => { it("contains all four supported value pillars", () => expect(about.values.map((value) => value.title)).toEqual(["Premium Quality", "Innovative Design", "Trusted Performance", "Affordable Solutions"])); it("uses internal division routes", () => expect(about.divisions.every((division) => division.href.startsWith("/products/"))).toBe(true)); it("does not configure a fabricated founder portrait", () => expect(about.assets.founderPortrait).toBeNull()); });
