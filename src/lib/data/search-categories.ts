import type { StaticImageData } from "next/image";

import type { SearchCategoryId } from "@/types/search";

import meta from "./mock/search-categories.json";

import deliveryImg from "@/assets/categories/DELIVERY.jpg";
import reservationsImg from "@/assets/categories/RESERVATIONS.jpg";
import pickupImg from "@/assets/categories/PICKUP.jpg";

/** Resolved imports — filenames must match `categoryCardAssets` in `mock/search-categories.json`. */
const CARD_IMAGE_BY_FILE = {
  "DELIVERY.jpg": deliveryImg,
  "RESERVATIONS.jpg": reservationsImg,
  "PICKUP.jpg": pickupImg,
} as const satisfies Record<string, StaticImageData>;

type CardAssetFile = keyof typeof CARD_IMAGE_BY_FILE;

/** Ordered homepage search category ids — source of truth is `mock/search-categories.json`. */
export function getSearchCategoryIds(): readonly SearchCategoryId[] {
  return meta.ids as SearchCategoryId[];
}

/** Homepage category tiles — ids + asset filenames from mock; images resolved here for bundling. */
export function getHomeCategoryCardItems(): readonly {
  id: SearchCategoryId;
  image: StaticImageData;
}[] {
  const assets = meta.categoryCardAssets as Record<SearchCategoryId, CardAssetFile>;
  return getSearchCategoryIds().map((id) => {
    const file = assets[id];
    const image = CARD_IMAGE_BY_FILE[file];
    if (!image) {
      throw new Error(`Missing category card image for "${id}" (file: ${String(file)})`);
    }
    return { id, image };
  });
}
