"use client";

import { deleteDealerApplication } from "@/features/dealers/admin";

export function DealerDeleteAction({ id }: { id: string }) {
  return <form action={deleteDealerApplication} onSubmit={(event) => { if (!window.confirm("Are you sure you want to delete this dealer application? Approved dealers are archived instead.")) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button type="submit" className="text-sm text-[color:var(--destructive)] underline">Delete</button></form>;
}
