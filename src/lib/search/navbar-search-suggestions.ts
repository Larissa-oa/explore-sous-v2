import type { SearchSuggestVendor } from "@/types/search";
import { rankVendorTextMatch, vendorMatchesTextQuery } from "@/lib/search/vendor-text-match";

export interface NavbarSearchSuggestion {
  slug: string;
  name: string;
  subtitle: string;
}

const SUGGESTION_LIMIT = 8;

export function buildNavbarSearchSuggestions(
  vendors: SearchSuggestVendor[],
  rawQuery: string,
): NavbarSearchSuggestion[] {
  const trimmed = rawQuery.trim();
  if (trimmed.length === 0) return [];

  return vendors
    .filter((v) => vendorMatchesTextQuery(v, trimmed))
    .sort((a, b) => rankVendorTextMatch(a, trimmed) - rankVendorTextMatch(b, trimmed))
    .slice(0, SUGGESTION_LIMIT)
    .map((v) => ({
      slug: v.slug,
      name: v.name,
      subtitle: v.cuisineTags.slice(0, 2).join(" · ") || v.tags[0] || "",
    }));
}
