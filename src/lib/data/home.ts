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

/** Featured partners — all vendors from catalog. */
export function getHomePartners(): PartnerListing[] {
  return homeCatalog.vendors.map(vendorToPartnerListing);
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

/** Three homepage columns × four vendors — layout from {@link homeCatalog.homepage}. */
export function getHomeVendorSpotlightBlocks(): VendorSpotlightBlock[] {
  const vendors = homeCatalog.vendors;
  if (vendors.length === 0) return [];

  const { locations, blocks } = homeCatalog.homepage.vendorSpotlight;

  return blocks.map(({ blockKey, vendorOffset }) => ({
    blockKey,
    rows: Array.from({ length: 4 }, (_, rowIndex) => {
      const v = vendors[(vendorOffset + rowIndex) % vendors.length];
      const loc = locations[(vendorOffset + rowIndex) % locations.length] ?? "";
      return {
        id: `${blockKey}-${v.id}-${rowIndex}`,
        slug: v.slug,
        name: v.name,
        imageUrl: v.images[0] ?? "",
        location: loc,
        cuisineTags: v.cuisineTags,
      };
    }),
  }));
}
