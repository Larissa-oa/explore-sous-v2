import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ListingCardMode, ListingCardSurface } from "@/types/listing-card";
import { ListingCardMedia } from "@/components/listing-cards/listing-card-media";
import { ListingCardPrice, type ListingCardPriceInput } from "@/components/listing-cards/listing-card-price";

const defaultSizesCard = "(max-width: 640px) 88vw, (max-width: 1024px) 46vw, 32vw";
const defaultSizesStandard = "(max-width: 640px) 55vw, (max-width: 1024px) 28vw, 22vw";

export interface ListingCardProps {
  surface: ListingCardSurface;
  mode: ListingCardMode;
  title: string;
  /** Shown above the title when `mode` is `"product"`. */
  vendorName?: string;
  price: ListingCardPriceInput | null;
  primaryImageSrc?: string;
  hoverImageSrc?: string;
  /** Defaults to `{title} – {vendorName}` in product mode, else `title`. */
  imageAlt?: string;
  sizes?: string;
  className?: string;
  /** e.g. sold-out callout above the vendor line */
  headerSlot?: ReactNode;
  /** Shown before price on {@link ListingCardSurface} `"standard"` (e.g. “From” / “Vanaf”). */
  priceFromLabel?: string;
  /** When false, omits the hover arrow beside the title (e.g. compact vendor rails). */
  showTitleArrow?: boolean;
}

export function ListingCard({
  surface,
  mode,
  title,
  vendorName,
  price,
  primaryImageSrc,
  hoverImageSrc,
  imageAlt,
  sizes = surface === "standard" ? defaultSizesStandard : defaultSizesCard,
  className,
  headerSlot,
  priceFromLabel,
  showTitleArrow = true,
}: ListingCardProps) {
  const alt =
    imageAlt ??
    (mode === "product" && vendorName ? `${title} – ${vendorName}` : title);

  const mediaRadius =
    surface === "standard" ? "rounded-ds-12" : "rounded-ds-16";

  const body = (
    <>
      <ListingCardMedia
        surface={surface}
        alt={alt}
        primarySrc={primaryImageSrc}
        hoverSrc={hoverImageSrc}
        sizes={sizes}
        className={mediaRadius}
      />
      <div
        data-slot="listing-card-body"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1 text-left",
          surface === "standard" && "w-full gap-0.5 pt-1",
          surface === "card" && "px-4 pb-4 pt-3",
        )}
      >
        {headerSlot}
        {mode === "product" && vendorName ? (
          <p
            className={cn(
              "leading-snug",
              surface === "standard"
                ? "text-muted-foreground text-xs font-semibold"
                : "text-muted-foreground text-sm font-medium",
            )}
          >
            {vendorName}
          </p>
        ) : null}
        <div className="flex min-w-0 items-start gap-0.5">
          <p className="min-w-0 flex-1 text-foreground text-base font-semibold leading-snug line-clamp-2">
            {title}
          </p>
          {showTitleArrow ? (
            <ArrowRight
              className="text-foreground mt-0.5 size-4 shrink-0 opacity-0 transition-opacity duration-200 ease-out group-hover/listing-card:opacity-100"
              aria-hidden
            />
          ) : null}
        </div>
        {price ? (
          <ListingCardPrice
            price={price}
            pricePrefix={surface === "standard" ? priceFromLabel : undefined}
            className="pt-px"
          />
        ) : null}
      </div>
    </>
  );

  if (surface === "card") {
    return (
      <div
        data-slot="listing-card"
        data-surface="card"
        className={cn(
          "group/listing-card flex h-full min-h-0 w-full flex-col overflow-hidden rounded-ds-20 bg-card px-1.5 pb-0.5 pt-1.5 shadow-none",
          className,
        )}
      >
        {body}
      </div>
    );
  }

  return (
    <div
      data-slot="listing-card"
      data-surface="standard"
      className={cn("group/listing-card flex h-full min-h-0 w-full min-w-0 flex-col", className)}
    >
      {body}
    </div>
  );
}
