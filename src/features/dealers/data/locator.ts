import { createClient } from "@/lib/supabase/server";

export type PublicDealer = {
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
  shop_image: string | null;
};

export type DealerFilters = {
  state: string;
  district: string;
  area: string;
  q: string;
};
export const emptyDealerFilters: DealerFilters = {
  state: "",
  district: "",
  area: "",
  q: "",
};

function normalise(value: string) {
  return value.trim().toLocaleLowerCase();
}
function unique(values: (string | null)[]) {
  return [
    ...new Set(
      values
        .filter((value): value is string => Boolean(value))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export function parseDealerFilters(
  input: Record<string, string | string[] | undefined>,
): DealerFilters {
  const one = (key: keyof DealerFilters) =>
    typeof input[key] === "string" ? input[key].trim().slice(0, 120) : "";
  return {
    state: one("state"),
    district: one("district"),
    area: one("area"),
    q: one("q"),
  };
}

export function filterDealers(dealers: PublicDealer[], filters: DealerFilters) {
  const state = normalise(filters.state),
    district = normalise(filters.district),
    area = normalise(filters.area),
    q = normalise(filters.q);
  return dealers
    .filter((dealer) => {
      const searchable = [
        dealer.business_name,
        dealer.area,
        dealer.district,
        dealer.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return (
        (!state || normalise(dealer.state) === state) &&
        (!district || normalise(dealer.district) === district) &&
        (!area || normalise(dealer.area ?? "") === area) &&
        (!q || searchable.includes(q))
      );
    })
    .sort((a, b) =>
      [a.state, a.district, a.area ?? "", a.business_name]
        .join("|")
        .localeCompare(
          [b.state, b.district, b.area ?? "", b.business_name].join("|"),
        ),
    );
}

export function getDealerFilterOptions(
  dealers: PublicDealer[],
  filters: Pick<DealerFilters, "state" | "district">,
) {
  const stateMatches = filters.state
    ? dealers.filter(
        (dealer) => normalise(dealer.state) === normalise(filters.state),
      )
    : dealers;
  const districtMatches = filters.district
    ? stateMatches.filter(
        (dealer) => normalise(dealer.district) === normalise(filters.district),
      )
    : stateMatches;
  return {
    states: unique(dealers.map((dealer) => dealer.state)),
    districts: unique(stateMatches.map((dealer) => dealer.district)),
    areas: unique(districtMatches.map((dealer) => dealer.area)),
  };
}

export function dealerDirectionsUrl(dealer: PublicDealer) {
  if (dealer.google_maps_url) return dealer.google_maps_url;
  if (
    dealer.latitude !== null &&
    dealer.longitude !== null &&
    Number.isFinite(Number(dealer.latitude)) &&
    Number.isFinite(Number(dealer.longitude))
  )
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.latitude},${dealer.longitude}`)}`;
  return null;
}

export function dealerPhoneUrl(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
export function dealerResultText(count: number, filters: DealerFilters) {
  if (count === 0) return "No dealers found";
  const suffix = filters.district || filters.state;
  return `${count} ${count === 1 ? "Dealer" : "Dealers"} Found${suffix ? ` in ${filters.district || filters.state}` : ""}`;
}

export async function getVisibleDealers(): Promise<PublicDealer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_dealers")
    .select(
      "id,business_name,slug,phone,state,district,area,address,google_maps_url,latitude,longitude,shop_image",
    );
  if (error) throw error;
  return (data ?? []) as PublicDealer[];
}

export async function getVisibleDealerBySlug(slug: string) {
  return (
    (await getVisibleDealers()).find((dealer) => dealer.slug === slug) ?? null
  );
}
