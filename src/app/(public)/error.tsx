"use client";

import { useEffect } from "react";

export default function PublicError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Public route rendering failed", error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center bg-[color:var(--background-deep)] px-6 text-center text-[color:var(--foreground-light)]">
      <div className="max-w-lg">
        <p className="text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
          Woodbay
        </p>
        <h1 className="font-display mt-4 text-5xl">Something did not load.</h1>
        <p className="mt-5 text-sm leading-7 text-[color:var(--muted)]">
          Please try again. If the problem continues, contact Woodbay directly.
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-8 min-h-11 border border-[color:var(--gold)] px-5 text-xs font-bold tracking-[.12em] uppercase"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
