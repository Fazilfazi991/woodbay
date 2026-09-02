import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container, Section } from "@/components/layout/primitives";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { DealerApplicationForm } from "./dealer-application-form";

export function DealerApplicationPage() {
  return (
    <>
      <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]">
        <Container className="py-14 sm:py-20">
          <h1 className="font-display max-w-3xl text-[2.7rem] leading-[.98] sm:text-7xl">
            Become a WoodBay Dealer.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
            Tell us about your business and the WoodBay collections you want to represent. This short application helps our team understand your market and partnership goals.
          </p>
        </Container>
      </section>
      <Section tone="dark" className="!pt-10 sm:!pt-16">
        <Container className="max-w-3xl">
          <DealerApplicationForm />
          {siteConfig.whatsappUrl && (
            <aside className="mt-10 flex flex-col gap-4 border-t border-[color:var(--border-dark)] pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl">Need help with your application?</h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Contact WoodBay on WhatsApp for application support.</p>
              </div>
              <Link href={`${siteConfig.whatsappUrl}${siteConfig.whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent("Hi WoodBay, I need help with the dealer application.")}`} target="_blank" rel="noreferrer">
                <Button variant="secondary"><MessageCircle size={17} /> WhatsApp Support</Button>
              </Link>
            </aside>
          )}
        </Container>
      </Section>
    </>
  );
}
