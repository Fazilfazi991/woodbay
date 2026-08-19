import { describe, expect, it } from "vitest";
import { dealerApplicationSchema } from "./dealer";

const valid = {
  business_name: "QA Hardware",
  contact_person: "Amina Rahman",
  phone: "+919000000001",
  email: "",
  state: "Kerala",
  district: "Ernakulam",
  location: "Kochi",
  address: "",
  message: "",
};

describe("dealer application validation", () => {
  it("accepts a complete application and normalises empty optional fields", () => {
    expect(dealerApplicationSchema.parse(valid)).toMatchObject({
      email: null,
      address: null,
      message: null,
    });
  });
  it("requires business, contact and location fields", () => {
    expect(
      dealerApplicationSchema.safeParse({
        ...valid,
        business_name: "",
        district: "",
      }).success,
    ).toBe(false);
  });
  it("validates optional email when supplied", () => {
    expect(
      dealerApplicationSchema.safeParse({ ...valid, email: "not-an-email" })
        .success,
    ).toBe(false);
  });
});
