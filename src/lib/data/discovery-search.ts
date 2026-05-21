import "server-only";

import {
  getDiscoveryFilterMeta,
  getDiscoveryVendorRows,
  resolveDiscoverySearchGeo,
} from "@/lib/data/discovery";
import { getHomeCatalog } from "@/lib/data/home";
import { getNavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import { parseDiscoverySearchParams } from "@/lib/discovery/discovery-query";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import type { CatalogVendor } from "@/types/catalog";
import type { DiscoveryFilterMeta, DiscoverySearchGeo, DiscoveryVendorRow } from "@/types/discovery";
import type { SearchSuggestVendor } from "@/types/search";

// —— Discovery page load (server) —————————————————————————————————————————————

export type DiscoveryPageLoadIssue = "bad_params";

export type DiscoveryPageLoadResult =
  | {
      ok: true;
      query: DiscoverySearchState;
      searchGeo: DiscoverySearchGeo;
      rows: DiscoveryVendorRow[];
      filterMeta: DiscoveryFilterMeta;
    }
  | { ok: false; issue: DiscoveryPageLoadIssue };

// —— Data source (mock today → API later) ————————————————————————————————————

export interface DiscoverySearchSource {
  loadDiscoveryPage(
    searchParams: Record<string, string | string[] | undefined>,
  ): Promise<DiscoveryPageLoadResult>;
  getNavbarSearchPanelData(): NavbarSearchPanelData;
  getSuggestVendors(): SearchSuggestVendor[];
}

function vendorToSuggestVendor(v: CatalogVendor): SearchSuggestVendor {
  return {
    slug: v.slug,
    name: v.name,
    cuisineTags: [...v.cuisineTags],
    tags: [...v.tags],
  };
}

const mockDiscoverySearchSource: DiscoverySearchSource = {
  async loadDiscoveryPage(searchParams) {
    const query = parseDiscoverySearchParams(searchParams);
    if (query == null) {
      return { ok: false, issue: "bad_params" };
    }
    const searchGeo = await resolveDiscoverySearchGeo({
      location: query.location,
      placeId: query.placeId,
    });
    return {
      ok: true,
      query,
      searchGeo,
      rows: getDiscoveryVendorRows(query, searchGeo),
      filterMeta: getDiscoveryFilterMeta(),
    };
  },

  getNavbarSearchPanelData,

  getSuggestVendors() {
    return getHomeCatalog().vendors.map(vendorToSuggestVendor);
  },
};

/** Active discovery + navbar search data source. Replace implementation when API is ready. */
export function getDiscoverySearchSource(): DiscoverySearchSource {
  return mockDiscoverySearchSource;
}
