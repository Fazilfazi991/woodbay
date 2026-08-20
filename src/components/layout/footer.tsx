import Link from "next/link";
import { ArrowUpRight, Camera, Globe2, PlayCircle } from "lucide-react";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BrandMark } from "./brand-mark";
const columns = [
  ["Products", footerNavigation.products],
  ["Company", footerNavigation.company],
  ["Dealers", footerNavigation.dealers],
  ["Support", footerNavigation.support],
] as const;
const socialLinks = [
  { Icon: Globe2, href: siteConfig.social.facebook, label: "Facebook" },
  { Icon: Camera, href: siteConfig.social.instagram, label: "Instagram" },
  { Icon: PlayCircle, href: siteConfig.social.youtube, label: "YouTube" },
].filter((link): link is { Icon: typeof Globe2; href: string; label: string } =>
  Boolean(link.href),
);
const hasContact = Boolean(
  siteConfig.contact.phone ||
  siteConfig.contact.email ||
  siteConfig.contact.factoryAddress,
);
export function Footer() {
  return (
    <footer className="bg-[color:var(--background-dark)] text-[color:var(--foreground-light)]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 lg:py-20 xl:px-14">
        <div
          className={`grid gap-12 border-b border-[color:var(--border-dark)] pb-14 ${hasContact ? "lg:grid-cols-[1.35fr_2fr_1fr]" : "lg:grid-cols-[1.35fr_2fr]"}`}
        >
          <div>
            <BrandMark />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#bdb8af]">
              Precision-crafted accessories and interiors for considered spaces.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-7 flex gap-3">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="grid size-10 place-items-center border border-[color:var(--border-dark)] text-[color:var(--gold)] hover:border-[color:var(--gold)]"
                  >
                    <Icon size={17} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map(([title, links]) => (
              <div key={title}>
                <h2 className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                  {title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#c1bbb1] hover:text-[color:var(--gold)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {hasContact && (
            <div>
              <h2 className="text-[10px] font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Contact
              </h2>
              <address className="mt-5 space-y-3 text-sm leading-6 text-[#c1bbb1] not-italic">
                {siteConfig.contact.phone && (
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="block hover:text-[color:var(--gold)]"
                  >
                    {siteConfig.contact.phone}
                  </a>
                )}
                {siteConfig.contact.email && (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="block hover:text-[color:var(--gold)]"
                  >
                    {siteConfig.contact.email}
                  </a>
                )}
                {siteConfig.contact.factoryAddress && (
                  <p>{siteConfig.contact.factoryAddress}</p>
                )}
              </address>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-[#8d8a82] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Woodbay. All rights reserved.</p>
          <Link href="/sitemap.xml" className="inline-flex items-center gap-1">
            Sitemap <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
