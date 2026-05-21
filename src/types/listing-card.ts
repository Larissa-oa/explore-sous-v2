import type { VendorPriceLevel } from "@/types/catalog";

/** Monetary or localized copy (e.g. formatted “€89,96” — “From” prefix is UI-only on standard cards). */
export type ListingPriceLabel = { kind: "label"; label: string };

/** Price tier as repeated currency symbol (e.g. €€€). */
export type ListingPriceEuroLevel = { kind: "euroLevel"; level: VendorPriceLevel; symbol?: string };

export type ListingPrice = ListingPriceLabel | ListingPriceEuroLevel;

export type ListingCardSurface = "standard" | "card";

/** Product/menu rail vs vendor collection slider (title + price only). */
export type ListingCardMode = "product" | "vendor";
