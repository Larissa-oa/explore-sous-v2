import type { VendorSpotlightBlockKey } from "@/types/home";

export type ProductCategory = "pickup" | "delivery" | "reservation";

/** Weekday keys for chef delivery/pickup schedules (`su` … `sa`), aligned with the calendar picker. */
export type CatalogWeekday = "su" | "mo" | "tu" | "we" | "th" | "fr" | "sa";

/** Closed cuisine list for mock / catalog vendors (max 10). */
export type VendorCuisineTag =
  | "Dutch"
  | "French"
  | "Mediterranean"
  | "Asian"
  | "Fusion"
  | "Italian"
  | "Latin American"
  | "Middle Eastern"
  | "Seafood"
  | "European";

/** Closed experience / positioning tags for mock / catalog vendors (max 10). */
export type VendorExperienceTag =
  | "Fine Dining"
  | "Shared Dining"
  | "Luxury"
  | "Casual"
  | "Romantic"
  | "Family Friendly"
  | "Chef Special"
  | "Wine Pairing"
  | "Street Food"
  | "Tasting Menu";

/** Promo ribbon keys for mock / catalog vendors (max 10). */
export type VendorPromoBadge =
  | "trendingNow"
  | "newOnSous"
  | "editorsPick"
  | "seasonalHighlight"
  | "limitedTime"
  | "guestFavorite"
  | "staffPick"
  | "topRated"
  | "dateNight"
  | "chefSpotlight";

/** Canonical closed lists documented in `home-catalog.json` (`vendorFieldOptions`). */
export interface HomeCatalogVendorFieldOptions {
  cuisineTags: readonly VendorCuisineTag[];
  tags: readonly VendorExperienceTag[];
  promoBadge: readonly VendorPromoBadge[];
}

/** Canonical closed lists documented in `home-catalog.json` (`productFieldOptions`). */
export interface HomeCatalogProductFieldOptions {
  availableDays: readonly CatalogWeekday[];
  category: readonly ProductCategory[];
}

/** Vendor price indicator on a 1–4 scale (e.g. €–€€€€), not a monetary amount. */
export type VendorPriceLevel = 1 | 2 | 3 | 4;

export interface MoneyAmount {
  amount: number;
}

export interface CatalogVendor {
  id: string;
  name: string;
  slug: string;
  /** Official or primary site for the vendor. */
  websiteUrl: string;
  /** SOUS collection URL for this vendor (mock data always sets this to `/en/collections/{slug}`). */
  sousCollectionUrl: string;
  /** 1 (lowest) through 4 (highest) price tier for the vendor overall. */
  price: VendorPriceLevel;
  supportsReservations: boolean;
  supportsPickup: boolean;
  supportsDelivery: boolean;
  cuisineTags: VendorCuisineTag[];
  tags: VendorExperienceTag[];
  /**
   * Homepage + explore “Trending now” strip (max four). Lower numbers appear first.
   * `null` when this vendor is not in that strip.
   */
  trendingRailOrder: 1 | 2 | 3 | 4 | null;
  /** Small label line above the vendor name in trending rows / menu cards. */
  promoBadge: VendorPromoBadge;
  /** Short supporting line under the name in explore / mega / mobile trending lists. */
  trendingTeaser: string;
  /** Vendor about / marketing copy (plain text); vendor detail page and API parity. */
  description: string;
  /** Hero strip + lightbox mosaic order; matches backend vendor gallery when wired. */
  images: string[];
}

export interface CatalogProduct {
  id: string;
  vendorId: string;
  category: ProductCategory;
  name: string;
  description: string;
  pricePerPerson: MoneyAmount;
  currency: string;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  reservationEnabled: boolean;
  /** Length of a reservation experience; `null` when not applicable (pickup/delivery only). */
  durationMinutes: number | null;
  /**
   * Days of the week when pickup/delivery is offered (backend parity).
   * Empty for reservations — discover treats them as always available; booking dates live on the vendor site.
   */
  availableDays: CatalogWeekday[];
  images: string[];
}

/** Homepage-only layout driven by the same mock payload the API will replace later. */
export interface HomeCatalogHomepage {
  vendorSpotlight: {
    /** Display strings cycled for spotlight rows (e.g. neighborhood labels). */
    locations: string[];
    /** Column definitions: which message block key and where to start in the vendor list. */
    blocks: ReadonlyArray<{
      blockKey: VendorSpotlightBlockKey;
      vendorOffset: number;
    }>;
  };
}

export interface HomeCatalog {
  /**
   * Mock catalog only: allowed values for `cuisineTags`, `tags`, and `promoBadge`
   * on each {@link CatalogVendor}. Omitted when the payload comes from the API.
   */
  vendorFieldOptions?: HomeCatalogVendorFieldOptions;
  productFieldOptions?: HomeCatalogProductFieldOptions;
  vendors: CatalogVendor[];
  products: CatalogProduct[];
  homepage: HomeCatalogHomepage;
}
