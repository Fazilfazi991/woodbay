import { describe, expect, it } from "vitest";
import { slugSchema, paginationSchema, phoneSchema } from "./common";
describe("common validation", () => { it("accepts canonical slugs", () => expect(slugSchema.parse("kitchen-accessories")).toBe("kitchen-accessories")); it("rejects invalid slugs", () => expect(() => slugSchema.parse("Kitchen Accessories")).toThrow()); it("applies safe pagination defaults", () => expect(paginationSchema.parse({})).toEqual({ page: 1, pageSize: 20 })); it("rejects short phone numbers", () => expect(() => phoneSchema.parse("123")).toThrow()); });
