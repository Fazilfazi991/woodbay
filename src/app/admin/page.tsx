import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Box,
  Handshake,
  MessageSquareText,
  Plus,
  TicketCheck,
  UserRoundCheck,
} from "lucide-react";
import { getAdminDashboard } from "@/features/admin/dashboard";
import { getActiveAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

function adminDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminPage() {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const data = await getAdminDashboard();
  const metrics = [
    {
      label: "Published products",
      value: data.metrics.publishedProducts,
      icon: Box,
      href: "/admin/products?status=published",
    },
    {
      label: "New dealer applications",
      value: data.metrics.newApplications,
      icon: Handshake,
      href: "/admin/dealers?status=new",
      attention: data.metrics.newApplications > 0,
    },
    {
      label: "Public dealers",
      value: data.metrics.publicDealers,
      icon: UserRoundCheck,
      href: "/admin/dealers?view=network",
    },
    {
      label: "Available vouchers",
      value: data.metrics.availableVouchers,
      icon: TicketCheck,
      href: "/admin/vouchers?status=available",
    },
    {
      label: "Redeemed vouchers",
      value: data.metrics.redeemedVouchers,
      icon: TicketCheck,
      href: "/admin/vouchers?status=redeemed",
    },
    {
      label: "New enquiries",
      value: data.metrics.newEnquiries,
      icon: MessageSquareText,
      href: "/admin/enquiries?status=new",
      attention: data.metrics.newEnquiries > 0,
    },
  ];
  return (
    <main className="admin-dashboard mx-auto max-w-7xl">
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>A concise view of catalogue and customer operations.</p>
        </div>
        <div className="admin-quick-actions">
          <Link href="/admin/products/new">
            <Plus size={16} /> Add product
          </Link>
          <Link href="/admin/vouchers?create=1">
            <TicketCheck size={16} /> Create voucher
          </Link>
        </div>
      </div>
      <section className="admin-metric-grid" aria-label="Operational summary">
        {metrics.map(({ label, value, icon: Icon, href, attention }) => (
          <Link
            href={href}
            key={label}
            className={attention ? "is-attention" : undefined}
          >
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
            <Icon size={19} aria-hidden="true" />
          </Link>
        ))}
      </section>
      {(data.metrics.newApplications > 0 || data.metrics.newEnquiries > 0) && (
        <section className="admin-attention">
          <div>
            <strong>Needs attention</strong>
            <p>
              {data.metrics.newApplications > 0 &&
                `${data.metrics.newApplications} new dealer application${data.metrics.newApplications === 1 ? "" : "s"}`}
              {data.metrics.newApplications > 0 && data.metrics.newEnquiries > 0
                ? " · "
                : ""}
              {data.metrics.newEnquiries > 0 &&
                `${data.metrics.newEnquiries} new furniture enquir${data.metrics.newEnquiries === 1 ? "y" : "ies"}`}
            </p>
          </div>
          <Link
            href={
              data.metrics.newApplications > 0
                ? "/admin/dealers?status=new"
                : "/admin/enquiries?status=new"
            }
          >
            Review now <ArrowRight size={15} />
          </Link>
        </section>
      )}
      <div className="admin-recent-grid">
        <Recent
          title="Recent dealer applications"
          subtitle="Latest partnership requests"
          allHref="/admin/dealers"
          empty="No dealer applications yet."
          items={data.recentApplications.map((item) => ({
            id: item.id,
            href: `/admin/dealers/${item.id}`,
            title: item.business_name,
            detail: `${item.contact_person} · ${adminDate(item.created_at)}`,
            status: item.status,
          }))}
        />
        <Recent
          title="Recent furniture enquiries"
          subtitle="Latest customer requirements"
          allHref="/admin/enquiries"
          empty="No furniture enquiries yet."
          items={data.recentEnquiries.map((item) => ({
            id: item.id,
            href: `/admin/enquiries/${item.id}`,
            title: item.name,
            detail: `${item.furniture_type} · ${adminDate(item.created_at)}`,
            status: item.status,
          }))}
        />
        <Recent
          title="Recent voucher registrations"
          subtitle="Latest customer registrations"
          allHref="/admin/vouchers?status=redeemed"
          empty="No voucher registrations yet."
          items={data.recentRedemptions.map((item) => ({
            id: item.id,
            href: `/admin/vouchers/${item.voucher_id}`,
            title: item.customer_name,
            detail: `${item.dealer_name} · ${adminDate(item.redeemed_at)}`,
            status: "registered",
          }))}
        />
      </div>
    </main>
  );
}

function Recent({
  title,
  subtitle,
  allHref,
  empty,
  items,
}: {
  title: string;
  subtitle: string;
  allHref: string;
  empty: string;
  items: {
    id: string;
    href: string;
    title: string;
    detail: string;
    status: string;
  }[];
}) {
  return (
    <section className="admin-recent">
      <header>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <Link href={allHref}>View all</Link>
      </header>
      <div>
        {items.map((item) => (
          <Link href={item.href} key={item.id}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </span>
            <b>{item.status}</b>
          </Link>
        ))}
        {items.length === 0 && <p className="admin-empty">{empty}</p>}
      </div>
    </section>
  );
}
