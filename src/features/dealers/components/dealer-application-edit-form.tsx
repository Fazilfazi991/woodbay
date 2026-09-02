import { Button } from "@/components/ui/button";
import { updateDealerApplication } from "@/features/dealers/admin";
import { dealerBusinessTypes, dealerProductInterests } from "@/features/dealers/validation/dealer";

type Application = {
  id: string; business_name: string; contact_person: string; phone: string; whatsapp: string | null; email: string | null;
  state: string; district: string; location: string; address: string | null; business_type: string | null;
  years_in_business: number | null; has_showroom: boolean | null; areas_served: string | null; product_interests: string[] | null; message: string | null;
};

export function DealerApplicationEditForm({ application }: { application: Application }) {
  const field = "mt-1 min-h-11 w-full border px-3";
  return (
    <form action={updateDealerApplication} className="mt-5 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={application.id} />
      <label>Business name<input required name="business_name" defaultValue={application.business_name} className={field} /></label>
      <label>Applicant<input required name="contact_person" defaultValue={application.contact_person} className={field} /></label>
      <label>Phone<input required name="phone" defaultValue={application.phone} className={field} /></label>
      <label>WhatsApp<input name="whatsapp" defaultValue={application.whatsapp ?? ""} className={field} /></label>
      <label>Email<input name="email" type="email" defaultValue={application.email ?? ""} className={field} /></label>
      <label>Business type<select name="business_type" defaultValue={application.business_type ?? ""} className={field}><option value="">Not supplied</option>{dealerBusinessTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label>Years in business<input name="years_in_business" type="number" min="0" max="150" defaultValue={application.years_in_business ?? ""} className={field} /></label>
      <label>Existing showroom<select name="has_showroom" defaultValue={application.has_showroom ? "yes" : "no"} className={field}><option value="yes">Yes</option><option value="no">No</option></select></label>
      <label>State<input required name="state" defaultValue={application.state} className={field} /></label>
      <label>District<input required name="district" defaultValue={application.district} className={field} /></label>
      <label>City / town<input required name="location" defaultValue={application.location} className={field} /></label>
      <label>Areas served<input name="areas_served" defaultValue={application.areas_served ?? ""} className={field} /></label>
      <label className="sm:col-span-2">Address<input name="address" defaultValue={application.address ?? ""} className={field} /></label>
      <fieldset className="grid gap-2 sm:col-span-2"><legend>Product interests</legend><div className="grid gap-2 sm:grid-cols-2">{dealerProductInterests.map((interest) => <label key={interest} className="flex items-center gap-2 border p-3"><input type="checkbox" name="product_interests" value={interest} defaultChecked={application.product_interests?.includes(interest)} />{interest}</label>)}</div></fieldset>
      <label className="sm:col-span-2">Message<textarea name="message" defaultValue={application.message ?? ""} rows={4} className="mt-1 w-full border p-3" /></label>
      <Button className="sm:w-fit">Save application</Button>
    </form>
  );
}
