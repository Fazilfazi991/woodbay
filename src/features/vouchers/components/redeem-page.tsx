import { ShieldCheck } from "lucide-react";
import { CTASection, Container, Section } from "@/components/layout/primitives";
import { VerificationRequestForm } from "./verification-request-form";

export function RedeemPage({ initialCode }: { initialCode: string }) {
  return <>
    <section className="bg-[color:var(--background-deep)] text-[color:var(--foreground-light)]"><Container className="py-14 sm:py-20"><p className="text-xs font-bold uppercase tracking-[.16em] text-[color:var(--gold)]">Independent support service</p><h1 className="font-display mt-5 max-w-3xl text-5xl leading-[.92] sm:text-7xl">Voucher Verification.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--muted)]">Submit product, dealer and purchase-reference information for Woodbay’s team to review. This is not a shopping coupon or promotional-code form.</p></Container></section>
    <Section tone="light"><Container className="max-w-4xl"><div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><ShieldCheck className="text-[color:var(--gold)]" /><h2 className="font-display mt-5 text-4xl">Request a review.</h2><p className="mt-4 text-sm leading-7 text-[color:var(--muted-dark)]">Verification applies only to selected products and cases. Submitting this form does not redeem, approve or reject a voucher automatically.</p></div><div className="border border-[#d7cebf] bg-white p-5 sm:p-8"><VerificationRequestForm key={initialCode} /></div></div></Container></Section>
    <CTASection title="Need help with verification?" description="Contact Woodbay if you are unsure which reference or product details to provide." action={{ label: "Contact Woodbay", href: "/contact" }} />
  </>;
}
