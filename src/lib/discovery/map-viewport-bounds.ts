export type MapViewportBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

/** Point-in-rectangle test for a Leaflet-style axis-aligned bounds (NL / no antimeridian wrap). */
export function vendorInViewportBounds(
  lat: number,
  lng: number,
  b: MapViewportBounds,
): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east;
}
