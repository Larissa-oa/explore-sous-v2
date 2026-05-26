import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SiteTopBarProps {
  label: string;
  href: string;
  className?: string;
}

/** Compact primary promo strip above the main navbar. */
export function SiteTopBar({ label, href, className }: SiteTopBarProps) {
  return (
    <div
      className={cn(
        "flex h-[var(--site-top-bar-height)] w-full shrink-0 items-center justify-center bg-primary px-4",
        className,
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        {label}
        <ArrowUpRight className="size-4 shrink-0" aria-hidden />
      </a>
    </div>
  );
}
