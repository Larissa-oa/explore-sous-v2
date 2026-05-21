import { pageShellContentClass } from "@/lib/site-layout";

export default function DiscoverLoading() {
  return (
    <div className={pageShellContentClass}>
      <div className="animate-pulse py-8">
        {/* Filter bar skeleton */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-9 w-28 rounded-ds-full bg-muted" />
          ))}
        </div>
        <div className="h-px w-full bg-border" />

        {/* Results grid skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-ds-12 border border-border p-4">
              <div className="h-44 w-full rounded-ds-8 bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
