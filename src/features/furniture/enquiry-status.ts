export const ENQUIRY_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "consultation_scheduled", label: "Consultation Scheduled" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "closed", label: "Closed" },
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUS_OPTIONS)[number]["value"];

export function enquiryStatusLabel(value: string) {
  return ENQUIRY_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value.replaceAll("_", " ");
}
