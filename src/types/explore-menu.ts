import type { SearchCategoryId } from "@/types/search";
import type { VendorPromoBadge } from "@/types/catalog";

export type ExplorePromoBadge = VendorPromoBadge;

export type ExploreMenuCategorySerialized = {
  id: SearchCategoryId;
  imageSrc: string;
};

export type ExploreMenuListingSerialized = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  href: string;
  promoBadge?: ExplorePromoBadge;
  /** Pre-translated badge line for accessibility and consistent copy. */
  badgeLabel?: string;
};

export type ExploreMenuPanelData = {
  categories: ExploreMenuCategorySerialized[];
  menus: ExploreMenuListingSerialized[];
};
