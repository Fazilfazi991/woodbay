import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { DealerMiniPage } from "@/features/dealers/components/dealer-mini-page";
import {
  dealerLocalBusinessSchema,
  dealerLocation,
  getPublicDealerBySlug,
  isQaDealer,
} from "@/features/dealers/data/detail";

type Props = { params: Promise<{ dealerSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dealer = await getPublicDealerBySlug((await params).dealerSlug);
  if (!dealer) return {};
  const location = dealerLocation(dealer);
  const canonical = `/dealers/${dealer.slug}`;
  const qa = isQaDealer(dealer);
  return {
    title: `${dealer.business_name} | Woodbay Dealer${dealer.district ? ` in ${dealer.district}` : ""}`,
    description: `Find contact details, location and Woodbay product information for ${dealer.business_name}${location ? ` in ${location}` : ""}.`,
    alternates: { canonical },
    robots: qa ? { index: false, follow: false } : undefined,
    openGraph: {
      title: `${dealer.business_name} | Authorised Woodbay Dealer`,
      description: location || "Authorised Woodbay Dealer",
      images: dealer.shop_image ? [dealer.shop_image] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const dealer = await getPublicDealerBySlug((await params).dealerSlug);
  if (!dealer || isQaDealer(dealer)) notFound();
  const schema = dealerLocalBusinessSchema(
    dealer,
    `${siteConfig.url}/dealers/${dealer.slug}`,
  );
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <DealerMiniPage dealer={dealer} />
    </>
  );
}
