"use client";

import { useEffect } from "react";
import ErrorState from "@/components/shared/ErrorState";

// Next.js App Router error boundary: catches an unexpected render/runtime
// crash anywhere under this route tree and shows the shared ErrorState
// instead of the framework's default error screen. Every domain still
// resolves a missing id to null rather than throwing (see EmptyState) -
// this exists for the genuinely-unexpected case, not as a substitute for
// that convention.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <ErrorState onRetry={reset} />
    </main>
  );
}
