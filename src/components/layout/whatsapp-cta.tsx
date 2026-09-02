import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { siteConfig } from "@/config/site";

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="size-6 shrink-0"
      fill="currentColor"
    >
      <path d="M16.05 3A12.9 12.9 0 0 0 5.1 22.7L3 29l6.5-2A12.9 12.9 0 1 0 16.05 3Zm0 23.45a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.86 1.18 1.26-3.76-.25-.39a10.6 10.6 0 1 1 8.64 4.68Zm5.81-7.95c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.83-1.72-2.14-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.53-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.25 3.43 5.45 4.82.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export function WhatsAppCta() {
  const common =
    "whatsapp-floating inline-flex size-[3.25rem] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,.3)] transition-[transform,background-color,box-shadow] duration-200 hover:scale-[1.04] hover:bg-[#1fbd59] hover:shadow-[0_10px_28px_rgba(0,0,0,.34)] active:scale-[.97] sm:size-14";

  const voucher = (
    <Link
      href="/redeem"
      className="inline-flex h-[4.25rem] w-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-[14px] border border-[color:var(--gold)] bg-[#24251f] px-1 text-[8px] leading-[1.05] font-bold tracking-[.02em] !text-[#fbf8f0] uppercase shadow-[0_8px_24px_rgba(0,0,0,.24)] transition-colors hover:bg-[color:var(--gold)] hover:!text-[#171711] lg:h-11 lg:w-auto lg:flex-row lg:gap-2 lg:rounded-full lg:px-3.5 lg:text-[11px] lg:leading-normal lg:tracking-[.08em]"
      aria-label="Verify a Woodbay voucher"
    >
      <BadgeCheck size={17} strokeWidth={1.6} />
      <span className="text-center lg:hidden">
        Verify
        <br />
        Voucher
      </span>
      <span className="hidden lg:inline">Verify Voucher</span>
    </Link>
  );

  if (!siteConfig.whatsappUrl) {
    return (
      <FloatingActions voucher={voucher}>
        <span
          className={`${common} cursor-not-allowed opacity-70`}
          aria-label="WhatsApp enquiries are temporarily unavailable"
          title="WhatsApp contact number will be announced"
        >
          <WhatsAppIcon />
        </span>
      </FloatingActions>
    );
  }

  return (
    <FloatingActions voucher={voucher}>
      <a
        href={`${siteConfig.whatsappUrl}${siteConfig.whatsappUrl.includes("?") ? "&" : "?"}text=${encodeURIComponent("Hi WoodBay, I’d like to know more about your products.")}`}
        target="_blank"
        rel="noreferrer"
        className={common}
        aria-label="Enquire on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </FloatingActions>
  );
}

function FloatingActions({
  voucher,
  children,
}: {
  voucher: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <aside
      aria-label="Quick actions"
      className="floating-actions fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-2.5 sm:right-[max(1.25rem,env(safe-area-inset-right))] sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      {voucher}
      {children}
    </aside>
  );
}
