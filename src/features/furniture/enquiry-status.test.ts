import { describe, expect, it } from "vitest";
import { ENQUIRY_STATUS_OPTIONS, enquiryStatusLabel } from "./enquiry-status";

describe("furniture enquiry statuses", () => {
  it("keeps canonical values separate from UI labels", () => {
    expect(ENQUIRY_STATUS_OPTIONS).toContainEqual({
      value: "consultation_scheduled",
      label: "Consultation Scheduled",
    });
  });

  it("formats canonical and legacy status values safely", () => {
    expect(enquiryStatusLabel("consultation_scheduled")).toBe("Consultation Scheduled");
    expect(enquiryStatusLabel("legacy_follow_up")).toBe("legacy follow up");
  });
});
