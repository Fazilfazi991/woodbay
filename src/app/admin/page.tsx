import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/auth/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";
export const dynamic = "force-dynamic";
export default async function AdminPage() { const admin = await getActiveAdmin(); if (!admin) redirect("/admin/login"); return <main className="mx-auto max-w-4xl p-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold">WOODBAY Admin</h1><p className="text-[color:var(--muted)]">Batch 0 foundation</p></div><form action={logout}><Button>Log out</Button></form></div><Card className="mt-8"><p className="font-medium">{admin.fullName}</p><Badge className="mt-2">{admin.role.replace("_", " ")}</Badge><p className="mt-6 text-sm text-[color:var(--muted)]">The content management interface is intentionally deferred to later batches.</p></Card></main>; }
