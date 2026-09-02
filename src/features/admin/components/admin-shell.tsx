"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Boxes,
  ClipboardList,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  PackageSearch,
  TicketCheck,
  X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const navigation = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: PackageSearch },
      { label: "Projects", href: "/admin/projects", icon: Boxes },
    ],
  },
  {
    label: "Customers",
    items: [
      {
        label: "Furniture enquiries",
        href: "/admin/enquiries",
        icon: MessageSquareText,
      },
      {
        label: "Visits & outlets",
        href: "/admin/requests",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Dealer network",
    items: [
      { label: "Applications", href: "/admin/dealers", icon: Handshake },
      {
        label: "Dealers",
        href: "/admin/dealers?view=network",
        icon: PackageSearch,
      },
    ],
  },
  {
    label: "Vouchers",
    items: [
      {
        label: "Voucher inventory",
        href: "/admin/vouchers",
        icon: TicketCheck,
      },
    ],
  },
];

function pageTitle(pathname: string, view: string | null) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/products/"))
    return pathname.endsWith("/new") ? "Add product" : "Product details";
  if (pathname === "/admin/products") return "Products";
  if (pathname.startsWith("/admin/enquiries/")) return "Enquiry details";
  if (pathname === "/admin/enquiries") return "Furniture enquiries";
  if (pathname.startsWith("/admin/dealers/")) return "Dealer application";
  if (pathname === "/admin/dealers")
    return view === "network" ? "Dealers" : "Dealer applications";
  if (pathname.startsWith("/admin/vouchers/")) return "Voucher details";
  if (pathname === "/admin/vouchers") return "Vouchers";
  if (pathname.startsWith("/admin/requests/")) return "Request details";
  if (pathname === "/admin/requests") return "Visits & outlets";
  if (pathname.startsWith("/admin/projects/")) return "Project details";
  if (pathname === "/admin/projects") return "Projects";
  if (pathname === "/admin/voucher-verifications")
    return "Legacy verifications";
  return "Admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = menuButtonRef.current;
    const focusable = () =>
      [...(drawerRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href]',
      ) ?? [])];
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);
  if (pathname === "/admin/login") return children;

  const currentTitle = pageTitle(pathname, searchParams.get("view"));
  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (
      pathname !== path &&
      !(path !== "/admin" && pathname.startsWith(`${path}/`))
    )
      return false;
    if (query === "view=network") return searchParams.get("view") === "network";
    return path !== "/admin/dealers" || searchParams.get("view") !== "network";
  };

  const sidebar = (
    <aside className="admin-sidebar" aria-label="Admin navigation">
      <div className="admin-brand">
        <span className="admin-brand-mark" aria-hidden="true" />
        <span>
          <strong>WOODBAY</strong>
          <small>CONTROL PANEL</small>
        </span>
      </div>
      <nav className="admin-nav">
        {navigation.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
        <form action={logout}>
          <button type="submit" aria-label="Log out">
            <LogOut size={17} aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell">
      <div className="admin-sidebar-desktop">{sidebar}</div>
      {open && (
        <div className="admin-drawer">
          <button
            className="admin-drawer-backdrop"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div
            ref={drawerRef}
            className="admin-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
          >
            <button
              className="admin-drawer-close"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}
      <div className="admin-workspace" aria-hidden={open || undefined}>
        <header className="admin-topbar">
          <button
            ref={menuButtonRef}
            className="admin-menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <span>WoodBay Admin</span>
            <strong>{currentTitle}</strong>
          </div>
          <div className="admin-account">
            <span>A</span>
            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
