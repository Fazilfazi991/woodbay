import { describe, expect, it } from "vitest";
import {
  dealerLocalBusinessSchema,
  dealerLocation,
  dealerMapEmbedUrl,
  detailActions,
  isQaDealer,
  type PublicDealerDetail,
} from "./detail";

const dealer: PublicDealerDetail = {
  id: "1",
  business_name: "Green Wood Interiors",
  slug: "green-wood-interiors",
  phone: "+91 90000 00001",
  state: "Kerala",
  district: "Ernakulam",
  area: "Kakkanad",
  address: "Example address",
  google_maps_url: null,
  latitude: 10.02,
  longitude: 76.31,
  payment_qr_image: null,
  shop_image: null,
};
describe("dealer detail helpers", () => {
  it("builds public map, call and location values only when data exists", () => {
    expect(dealerLocation(dealer)).toBe("Kakkanad, Ernakulam, Kerala");
    expect(dealerMapEmbedUrl(dealer)).toContain("output=embed");
    expect(detailActions(dealer).call).toBe("tel:+919000000001");
  });
  it("suppresses QA local-business SEO", () => {
    expect(
      isQaDealer({
        business_name: "Woodbay Dealer QA – Kochi",
        slug: "woodbay-dealer-qa-kochi",
      }),
    ).toBe(true);
    expect(
      dealerLocalBusinessSchema(
        {
          ...dealer,
          business_name: "Woodbay Dealer QA – Kochi",
          slug: "woodbay-dealer-qa-kochi",
        },
        "https://example.test/dealers/qa",
      ),
    ).toBeNull();
  });
  it("creates LocalBusiness data only from real configured fields", () => {
    expect(
      dealerLocalBusinessSchema(
        dealer,
        "https://example.test/dealers/green-wood-interiors",
      ),
    ).toMatchObject({
      "@type": "LocalBusiness",
      name: "Green Wood Interiors",
      geo: { latitude: 10.02, longitude: 76.31 },
    });
  });
});
