import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./brand-mark";
const columns = [
  [
    "Products",
    [
      { label: "All Products", href: "/products" },
      {
        label: "Smart Kitchen & Wardrobe",
        href: "/products/kitchen-wardrobe-accessories",
      },
      {
        label: "Hardware Fittings & Profiles",
        href: "/products/hardware-fittings",
      },
      { label: "Smart Furniture", href: "/products/smart-furniture" },
      { label: "Home Decor", href: "/products/home-decor" },
    ],
  ],
  [
    "Company",
    [
      { label: "About WoodBay", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Manufacturing", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  ],
  [
    "Dealers & Support",
    [
      { label: "Find a Dealer", href: "/dealers" },
      { label: "Become a Dealer", href: "/dealers/become-a-dealer" },
      { label: "Verify Voucher", href: "/redeem" },
      { label: "Book Factory Visit", href: "/furniture/factory-visit" },
      { label: "Contact Support", href: "/contact" },
    ],
  ],
] as const;
export function Footer() {
  const enquiryHref = siteConfig.whatsappUrl ?? "/contact";
  return (
    <footer className="bg-[color:var(--background-dark)] text-[color:var(--foreground-light)]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 lg:py-16 xl:px-14">
        <p className="font-display border-b border-[color:var(--border-dark)] pb-7 text-2xl text-[#ded8cd] sm:text-3xl">
          Designed in detail. Built for living.
        </p>
        <div className="grid gap-10 py-10 md:grid-cols-[minmax(16rem,1.15fr)_2fr] md:gap-12 lg:grid-cols-[minmax(18rem,1.15fr)_2.3fr] lg:gap-20">
          <div className="max-w-sm">
            <BrandMark />
            <p className="mt-5 text-sm leading-6 text-[#c7c1b7]">
              Precision-crafted accessories and interiors for considered spaces.
            </p>
            <p className="mt-3 text-[10px] leading-5 tracking-[.11em] text-[#8f8b83] uppercase">
              Kitchen · Wardrobe · Hardware · Smart Living · Decor
            </p>
          </div>
          <nav aria-label="Footer" className="sm:hidden">
            {columns.map(([title, links]) => (
              <details key={title} className="group border-b border-[color:var(--border-dark)] first:border-t">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[11px] font-bold tracking-[.14em] text-[color:var(--gold)] uppercase">
                  {title}<ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-3">
                  {links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center text-[13px] text-[#d0cac0] transition-colors hover:text-[color:var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
          <nav aria-label="Footer links" className="hidden grid-cols-[1.25fr_.8fr_1fr] gap-x-10 sm:grid">
            {columns.map(([title, links]) => <div key={title}><h2 className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">{title}</h2><ul className="mt-4 space-y-2.5">{links.map((link) => <li key={`${link.label}-${link.href}`}><Link href={link.href} className="text-[13px] leading-5 text-[#d0cac0] underline-offset-4 transition-colors hover:text-[color:var(--gold)] hover:underline">{link.label}</Link></li>)}</ul></div>)}
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-[color:var(--border-dark)] pt-6 text-xs text-[#96928a] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} WoodBay Decor & Interiors</p>
          <div className="flex flex-wrap gap-x-5 sm:ml-5">
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-[color:var(--gold)]">
              Privacy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-[color:var(--gold)]">
              Terms
            </Link>
            <Link
              href="/sitemap.xml"
              className="inline-flex min-h-11 items-center gap-1"
            >
              Sitemap <ArrowUpRight size={12} />
            </Link>
          </div>
          <a
            href={enquiryHref}
            target={siteConfig.whatsappUrl ? "_blank" : undefined}
            rel={siteConfig.whatsappUrl ? "noreferrer" : undefined}
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-[#d8d2c8] sm:ml-auto"
          >
            WhatsApp / Enquire{" "}
            <ArrowRight
              size={13}
              className="text-[color:var(--gold)] transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
