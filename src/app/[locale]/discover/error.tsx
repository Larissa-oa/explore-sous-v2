"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { pageShellContentClass } from "@/lib/site-layout";

export default function DiscoverError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DiscoverPage]", error);
  }, [error]);

  return (
    <div className={pageShellContentClass}>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="type-h4-sb text-foreground">Something went wrong</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load the discovery page. Please try again.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-ds-10 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-ds-10 border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
