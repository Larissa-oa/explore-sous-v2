import type { VendorPriceLevel } from "@/types/catalog";
import type { ListingPrice, ListingPriceEuroLevel } from "@/types/listing-card";
import { cn } from "@/lib/utils";

export type ListingCardPriceInput = ListingPrice | VendorPriceLevel;

/** € tier string for listing cards and map popups. */
export function formatEuroPriceTier(level: VendorPriceLevel, symbol = "€"): string {
  return symbol.repeat(level);
}

function toEuroListingPrice(level: VendorPriceLevel, symbol?: string): ListingPriceEuroLevel {
  return symbol ? { kind: "euroLevel", level, symbol } : { kind: "euroLevel", level };
}

function resolveListingPrice(price: ListingCardPriceInput): ListingPrice {
  return typeof price === "number" ? toEuroListingPrice(price) : price;
}

export function ListingCardPrice({
  price,
  className,
  pricePrefix,
  tierAriaLabel,
  inline = false,
}: {
  price: ListingCardPriceInput;
  className?: string;
  /** e.g. translated “From” / “Vanaf” — matches title size/weight on listing cards. */
  pricePrefix?: string;
  /** Overrides default English tier aria-label (e.g. discovery i18n). */
  tierAriaLabel?: string;
  /** Renders a `span` for use inside flex metadata rows (discovery). */
  inline?: boolean;
}) {
  const resolved = resolveListingPrice(price);
  const Tag = inline ? "span" : "p";
  const rowClass = cn(
    "flex flex-wrap items-baseline gap-x-1 text-foreground text-base font-semibold leading-snug",
    resolved.kind === "euroLevel" && "tracking-tight",
    className,
  );

  if (resolved.kind === "label") {
    return (
      <Tag className={rowClass}>
        {pricePrefix ? <span>{pricePrefix}</span> : null}
        <span>{resolved.label}</span>
      </Tag>
    );
  }

  const symbol = resolved.symbol ?? "€";
  const ariaLabel = tierAriaLabel ?? `${resolved.level} of 4 price tier`;

  return (
    <Tag className={rowClass} aria-label={ariaLabel}>
      {pricePrefix ? <span>{pricePrefix}</span> : null}
      <span>{formatEuroPriceTier(resolved.level, symbol)}</span>
    </Tag>
  );
}
