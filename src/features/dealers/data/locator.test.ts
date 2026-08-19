import { describe, expect, it } from "vitest";
import {
  dealerDirectionsUrl,
  dealerPhoneUrl,
  dealerResultText,
  emptyDealerFilters,
  filterDealers,
  getDealerFilterOptions,
  type PublicDealer,
} from "./locator";

const dealers: PublicDealer[] = [
  {
    id: "1",
    business_name: "Woodbay QA Kochi",
    slug: "qa-kochi",
    phone: "+91 90000 1",
    state: "Kerala",
    district: "Ernakulam",
    area: "Kakkanad",
    address: "QA",
    google_maps_url: null,
    latitude: null,
    longitude: null,
    shop_image: null,
  },
  {
    id: "2",
    business_name: "Woodbay QA Chennai",
    slug: "qa-chennai",
    phone: "+91 90000 2",
    state: "Tamil Nadu",
    district: "Chennai",
    area: "Velachery",
    address: "QA",
    google_maps_url: null,
    latitude: 12.9,
    longitude: 80.2,
    shop_image: null,
  },
];
describe("dealer locator", () => {
  it("filters state, district, area and search", () => {
    expect(
      filterDealers(dealers, {
        state: "Kerala",
        district: "Ernakulam",
        area: "Kakkanad",
        q: "kochi",
      }),
    ).toHaveLength(1);
  });
  it("derives dependent options", () => {
    expect(
      getDealerFilterOptions(dealers, { state: "Kerala", district: "" }),
    ).toMatchObject({
      states: ["Kerala", "Tamil Nadu"],
      districts: ["Ernakulam"],
      areas: ["Kakkanad"],
    });
  });
  it("builds safe contact and directions links", () => {
    expect(dealerPhoneUrl("+91 90000 1")).toBe("tel:+91900001");
    expect(dealerDirectionsUrl(dealers[1])).toContain("12.9%2C80.2");
  });
  it("uses accurate count text", () => {
    expect(dealerResultText(1, emptyDealerFilters)).toBe("1 Dealer Found");
  });
});
