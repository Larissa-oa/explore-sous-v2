import "server-only";

import popularMeta from "@/lib/data/mock/popular-searches.json";
import { getTrendingRailVendors, vendorToPartnerListing } from "@/lib/data/home";
import {
  discoveryHref,
  type DiscoveryPromoId,
  type DiscoverySearchState,
} from "@/lib/discovery/discovery-query";

const FEATURED_VENDOR_LIMIT = 4;

export interface PopularSearchItem {
  id: string;
  href: string;
}

export interface NavbarSearchPanelData {
  popularSearches: PopularSearchItem[];
  featuredVendors: ReturnType<typeof vendorToPartnerListing>[];
}

type PopularSearchPatch = Partial<
  Pick<DiscoverySearchState, "cuisines" | "tags" | "promos">
>;

function hrefForPopularPatch(patch: PopularSearchPatch): string {
  return discoveryHref({
    category: "all",
    q: null,
    dateIso: null,
    location: null,
    placeId: null,
    cuisines: patch.cuisines ?? [],
    tags: patch.tags ?? [],
    prices: [],
    promos: (patch.promos ?? []) as DiscoveryPromoId[],
  });
}

/** Serialized navbar search panel (popular chips + featured vendor rail). */
export function getNavbarSearchPanelData(): NavbarSearchPanelData {
  const items = popularMeta.items as { id: string; patch: PopularSearchPatch }[];

  return {
    popularSearches: items.map((item) => ({
      id: item.id,
      href: hrefForPopularPatch(item.patch),
    })),
    featuredVendors: getTrendingRailVendors(FEATURED_VENDOR_LIMIT).map(vendorToPartnerListing),
  };
}
