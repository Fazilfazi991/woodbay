import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveAdmin } from "@/lib/auth/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";
export const dynamic = "force-dynamic";
export default async function AdminPage() { const admin = await getActiveAdmin(); if (!admin) redirect("/admin/login"); return <main className="mx-auto max-w-4xl p-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">WOODBAY Admin</h1><p className="text-[color:var(--muted)]">Catalogue and workflow management</p></div><form action={logout}><Button>Log out</Button></form></div><Card className="mt-8"><p className="font-medium">{admin.fullName}</p><Badge className="mt-2">{admin.role.replace("_", " ")}</Badge><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/admin/products" className="border p-4"><b>Products</b><p className="mt-1 text-sm text-[color:var(--muted)]">Edit catalogue content and visibility.</p></Link><Link href="/admin/enquiries" className="border p-4"><b>Furniture enquiries</b><p className="mt-1 text-sm text-[color:var(--muted)]">Review customer requests.</p></Link><Link href="/admin/dealers" className="border p-4"><b>Dealer applications</b><p className="mt-1 text-sm text-[color:var(--muted)]">Review dealer applications.</p></Link><Link href="/admin/vouchers" className="border p-4"><b>Vouchers</b><p className="mt-1 text-sm text-[color:var(--muted)]">Create and manage one-time vouchers.</p></Link></div></Card></main>; }
