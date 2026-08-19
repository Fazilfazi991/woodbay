import { describe, expect, it } from "vitest";
import {
  factoryVisitSchema,
  furnitureEnquirySchema,
  furnitureOutletSchema,
} from "./furniture";

describe("furniture enquiry validation", () => {
  it("accepts a complete custom furniture requirement", () => {
    const result = furnitureEnquirySchema.safeParse({
      name: "Amina Rahman",
      phone: "+971501234567",
      email: "amina@example.com",
      location: "Dubai",
      furniture_type: "Wardrobe",
      width: "2400",
      height: "2800",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a factory visit scheduled in the past and normalises an empty date", () => {
    expect(
      factoryVisitSchema.safeParse({
        name: "Amina Rahman",
        phone: "+971501234567",
        email: "",
        location: "Dubai",
        preferred_date: "2000-01-01",
        furniture_interest: "Kitchen",
      }).success,
    ).toBe(false);

    const result = factoryVisitSchema.parse({
      name: "Amina Rahman",
      phone: "+971501234567",
      email: "",
      location: "Dubai",
      preferred_date: "",
      furniture_interest: "Kitchen",
    });
    expect(result.preferred_date).toBeNull();
  });

  it("requires a location and a supported furniture interest for factory visits", () => {
    expect(
      factoryVisitSchema.safeParse({
        name: "Amina Rahman",
        phone: "+971501234567",
        email: "",
        location: "",
        preferred_date: "",
        furniture_interest: "Kitchen",
      }).success,
    ).toBe(false);
    expect(
      factoryVisitSchema.safeParse({
        name: "Amina Rahman",
        phone: "+971501234567",
        email: "",
        location: "Dubai",
        preferred_date: "",
        furniture_interest: "Unlisted interest",
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid furniture outlet size", () => {
    expect(
      furnitureOutletSchema.safeParse({
        person_name: "Amina Rahman",
        showroom_name: "",
        phone: "+971501234567",
        email: "",
        location: "Dubai",
        showroom_size_sqft: "0",
      }).success,
    ).toBe(false);
  });
});
