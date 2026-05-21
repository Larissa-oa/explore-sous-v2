/** Homepage search category values — keep in sync with `src/lib/data/mock/search-categories.json` (`ids` + `categoryCardAssets`). */
export type SearchCategoryId = "delivery" | "reservations" | "pickup";

/** Discovery filter category — includes cross-channel text search. */
export type DiscoveryCategoryId = SearchCategoryId | "all";

/** Slim vendor fields for navbar typeahead (client bundle). */
export interface SearchSuggestVendor {
  slug: string;
  name: string;
  cuisineTags: string[];
  tags: string[];
}
