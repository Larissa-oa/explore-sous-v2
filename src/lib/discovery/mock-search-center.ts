/**
 * Mock server geocoding (PDOK) until the discovery API resolves location / placeId.
 */

import "server-only";

import { DISCOVERY_DEFAULT_CENTER } from "@/lib/discovery/default-center";
import type { DiscoverySearchGeo } from "@/types/discovery";

const DISCOVERY_MAX_RADIUS_KM = 15;
const NL_POSTCODE_RE = /\b(\d{4})\s*([A-Za-z]{2})\b/i;

const CITY_CENTERS: ReadonlyArray<{ keys: readonly string[]; lat: number; lng: number }> = [
  { keys: ["amsterdam"], lat: 52.3676, lng: 4.9041 },
  { keys: ["rotterdam"], lat: 51.9244, lng: 4.4777 },
  { keys: ["utrecht"], lat: 52.0907, lng: 5.1214 },
  { keys: ["the hague", "den haag", "'s-gravenhage", "s-gravenhage"], lat: 52.0705, lng: 4.3007 },
  { keys: ["eindhoven"], lat: 51.4416, lng: 5.4697 },
  { keys: ["groningen"], lat: 53.2194, lng: 6.5665 },
  { keys: ["maastricht"], lat: 50.8514, lng: 5.69097 },
];

function formatNlPostcode(raw: string): string {
  const compact = raw.replace(/\s/g, "").toUpperCase();
  if (compact.length === 6) return `${compact.slice(0, 4)} ${compact.slice(4)}`;
  return raw.trim();
}

function parseCentroideLl(wkt: string): { lat: number; lng: number } | null {
  const m = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (!m) return null;
  const lng = Number(m[1]);
  const lat = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

interface PdokDoc {
  centroide_ll?: string;
  postcode?: string;
  woonplaatsnaam?: string;
}

async function pdokSearch(
  q: string,
  fq?: string,
): Promise<PdokDoc | null> {
  const url = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
  url.searchParams.set("q", q);
  url.searchParams.set("rows", "1");
  if (fq) url.searchParams.set("fq", fq);
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = (await res.json()) as { response?: { docs?: PdokDoc[] } };
  return data.response?.docs?.[0] ?? null;
}

async function geocodeNlLabel(label: string): Promise<{ lat: number; lng: number }> {
  const trimmed = label.trim();
  const pcMatch = trimmed.match(NL_POSTCODE_RE);
  if (pcMatch) {
    const doc = await pdokSearch(formatNlPostcode(pcMatch[0]), "type:postcode");
    const center = doc?.centroide_ll ? parseCentroideLl(doc.centroide_ll) : null;
    if (center) return center;
  }

  const doc = await pdokSearch(trimmed, "type:postcode");
  const fromQuery = doc?.centroide_ll ? parseCentroideLl(doc.centroide_ll) : null;
  if (fromQuery) return fromQuery;

  const n = trimmed.toLowerCase();
  for (const row of CITY_CENTERS) {
    for (const k of row.keys) {
      if (n.includes(k)) return { lat: row.lat, lng: row.lng };
    }
  }
  return { ...DISCOVERY_DEFAULT_CENTER };
}

/** Server-only: map address / placeId → center for list filtering and map. */
export async function resolveDiscoverySearchGeo(input: {
  location: string | null;
  placeId: string | null;
}): Promise<DiscoverySearchGeo> {
  const label = input.location?.trim() ?? "";
  const center =
    label.length > 0
      ? await geocodeNlLabel(label)
      : { ...DISCOVERY_DEFAULT_CENTER };
  return {
    centerLat: center.lat,
    centerLng: center.lng,
    radiusKm: DISCOVERY_MAX_RADIUS_KM,
  };
}
