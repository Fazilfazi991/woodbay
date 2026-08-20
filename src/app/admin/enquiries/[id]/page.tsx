import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEnquiry, updateEnquiry } from "@/features/furniture/admin";
import { ENQUIRY_STATUS_OPTIONS, enquiryStatusLabel } from "@/features/furniture/enquiry-status";
import { getActiveAdmin } from "@/lib/auth/admin";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getActiveAdmin())) redirect("/admin/login"); let enquiry; try { enquiry = await getEnquiry((await params).id); } catch { notFound(); }
  return <main className="mx-auto max-w-4xl p-4 sm:p-6"><h1 className="text-3xl font-semibold">{enquiry.name}</h1><p>{enquiry.furniture_type} · {enquiryStatusLabel(enquiry.status)}</p><div className="mt-4 flex gap-3"><a href={`tel:${enquiry.phone}`}>Call</a><a href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}`}>WhatsApp</a>{enquiry.email && <a href={`mailto:${enquiry.email}`}>Email</a>}</div><form action={updateEnquiry} className="mt-6 grid gap-4"><input type="hidden" name="id" value={enquiry.id}/><label>Status<select name="status" defaultValue={enquiry.status} className="mt-1 min-h-11 w-full border px-3">{ENQUIRY_STATUS_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label>Internal note<textarea name="admin_notes" defaultValue={enquiry.admin_notes ?? ""} className="mt-1 w-full border p-3" rows={4}/></label><Button className="w-fit">Save update</Button></form></main>;
}
