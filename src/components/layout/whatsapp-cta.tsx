import { siteConfig } from "@/config/site";

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="size-[18px] shrink-0"
      fill="currentColor"
    >
      <path d="M16.05 3A12.9 12.9 0 0 0 5.1 22.7L3 29l6.5-2A12.9 12.9 0 1 0 16.05 3Zm0 23.45a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.86 1.18 1.26-3.76-.25-.39a10.6 10.6 0 1 1 8.64 4.68Zm5.81-7.95c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.49-1.54-.92-.82-1.54-1.83-1.72-2.14-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.53-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.25 3.43 5.45 4.82.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

export function WhatsAppCta() {
  const common =
    "fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 border border-[#25D366] bg-[color:var(--background-dark)] px-3.5 text-xs font-bold uppercase tracking-[.1em] text-[#25D366] shadow-xl transition hover:bg-[#25D366] hover:text-[color:var(--background-dark)]";

  if (!siteConfig.whatsappUrl) {
    return (
      <span
        className={`${common} cursor-not-allowed opacity-70`}
        aria-label="WhatsApp contact number will be announced"
        title="WhatsApp contact number will be announced"
      >
        <WhatsAppIcon />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </span>
    );
  }

  return (
    <a
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className={common}
      aria-label="Chat with Woodbay on WhatsApp"
    >
      <WhatsAppIcon />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
