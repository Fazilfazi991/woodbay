"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { removeDealerImage, updateDealerAction, uploadDealerImage, type DealerActionState } from "@/features/dealers/admin";

const initialState: DealerActionState = { ok: false, message: "" };

type Dealer = {
  id: string; business_name: string; contact_person: string | null; phone: string; email: string | null;
  state: string; district: string; area: string | null; address: string; google_maps_url: string | null;
  latitude: number | string | null; longitude: number | string | null; payment_qr_image: string | null;
  shop_image: string | null; status: "pending" | "active" | "inactive"; is_visible: boolean;
};

export function DealerEditForm({ dealer }: { dealer: Dealer }) {
  const [state, action, pending] = useActionState(updateDealerAction, initialState);
  const [localNotice, setLocalNotice] = useState(initialState);
  const [dismissedMessage, setDismissedMessage] = useState("");
  const notice = state.message && state.message !== dismissedMessage ? state : localNotice;
  const upload = async (kind: "shop_image" | "payment_qr_image", file: File | undefined) => {
    if (!file) return;
    const form = new FormData(); form.set("id", dealer.id); form.set("kind", kind); form.set("image", file);
    try { await uploadDealerImage(form); window.location.reload(); }
    catch (error) { setLocalNotice({ ok: false, message: error instanceof Error ? error.message : "Unable to upload image." }); }
  };
  const remove = async (kind: "shop_image" | "payment_qr_image") => {
    if (!window.confirm("Remove this image?")) return;
    const form = new FormData(); form.set("id", dealer.id); form.set("kind", kind);
    try { await removeDealerImage(form); window.location.reload(); }
    catch (error) { setLocalNotice({ ok: false, message: error instanceof Error ? error.message : "Unable to remove image." }); }
  };
  return <>
    {notice.message && <div role={notice.ok ? "status" : "alert"} className={`mb-5 flex items-center justify-between gap-4 border p-3 text-sm ${notice.ok ? "border-[#3f8f5b] text-[#3f8f5b]" : "border-[color:var(--destructive)] text-[color:var(--destructive)]"}`}><span>{notice.message}</span><button type="button" aria-label="Dismiss notification" onClick={() => { setDismissedMessage(notice.message); setLocalNotice(initialState); }} className="text-xl leading-none">×</button></div>}
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={dealer.id} />
      <label>Business name<input required name="business_name" defaultValue={dealer.business_name} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Contact person<input name="contact_person" defaultValue={dealer.contact_person ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Phone<input required name="phone" defaultValue={dealer.phone} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Email<input name="email" type="email" defaultValue={dealer.email ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>State<input required name="state" defaultValue={dealer.state} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>District<input required name="district" defaultValue={dealer.district} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Area<input name="area" defaultValue={dealer.area ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Status<select name="status" defaultValue={dealer.status} className="mt-1 min-h-11 w-full border px-3"><option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
      <label className="sm:col-span-2">Address<input required name="address" defaultValue={dealer.address} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Google Maps URL<input name="google_maps_url" defaultValue={dealer.google_maps_url ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Latitude<input name="latitude" type="number" step="any" defaultValue={dealer.latitude ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label>Longitude<input name="longitude" type="number" step="any" defaultValue={dealer.longitude ?? ""} className="mt-1 min-h-11 w-full border px-3" /></label>
      <label className="flex items-center gap-2 sm:col-span-2"><input type="checkbox" name="is_visible" defaultChecked={dealer.is_visible} /><span>Visible in the public dealer locator</span></label>
      <div className="sm:col-span-2 grid gap-4 border-t pt-5 sm:grid-cols-2">
        <ImageUpload label="Dealer photo" kind="shop_image" src={dealer.shop_image} onUpload={upload} onRemove={remove} />
        <ImageUpload label="Payment QR code" kind="payment_qr_image" src={dealer.payment_qr_image} onUpload={upload} onRemove={remove} />
      </div>
      <Button className="sm:w-fit" disabled={pending}>{pending ? "Saving…" : "Save dealer"}</Button>
    </form>
  </>;
}

function ImageUpload({ label, kind, src, onUpload, onRemove }: { label: string; kind: "shop_image" | "payment_qr_image"; src: string | null; onUpload: (kind: "shop_image" | "payment_qr_image", file: File | undefined) => void; onRemove: (kind: "shop_image" | "payment_qr_image") => void }) {
  return <div className="border p-4"><p className="font-medium">{label}</p>{src && <Image src={src} alt={label} width={160} height={120} className="mt-3 max-h-32 w-auto object-contain" />}<div className="mt-3 flex flex-wrap gap-3"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => onUpload(kind, event.target.files?.[0])} className="max-w-full text-sm" />{src && <button type="button" onClick={() => onRemove(kind)} className="text-sm underline">Remove</button>}</div></div>;
}
