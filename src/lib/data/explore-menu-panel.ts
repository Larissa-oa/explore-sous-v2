import type { ExploreMenuListingSerialized, ExploreMenuPanelData } from "@/types/explore-menu";
import type { VendorPromoBadge } from "@/types/catalog";

import { getTrendingRailVendors } from "./home";
import { getHomeCategoryCardItems } from "./search-categories";

const TRENDING_RAIL_MAX = 4;

/** Badges shown on the Explore “trending” strip (subset of {@link VendorPromoBadge}). */
const EXPLORE_TRENDING_PROMO_BADGES = ["trendingNow", "newOnSous"] as const satisfies readonly VendorPromoBadge[];

function teaserForVendor(v: {
  trendingTeaser?: string;
  cuisineTags: string[];
}): string {
  const t = v.trendingTeaser?.trim();
  if (t) return t;
  return v.cuisineTags.slice(0, 2).join(" · ");
}

/** Serialized Explore mega + mobile panels (category tiles + “Trending now” vendors). */
export function getExploreMenuPanelData(): ExploreMenuPanelData {
  const categories = getHomeCategoryCardItems().map((c) => ({
    id: c.id,
    imageSrc: c.image.src,
  }));
  const allowed = new Set<string>(EXPLORE_TRENDING_PROMO_BADGES);
  const menus: ExploreMenuListingSerialized[] = getTrendingRailVendors(TRENDING_RAIL_MAX)
    .filter((v) => allowed.has(v.promoBadge))
    .map((v) => ({
      id: v.id,
      title: v.name,
      subtitle: teaserForVendor(v),
      imageUrl: v.images[0],
      href: `/vendors/${v.slug}`,
      promoBadge: v.promoBadge,
    }));
  return { categories, menus };
}
