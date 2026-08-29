import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import {
  filterDealers,
  getDealerFilterOptions,
  getVisibleDealers,
  parseDealerFilters,
  dealerResultText,
  type PublicDealer,
} from "../data/locator";
import { DealerCard } from "./dealer-card";
import { DealerLocatorFilters } from "./dealer-locator-filters";

export async function DealerLocatorPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  let dealers: PublicDealer[] = [],
    failed = false;
  try {
    dealers = await getVisibleDealers();
  } catch {
    failed = true;
  }
  const filters = parseDealerFilters(searchParams);
  const results = filterDealers(dealers, filters);
  const options = getDealerFilterOptions(dealers, filters);
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-14 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="text-xs tracking-[.1em] text-[color:var(--muted)] uppercase"
          >
            <Link href="/">Home</Link> <span aria-hidden>›</span>{" "}
            <span>Dealers</span>
          </nav>
          <p className="mt-8 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
            Woodbay dealer network
          </p>
          <h1 className="font-display mt-4 text-[2.5rem] leading-[.94] sm:text-[4.5rem]">
            Find Woodbay Near You.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)]">
            Find authorised Woodbay dealers for kitchen, wardrobe and interior
            product solutions in your area.
          </p>
          <div className="mt-8 grid gap-3 sm:flex">
            <a href="#dealer-locator" className="max-sm:block">
              <Button className="max-sm:w-full">Find a dealer</Button>
            </a>
            <Link href="/dealers/become-a-dealer" className="max-sm:block">
              <Button variant="secondary" className="max-sm:w-full">
                Become a dealer <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
      <Section tone="light">
        <Container>
          <DealerLocatorFilters options={options} />
          <div className="mt-6 flex items-center justify-between gap-5">
            <p role="status" className="text-sm font-semibold">
              {dealerResultText(results.length, filters)}
            </p>
            {dealers.length > 0 && (
              <p className="text-xs text-[color:var(--muted-dark)]">
                Authorised visible dealers only
              </p>
            )}
          </div>
          {failed ? (
            <div className="mt-8 border border-[#d7cebf] p-8">
              Dealer availability could not be loaded. Please contact Woodbay
              for assistance.
            </div>
          ) : results.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((dealer) => (
                <DealerCard key={dealer.id} dealer={dealer} />
              ))}
            </div>
          ) : (
            <EmptyDealerState hasDealers={dealers.length > 0} />
          )}
        </Container>
      </Section>
      <Section tone="light">
        <Container>
          <div className="grid gap-5 border-y border-[#d7cebf] py-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                Dealer partnership
              </p>
              <h2 className="font-display mt-3 text-4xl">
                Interested in joining the network?
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link href="/dealers/become-a-dealer">
                <Button variant="light">Become a dealer</Button>
              </Link>
              <Link
                href="/furniture/outlets"
                className="text-xs font-bold tracking-[.1em] uppercase"
              >
                Furniture outlet enquiry{" "}
                <ArrowRight className="inline" size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <CTASection
        title="Need help finding the right Woodbay solution?"
        description="Our team can help when a dealer is not yet available in your area."
        action={{ label: "Contact Woodbay", href: "/contact" }}
      />
    </>
  );
}

function EmptyDealerState({ hasDealers }: { hasDealers: boolean }) {
  return (
    <div className="mt-8 grid place-items-center border border-[#d7cebf] p-10 text-center">
      <MapPin size={25} className="text-[color:var(--gold)]" />
      <h2 className="font-display mt-5 text-4xl">
        {hasDealers
          ? "No Woodbay dealers were found for this location."
          : "Woodbay’s dealer network is being updated."}
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-[color:var(--muted-dark)]">
        Try a different location or contact Woodbay for assistance.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/dealers">
          <Button variant="light">Clear filters</Button>
        </Link>
        <Link href="/dealers/become-a-dealer">
          <Button variant="light">Become a dealer</Button>
        </Link>
        <Link href="/contact">
          <Button variant="light">Contact Woodbay</Button>
        </Link>
      </div>
    </div>
  );
}
