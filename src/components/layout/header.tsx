"use client";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/config/navigation";
import { BrandMark } from "./brand-mark";

const headerNavigation = primaryNavigation;
const desktopNavLabelClass = "desktop-nav-link";

export function Header() {
  const pathname = usePathname();
  const isHomeTwo = pathname === "/home-2";
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
      if (event.key === "Tab" && drawer && drawerRef.current) {
        const nodes = drawerRef.current.querySelectorAll<HTMLElement>(
          "a,button:not([disabled])",
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [drawer]);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);
  return (
    <header
      className={`sticky top-0 z-50 border-b border-[color:var(--border-dark)] ${isHomeTwo ? "home-two-header bg-[#0e0e0e]" : "bg-[color:var(--background-dark)]"}`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center px-5 md:px-8 xl:h-20 xl:px-14">
        <BrandMark />
        <nav
          ref={navRef}
          aria-label="Primary navigation"
          className="mr-6 ml-auto hidden items-center gap-1 xl:flex"
        >
          {headerNavigation.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open === item.label}
                  aria-controls={`${item.label.toLowerCase()}-menu`}
                  onClick={() =>
                    setOpen(open === item.label ? null : item.label)
                  }
                  className={`${desktopNavLabelClass} inline-flex min-h-11 items-center gap-1.5 px-3 hover:text-[color:var(--gold)] focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--gold)]`}
                >
                  {item.label}
                  <ChevronDown
                    className="translate-y-px"
                    size={12}
                    strokeWidth={1.5}
                  />
                </button>
                {open === item.label && (
                  <div
                    id={`${item.label.toLowerCase()}-menu`}
                    className="absolute top-full left-0 z-[70] w-60 border border-[color:var(--gold)] bg-[#191a17] p-2 shadow-2xl"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(null)}
                        className="block px-3 py-3 text-sm font-medium !text-[#f7f3eb] opacity-100 hover:bg-white/5 hover:!text-[color:var(--gold)] focus:bg-white/5 focus:outline-2 focus:outline-[color:var(--gold)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`${desktopNavLabelClass} inline-flex min-h-11 items-center px-3 hover:text-[color:var(--gold)] focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--gold)]`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={drawer}
          aria-controls="mobile-menu"
          onClick={() => setDrawer(true)}
          className="ml-auto grid min-h-11 min-w-11 place-items-center text-[color:var(--gold)] xl:hidden"
        >
          <Menu size={27} strokeWidth={1.4} />
        </button>
      </div>
      {drawer && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="mobile-menu-panel fixed inset-0 z-[60] h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain bg-[#0e0e0e] px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] xl:hidden"
        >
          <div className="flex items-start justify-between">
            <BrandMark />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              className="grid min-h-11 min-w-11 place-items-center text-[color:var(--gold)]"
            >
              <X size={25} strokeWidth={1.5} />
            </button>
          </div>
          <nav
            className="mt-10 border-t border-[color:var(--border-dark)]"
            aria-label="Mobile navigation"
          >
            {headerNavigation.map((item) => (
              <MobileItem
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={() => setDrawer(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
function MobileItem({
  item,
  pathname,
  onNavigate,
}: {
  item: (typeof primaryNavigation)[number];
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!item.children)
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={pathname === item.href ? "page" : undefined}
        className={`flex min-h-14 items-center border-b border-[color:var(--border-dark)] text-sm font-bold tracking-[.12em] uppercase transition-colors active:bg-white/[.06] ${pathname === item.href ? "!text-[color:var(--gold)]" : "!text-[#f7f3eb]"}`}
      >
        {item.label}
      </Link>
    );
  return (
    <div className="border-b border-[color:var(--border-dark)]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`mobile-${item.label.toLowerCase()}`}
        className="flex min-h-14 w-full items-center justify-between text-left text-sm font-bold tracking-[.12em] !text-[#f7f3eb] uppercase transition-colors active:bg-white/[.06] active:!text-[color:var(--gold)]"
      >
        {item.label}
        <ChevronDown
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          size={17}
          strokeWidth={1.5}
        />
      </button>
      {expanded && (
        <div id={`mobile-${item.label.toLowerCase()}`} className="pb-3 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              aria-current={pathname === child.href ? "page" : undefined}
              className={`flex min-h-12 items-center py-2 text-[15px] leading-5 font-medium opacity-100 transition-colors active:bg-white/[.06] ${pathname === child.href ? "!text-[color:var(--gold)]" : "!text-[#d6d0c7]"}`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
