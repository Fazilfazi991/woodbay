import { Button } from "@/components/ui/button";
import { createDealerFromApplication, reviewDealerApplication } from "@/features/dealers/admin";

const statuses = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["qualified", "Qualified"],
  ["approved", "Approved"],
  ["rejected", "Rejected"],
] as const;

export function DealerReviewActions({ id, status, dealerId }: { id: string; status: string; dealerId?: string | null }) {
  return (
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <form action={reviewDealerApplication} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={id} />
        <label className="grid gap-1 text-sm font-medium">
          Application status
          <select key={status} name="status" defaultValue={status} className="min-h-11 border px-3">
            {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <Button type="submit">Update status</Button>
      </form>
      {status === "approved" && !dealerId && (
        <form action={createDealerFromApplication}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="light">Create Dealer from Application</Button>
        </form>
      )}
    </div>
  );
}
