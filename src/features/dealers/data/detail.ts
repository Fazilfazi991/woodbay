import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { dealerDirectionsUrl, dealerPhoneUrl } from "./locator";

export type PublicDealerDetail = {
  id: string;
  business_name: string;
  slug: string;
  phone: string;
  state: string;
  district: string;
  area: string | null;
  address: string;
  google_maps_url: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  payment_qr_image: string | null;
  shop_image: string | null;
};

export function isQaDealer(
  dealer: Pick<PublicDealerDetail, "business_name" | "slug">,
) {
  return (
    dealer.slug.startsWith("woodbay-dealer-qa-") ||
    /\bqa\b/i.test(dealer.business_name)
  );
}

export function dealerLocation(dealer: PublicDealerDetail) {
  return [dealer.area, dealer.district, dealer.state]
    .filter(Boolean)
    .join(", ");
}

export function dealerMapEmbedUrl(dealer: PublicDealerDetail) {
  if (dealer.latitude === null || dealer.longitude === null) return null;
  const latitude = Number(dealer.latitude),
    longitude = Number(dealer.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}&z=15&output=embed`
    : null;
}

export function detailActions(dealer: PublicDealerDetail) {
  return {
    call: dealer.phone ? dealerPhoneUrl(dealer.phone) : null,
    directions: dealerDirectionsUrl(dealer),
  };
}

export function dealerLocalBusinessSchema(
  dealer: PublicDealerDetail,
  canonicalUrl: string,
) {
  if (isQaDealer(dealer)) return null;
  const location = dealerLocation(dealer);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: dealer.business_name,
    url: canonicalUrl,
    telephone: dealer.phone || undefined,
    address: dealer.address
      ? {
          "@type": "PostalAddress",
          streetAddress: dealer.address,
          addressLocality: dealer.area || undefined,
          addressRegion: dealer.state,
        }
      : undefined,
  };
  if (dealer.shop_image) schema.image = dealer.shop_image;
  if (
    dealer.latitude !== null &&
    dealer.longitude !== null &&
    Number.isFinite(Number(dealer.latitude)) &&
    Number.isFinite(Number(dealer.longitude))
  )
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: Number(dealer.latitude),
      longitude: Number(dealer.longitude),
    };
  if (!location) delete schema.address;
  return schema;
}

export const getPublicDealerBySlug = cache(async (
  slug: string,
): Promise<PublicDealerDetail | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_dealer_details")
    .select(
      "id,business_name,slug,phone,state,district,area,address,google_maps_url,latitude,longitude,payment_qr_image,shop_image",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as PublicDealerDetail | null;
});
