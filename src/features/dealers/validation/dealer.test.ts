import { describe, expect, it } from "vitest";
import { dealerApplicationSchema } from "./dealer";

const valid = {
  business_name: "QA Hardware",
  contact_person: "Amina Rahman",
  phone: "+919000000001",
  whatsapp: "",
  email: "",
  state: "Kerala",
  district: "Ernakulam",
  location: "Kochi",
  address: "",
  business_type: "Hardware Store",
  years_in_business: "8",
  has_showroom: "yes",
  areas_served: "Kochi, Ernakulam",
  product_interests: ["Hardware Fittings & Aluminium Profiles"],
  message: "",
  consent: "on",
  submission_token: "5bc2e4d8-0b25-4edf-9f89-739cd6d74f5d",
};

describe("dealer application validation", () => {
  it("accepts a complete application and normalises empty optional fields", () => {
    expect(dealerApplicationSchema.parse(valid)).toMatchObject({
      email: null,
      whatsapp: null,
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
  it("requires consent and at least one approved product division", () => {
    expect(dealerApplicationSchema.safeParse({ ...valid, consent: "", product_interests: [] }).success).toBe(false);
    expect(dealerApplicationSchema.safeParse({ ...valid, product_interests: ["Unknown division"] }).success).toBe(false);
  });
});
