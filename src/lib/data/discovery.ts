import "server-only";

import { getHomeCatalog } from "@/lib/data/home";
import { buildVendorPageDetail } from "@/lib/data/vendor-page";
import { hasDiscoveryLocation } from "@/lib/discovery/discovery-query";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import {
  resolveDiscoverySearchGeo,
} from "@/lib/discovery/mock-search-center";
import {
  vendorMatchesDiscoveryCategory,
  vendorPassesExtraFilters,
} from "@/lib/discovery/discovery-vendor-eligibility";
import type { DiscoveryFilterMeta, DiscoverySearchGeo, DiscoveryVendorRow } from "@/types/discovery";

export type { DiscoveryPromoId, DiscoverySearchState } from "@/lib/discovery/discovery-query";
export {
  discoveryHref,
  mergeDiscoveryQuery,
  serializeDiscoverySearchParams,
} from "@/lib/discovery/discovery-query";
export type { DiscoveryFilterMeta, DiscoverySearchGeo, DiscoveryVendorRow } from "@/types/discovery";
export { resolveDiscoverySearchGeo } from "@/lib/discovery/mock-search-center";

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.sqrt(Math.min(1, x)));
}

export function getDiscoveryFilterMeta(): DiscoveryFilterMeta {
  const { vendors } = getHomeCatalog();
  const cuisineSet = new Set<string>();
  const tagSet = new Set<string>();
  for (const v of vendors) {
    for (const c of v.cuisineTags) cuisineSet.add(c);
    for (const t of v.tags) tagSet.add(t);
  }
  return {
    cuisines: [...cuisineSet].sort((a, b) => a.localeCompare(b)),
    tags: [...tagSet].sort((a, b) => a.localeCompare(b)),
  };
}

export function getDiscoveryVendorRows(
  q: DiscoverySearchState,
  geo: DiscoverySearchGeo,
): DiscoveryVendorRow[] {
  const { vendors, products } = getHomeCatalog();
  const center = { lat: geo.centerLat, lng: geo.centerLng };
  const filterByRadius = hasDiscoveryLocation(q);

  const rows: DiscoveryVendorRow[] = [];

  for (const vendor of vendors) {
    if (!vendorMatchesDiscoveryCategory(vendor, q.category, q.dateIso, products)) continue;
    if (!vendorPassesExtraFilters(vendor, q)) continue;

    const detail = buildVendorPageDetail(vendor);
    const distanceKm = haversineKm(center, { lat: detail.lat, lng: detail.lng });
    if (filterByRadius && distanceKm > geo.radiusKm) continue;

    rows.push({
      slug: detail.slug,
      name: detail.name,
      addressLine: detail.addressLine,
      imageUrl: detail.images[0] ?? "",
      distanceKm,
      lat: detail.lat,
      lng: detail.lng,
      priceLevel: detail.price,
      cuisines: [...detail.cuisineTags],
      tags: [...detail.tags],
    });
  }

  rows.sort((a, b) => a.distanceKm - b.distanceKm);
  return rows;
}
