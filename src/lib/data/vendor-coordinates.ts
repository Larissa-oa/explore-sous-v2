/**
 * Stable lat/lng for catalog vendors (overrides + deterministic fallback).
 * Used by vendor detail pages and discovery distance filtering.
 */

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function coordsForSlug(slug: string): { lat: number; lng: number } {
  const baseLat = 52.09;
  const baseLng = 5.12;
  const h = hashString(slug);
  const lat = baseLat + ((h % 1000) / 100000) * (h % 2 === 0 ? 1 : -1);
  const lng = baseLng + (((h / 1000) % 1000) / 100000) * (h % 3 === 0 ? 1 : -1);
  return { lat, lng };
}

/** Curated coordinates — keep aligned with marketing copy in `vendor-page.ts`. */
const LAT_LNG_BY_SLUG: Partial<Record<string, { lat: number; lng: number }>> = {
  "ron-gastrobar": { lat: 52.3527, lng: 4.8688 },
  "neni-amsterdam": { lat: 52.3439, lng: 4.8564 },
};

export function getVendorLatLng(slug: string): { lat: number; lng: number } {
  const override = LAT_LNG_BY_SLUG[slug];
  if (override) return override;
  return coordsForSlug(slug);
}
