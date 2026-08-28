import { describe, expect, it } from "vitest";
import { verificationRequestSchema } from "./verification-request-schema";

const validRequest = {
  product_name: "Glass Pantry With Bidding",
  product_code: "OEM-IM4506L",
  dealer_name: "WoodBay Dealer",
  customer_name: "QA Customer",
  contact_number: "+91 90000 00000",
  address: "Kollam, Kerala",
  voucher_or_invoice_number: "WB-QA-20260827",
  purchase_date: "2026-08-27",
  additional_information: "Verification QA submission.",
  website: "",
};

describe("voucher verification request validation", () => {
  it("accepts a complete verification request", () => {
    expect(verificationRequestSchema.safeParse(validRequest).success).toBe(
      true,
    );
  });

  it("rejects malformed contact details", () => {
    expect(
      verificationRequestSchema.safeParse({
        ...validRequest,
        contact_number: "not-a-phone",
      }).success,
    ).toBe(false);
  });

  it("rejects the honeypot and malformed purchase dates", () => {
    expect(
      verificationRequestSchema.safeParse({ ...validRequest, website: "bot" })
        .success,
    ).toBe(false);
    expect(
      verificationRequestSchema.safeParse({
        ...validRequest,
        purchase_date: "27/08/2026",
      }).success,
    ).toBe(false);
  });
});
