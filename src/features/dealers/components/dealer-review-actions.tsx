"use client";

import { Button } from "@/components/ui/button";
import { reviewDealerApplication } from "@/features/dealers/admin";

export function DealerReviewActions({ id, status }: { id: string; status: string }) {
  return <div className="mt-6 flex flex-wrap gap-3">
    {status !== "approved" && status !== "rejected" && <><form action={reviewDealerApplication}><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value="approved" /><Button>Approve application</Button></form><form action={reviewDealerApplication} onSubmit={(event) => { if (!window.confirm("Reject this dealer application? It will remain in the application history.")) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value="rejected" /><Button type="submit" variant="light">Reject application</Button></form></>}
  </div>;
}
