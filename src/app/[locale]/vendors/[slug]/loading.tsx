import { pageShellContentClass } from "@/lib/site-layout";

export default function VendorLoading() {
  return (
    <div className={pageShellContentClass}>
      <div className="animate-pulse py-8">
        {/* Hero image skeleton */}
        <div className="h-64 w-full rounded-ds-12 bg-muted md:h-96" />

        {/* Vendor info skeleton */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-8 w-72 rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded-ds-full bg-muted" />
            <div className="h-5 w-20 rounded-ds-full bg-muted" />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
