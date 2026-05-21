import type { VendorPriceLevel } from "@/types/catalog";

/** Discovery list + map rows (shared client/server shape). */
export interface DiscoveryVendorRow {
  slug: string;
  name: string;
  addressLine: string;
  imageUrl: string;
  distanceKm: number;
  lat: number;
  lng: number;
  /** 1–4 for €…€€€€ display (map popup, list metadata). */
  priceLevel: VendorPriceLevel;
  cuisines: string[];
  tags: string[];
}

export interface DiscoveryFilterMeta {
  cuisines: string[];
  tags: string[];
}

/** Map center + radius from server geocoding (not stored in URL). */
export interface DiscoverySearchGeo {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}
