import { isoDateMatchesWeekdays } from "@/lib/dates";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import { asSearchCategoryId } from "@/lib/discovery/discovery-query";
import { vendorMatchesTextQuery } from "@/lib/search/vendor-text-match";
import type { CatalogProduct, CatalogVendor, VendorCuisineTag, VendorExperienceTag } from "@/types/catalog";
import type { DiscoveryCategoryId, SearchCategoryId } from "@/types/search";

function productMatchesDiscovery(
  product: CatalogProduct,
  category: SearchCategoryId,
  dateIso: string | null,
): boolean {
  if (category === "reservations") {
    return product.category === "reservation" && product.reservationEnabled;
  }
  if (product.category !== category) return false;
  if (category === "delivery" && !product.deliveryEnabled) return false;
  if (category === "pickup" && !product.pickupEnabled) return false;
  if (dateIso == null) return true;
  return isoDateMatchesWeekdays(dateIso, product.availableDays);
}

export function vendorSupportsCategory(
  vendor: CatalogVendor,
  category: SearchCategoryId,
): boolean {
  if (category === "delivery") return vendor.supportsDelivery;
  if (category === "pickup") return vendor.supportsPickup;
  return vendor.supportsReservations;
}

export function vendorHasProductForDiscovery(
  vendorId: string,
  category: SearchCategoryId,
  dateIso: string | null,
  products: CatalogProduct[],
): boolean {
  return products.some(
    (p) => p.vendorId === vendorId && productMatchesDiscovery(p, category, dateIso),
  );
}

const CHANNEL_CATEGORIES: readonly SearchCategoryId[] = ["delivery", "pickup", "reservations"];

export function vendorMatchesDiscoveryCategory(
  vendor: CatalogVendor,
  category: DiscoveryCategoryId,
  dateIso: string | null,
  products: CatalogProduct[],
): boolean {
  if (category === "all") {
    return CHANNEL_CATEGORIES.some(
      (cat) =>
        vendorSupportsCategory(vendor, cat) &&
        vendorHasProductForDiscovery(vendor.id, cat, null, products),
    );
  }
  const cat = asSearchCategoryId(category);
  if (cat == null) return false;
  if (!vendorSupportsCategory(vendor, cat)) return false;
  return vendorHasProductForDiscovery(vendor.id, cat, dateIso, products);
}

export function vendorPassesExtraFilters(
  vendor: CatalogVendor,
  q: DiscoverySearchState,
): boolean {
  const text = q.q?.trim() ?? "";
  if (text.length > 0 && !vendorMatchesTextQuery(vendor, text)) return false;

  if (q.cuisines.length > 0 && !q.cuisines.some((c) => vendor.cuisineTags.includes(c as VendorCuisineTag))) {
    return false;
  }
  if (q.tags.length > 0 && !q.tags.some((t) => vendor.tags.includes(t as VendorExperienceTag))) {
    return false;
  }
  if (q.prices.length > 0 && !q.prices.includes(vendor.price)) return false;
  if (q.promos.includes("trendingNow") && vendor.trendingRailOrder == null) return false;
  if (q.promos.includes("newOnSous") && vendor.promoBadge !== "newOnSous") return false;
  return true;
}
