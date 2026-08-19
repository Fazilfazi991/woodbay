/* eslint-disable @next/next/no-img-element -- Dealer-managed public asset URLs are resolved at runtime. */
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Download,
  MapPin,
  Navigation,
  Phone,
  Store,
} from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { dealer } from "@/config/dealers";
import {
  dealerLocation,
  dealerMapEmbedUrl,
  detailActions,
  type PublicDealerDetail,
} from "../data/detail";

function DealerImage({ src, alt }: { src: string | null; alt: string }) {
  return src ? (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 size-full object-cover"
      loading="lazy"
    />
  ) : (
    <Image
      src="/images/preview/woodbay-kitchen-preview.png"
      alt="Woodbay interior collection"
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover opacity-60"
    />
  );
}

export function DealerMiniPage({
  dealer: detail,
}: {
  dealer: PublicDealerDetail;
}) {
  const location = dealerLocation(detail),
    mapEmbed = dealerMapEmbedUrl(detail),
    actions = detailActions(detail);
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-10">
          <nav
            aria-label="Breadcrumb"
            className="text-xs tracking-[.1em] text-[color:var(--muted)] uppercase"
          >
            <Link href="/">Home</Link> <span aria-hidden>›</span>{" "}
            <Link href="/dealers">Dealers</Link> <span aria-hidden>›</span>{" "}
            <span>{detail.business_name}</span>
          </nav>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                <BadgeCheck size={17} /> Authorised Woodbay Dealer
              </p>
              <h1 className="font-display mt-5 text-6xl leading-[.9] sm:text-7xl">
                {detail.business_name}
              </h1>
              {location && (
                <p className="mt-6 flex items-center gap-2 text-sm text-[color:var(--muted)]">
                  <MapPin size={16} /> {location}
                </p>
              )}
              <ActionRow
                dealer={detail}
                call={actions.call}
                directions={actions.directions}
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--border-gold)]">
              <DealerImage
                src={detail.shop_image}
                alt={`${detail.business_name} showroom`}
              />
            </div>
          </div>
        </Container>
      </section>
      <Section tone="light">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <section>
              <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                Dealer information
              </p>
              <h2 className="font-display mt-3 text-5xl">
                Visit or call your local Woodbay dealer.
              </h2>
            </section>
            <dl className="grid gap-5 border-y border-[#d7cebf] py-6 text-sm">
              <Info label="Dealer" value={detail.business_name} />
              <Info label="Phone" value={detail.phone} />
              <Info label="Location" value={location} />
              <Info label="Address" value={detail.address} />
            </dl>
          </div>
        </Container>
      </Section>
      {mapEmbed && (
        <Section tone="light">
          <Container>
            <div className="overflow-hidden border border-[#d7cebf]">
              <iframe
                title={`Map for ${detail.business_name}`}
                src={mapEmbed}
                loading="lazy"
                className="h-80 w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Container>
        </Section>
      )}
      {detail.payment_qr_image && (
        <Section tone="dark">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div className="relative mx-auto aspect-square w-full max-w-72 overflow-hidden bg-white p-4">
                <img
                  src={detail.payment_qr_image}
                  alt={`Payment QR for ${detail.business_name}`}
                  className="size-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                  Pay at this dealer
                </p>
                <h2 className="font-display mt-3 text-5xl">
                  Dealer payment QR.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
                  Use this QR only when making a payment directly to{" "}
                  {detail.business_name}. Woodbay does not process this payment.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}
      <Section tone="light">
        <Container>
          <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
            Explore the Woodbay collection
          </p>
          <h2 className="font-display mt-3 text-5xl">
            Details for better spaces.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dealer.productLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-[#d7cebf] p-5 text-sm font-semibold hover:border-[color:var(--gold)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-[color:var(--muted-dark)]">
            Product availability may vary by dealer. Contact the dealer for
            current availability.
          </p>
          <Link href="/downloads" className="mt-7 inline-block">
            <Button variant="light">
              <Download size={16} /> Download catalogue
            </Button>
          </Link>
        </Container>
      </Section>
      <Section tone="dark">
        <Container>
          <div className="flex flex-col justify-between gap-6 border-y border-[color:var(--border-gold)] py-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                Woodbay assurance
              </p>
              <h2 className="font-display mt-2 text-4xl">
                An authorised Woodbay dealer.
              </h2>
            </div>
            <Link href="/dealers">
              <Button variant="secondary">
                <Store size={16} /> Find another dealer
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Looking to partner with Woodbay?"
        description="Explore the Accessories Dealer application for your business."
        action={{ label: "Become a dealer", href: "/dealers/become-a-dealer" }}
      />
    </>
  );
}
function Info({ label, value }: { label: string; value: string | null }) {
  return value ? (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
      <dt className="text-xs font-bold tracking-[.1em] text-[color:var(--gold)] uppercase">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  ) : null;
}
function ActionRow({
  dealer,
  call,
  directions,
}: {
  dealer: PublicDealerDetail;
  call: string | null;
  directions: string | null;
}) {
  return (
    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
      {call && (
        <a href={call} aria-label={`Call ${dealer.business_name}`}>
          <Button>
            <Phone size={16} /> Call dealer
          </Button>
        </a>
      )}
      {directions && (
        <a
          href={directions}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Get directions to ${dealer.business_name}`}
        >
          <Button variant="secondary">
            <Navigation size={16} /> Get directions
          </Button>
        </a>
      )}
      <Link href="/downloads">
        <Button variant="secondary">
          <Download size={16} /> Download catalogue
        </Button>
      </Link>
    </div>
  );
}
