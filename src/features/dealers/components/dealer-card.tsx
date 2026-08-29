import Link from "next/link";
import { MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dealerDirectionsUrl,
  dealerPhoneUrl,
  type PublicDealer,
} from "../data/locator";

export function DealerCard({ dealer }: { dealer: PublicDealer }) {
  const directions = dealerDirectionsUrl(dealer);
  return (
    <article className="flex flex-col border border-[#d7cebf] bg-[color:var(--surface-light)] p-5 text-[color:var(--foreground-dark)] sm:min-h-72 sm:p-6">
      <p className="flex items-center gap-2 text-xs font-bold tracking-[.12em] text-[color:var(--gold)] uppercase">
        <MapPin size={15} /> {dealer.area || dealer.district}
      </p>
      <h2 className="font-display mt-5 text-3xl leading-none sm:mt-8 sm:text-4xl">
        {dealer.business_name}
      </h2>
      <p className="mt-5 text-sm text-[color:var(--muted-dark)]">
        {[dealer.district, dealer.state].filter(Boolean).join(", ")}
      </p>
      {dealer.address && (
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted-dark)]">
          {dealer.address}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 sm:gap-3 sm:pt-8">
        <a
          href={dealerPhoneUrl(dealer.phone)}
          aria-label={`Call ${dealer.business_name}`}
        >
          <Button variant="light">
            <Phone size={15} /> Call
          </Button>
        </a>
        {directions && (
          <a
            href={directions}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Get directions to ${dealer.business_name}`}
          >
            <Button variant="light">
              <Navigation size={15} /> Directions
            </Button>
          </a>
        )}
        <Link
          href={`/dealers/${dealer.slug}`}
          className="inline-flex min-h-11 items-center px-2 text-xs font-bold tracking-[.1em] uppercase hover:text-[color:var(--gold)]"
        >
          View dealer
        </Link>
      </div>
    </article>
  );
}
