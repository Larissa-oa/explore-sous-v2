import Image from "next/image";
import { Heart } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { VendorSpotlightRow } from "@/types/home";
import { cn } from "@/lib/utils";

const FAVORITE_BUTTON = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-ds-8 text-muted-foreground",
  "transition-[color,background-color] hover:bg-interactive-hover hover:text-foreground",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

const THUMB = "relative size-[4.5rem] shrink-0 overflow-hidden rounded-ds-8 bg-muted";

const ROW_META = "text-xs text-muted-foreground";

const CUISINE_DOT = "size-1 shrink-0 rounded-full bg-current";

export function VendorSpotlightRowItem({
  row,
  favoriteLabel,
}: {
  row: VendorSpotlightRow;
  favoriteLabel: string;
}) {
  return (
    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <Link
        href={`/vendors/${row.slug}`}
        className="flex min-w-0 flex-1 gap-3 rounded-ds-8 py-0.5 pr-1 transition-[color,background-color] hover:bg-interactive-hover/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <div className={THUMB}>
          {row.imageUrl ? (
            <Image src={row.imageUrl} alt="" fill className="object-cover" sizes="72px" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-snug tracking-tight text-foreground">
            {row.name}
          </p>
          {row.cuisineTags.length > 0 ? (
            <div
              className={cn(
                ROW_META,
                "mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5",
              )}
            >
              {row.cuisineTags.map((tag, index) => (
                <span key={tag} className="inline-flex min-w-0 items-center gap-x-1.5">
                  {index > 0 ? <span className={CUISINE_DOT} aria-hidden /> : null}
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <p className={cn(ROW_META, "mt-1 min-w-0 truncate")}>{row.location}</p>
        </div>
      </Link>

      <button type="button" className={FAVORITE_BUTTON} aria-label={favoriteLabel}>
        <Heart className="size-[1.125rem] fill-none stroke-[1.5]" strokeLinecap="round" />
      </button>
    </li>
  );
}
