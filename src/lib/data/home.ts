import homeCatalogJson from "@/lib/data/mock/home-catalog.json";
import type { CatalogVendor, HomeCatalog } from "@/types/catalog";
import type { PartnerListing, VendorSpotlightBlock } from "@/types/home";

// Trust cast: safe for mock JSON because the file is authored by us and matches HomeCatalog exactly.
// When switching to a real API, replace this with a Zod schema parse so malformed responses
// surface as clear errors instead of silent runtime failures.
// Example: import { HomeCatalogSchema } from "@/lib/schemas/catalog"; HomeCatalogSchema.parse(apiData)
const homeCatalog = homeCatalogJson as HomeCatalog;

export function getHomeCatalog(): HomeCatalog {
  return homeCatalog;
}

const TRENDING_RAIL_MAX = 4;

/** Vendors flagged with `trendingRailOrder` in catalog (explore menus). */
export function getTrendingRailVendors(limit = TRENDING_RAIL_MAX): CatalogVendor[] {
  return homeCatalog.vendors
    .filter(
      (v): v is CatalogVendor & { trendingRailOrder: 1 | 2 | 3 | 4 } =>
        v.trendingRailOrder != null &&
        v.trendingRailOrder >= 1 &&
        v.trendingRailOrder <= TRENDING_RAIL_MAX,
    )
    .sort((a, b) => a.trendingRailOrder - b.trendingRailOrder)
    .slice(0, limit);
}

/** Maps catalog vendor → listing card / navbar featured rail shape. */
export function vendorToPartnerListing(v: CatalogVendor): PartnerListing {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    imageUrl: v.images[0],
    hoverImageUrl: v.images[1],
    price: v.price,
  };
}

export type HomeVendorOfferKind = "delivery" | "pickup" | "reservation";

/**
 * Vendors that support a given offer type. The same vendor can appear in several rails
 * when multiple `supports*` flags are true.
 */
export function getHomeVendorsByOffer(offer: HomeVendorOfferKind): PartnerListing[] {
  const predicate =
    offer === "delivery"
      ? (v: CatalogVendor) => v.supportsDelivery
      : offer === "pickup"
        ? (v: CatalogVendor) => v.supportsPickup
        : (v: CatalogVendor) => v.supportsReservations;

  return homeCatalog.vendors.filter(predicate).map(vendorToPartnerListing);
}

const SPOTLIGHT_ROWS_PER_BLOCK = 4;

/** Three homepage columns × four vendors — layout from {@link homeCatalog.homepage}. */
export function getHomeVendorSpotlightBlocks(): VendorSpotlightBlock[] {
  const { vendors, homepage } = homeCatalog;
  if (vendors.length === 0) return [];

  const { locations, blocks } = homepage.vendorSpotlight;

  return blocks.map(({ blockKey, vendorOffset }) => ({
    blockKey,
    rows: Array.from({ length: SPOTLIGHT_ROWS_PER_BLOCK }, (_, rowIndex) => {
      const slot = vendorOffset + rowIndex;
      const vendor = vendors[slot % vendors.length];
      return {
        id: `${blockKey}-${vendor.id}-${rowIndex}`,
        slug: vendor.slug,
        name: vendor.name,
        imageUrl: vendor.images[0] ?? "",
        location: locations[slot % locations.length] ?? "",
        cuisineTags: vendor.cuisineTags,
      };
    }),
  }));
}
