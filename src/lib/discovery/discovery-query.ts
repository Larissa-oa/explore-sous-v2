import { isValidIsoDateString, toIsoDateString } from "@/lib/dates";
import type { DiscoveryCategoryId, SearchCategoryId } from "@/types/search";

export type DiscoveryPromoId = "trendingNow" | "newOnSous";

const SEARCH_CATEGORIES: readonly SearchCategoryId[] = ["delivery", "pickup", "reservations"];
const DISCOVERY_CATEGORIES: readonly DiscoveryCategoryId[] = [...SEARCH_CATEGORIES, "all"];

function isSearchCategoryId(value: string): value is SearchCategoryId {
  return (SEARCH_CATEGORIES as readonly string[]).includes(value);
}

function isDiscoveryCategoryId(value: string): value is DiscoveryCategoryId {
  return (DISCOVERY_CATEGORIES as readonly string[]).includes(value);
}

/** Client + URL search state. Location is address/place only — coords come from the API response. */
export interface DiscoverySearchState {
  category: DiscoveryCategoryId;
  /** Free-text search (name, cuisine, tags). */
  q: string | null;
  dateIso: string | null;
  /** Address label for search API (`loc` query param). */
  location: string | null;
  /** Stable place id when autocomplete/API provides one (`place` query param). */
  placeId: string | null;
  cuisines: string[];
  prices: number[];
  tags: string[];
  promos: DiscoveryPromoId[];
}

export function hasDiscoveryLocation(q: DiscoverySearchState): boolean {
  return (q.location?.trim() ?? "").length > 0 || (q.placeId?.trim() ?? "").length > 0;
}

export function hasDiscoveryTextQuery(q: DiscoverySearchState): boolean {
  return (q.q?.trim() ?? "").length > 0;
}

/** Cuisine / tag / promo filters (not free-text `q`) — drives a compact results heading. */
export function hasDiscoveryFilterHeading(q: DiscoverySearchState): boolean {
  if (hasDiscoveryTextQuery(q)) return false;
  return q.cuisines.length > 0 || q.tags.length > 0 || q.promos.length > 0;
}

export function formatDiscoveryFilterHeading(
  q: DiscoverySearchState,
  promoLabels: Record<DiscoveryPromoId, string>,
): string {
  return [
    ...q.cuisines,
    ...q.tags,
    ...q.promos.map((id) => promoLabels[id]),
  ].join(", ");
}

/** Pickup / delivery use a date; reservations book on the vendor site; text search skips date. */
export function searchCategoryUsesDateFilter(category: DiscoveryCategoryId): boolean {
  return category !== "reservations" && category !== "all";
}

export function discoveryDateIsoForCategory(
  category: DiscoveryCategoryId,
  date: Date | null,
): string | null {
  if (!searchCategoryUsesDateFilter(category) || date == null) return null;
  return toIsoDateString(date);
}

function parseDiscoveryDateParam(
  category: DiscoveryCategoryId,
  raw: string | null | undefined,
): string | null {
  if (!searchCategoryUsesDateFilter(category)) return null;
  if (raw == null || !isValidIsoDateString(raw)) return null;
  return raw;
}

function decodeParam(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function splitComma(raw: string | undefined): string[] {
  if (raw == null || raw === "") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(decodeParam);
}

function splitInts(raw: string | undefined): number[] {
  if (raw == null || raw === "") return [];
  const out: number[] = [];
  for (const part of raw.split(",")) {
    const n = Number(part.trim());
    if (n >= 1 && n <= 4 && Number.isInteger(n)) out.push(n);
  }
  return out;
}

const PROMO_IDS: readonly DiscoveryPromoId[] = ["trendingNow", "newOnSous"];

function splitPromos(raw: string | undefined): DiscoveryPromoId[] {
  const parts = splitComma(raw);
  const out: DiscoveryPromoId[] = [];
  for (const p of parts) {
    if (PROMO_IDS.includes(p as DiscoveryPromoId)) out.push(p as DiscoveryPromoId);
  }
  return out;
}

function parseLocationParam(sp: Record<string, string | string[] | undefined>): {
  location: string | null;
  placeId: string | null;
} {
  const locRaw = typeof sp.loc === "string" ? sp.loc.trim() : "";
  const placeRaw = typeof sp.place === "string" ? sp.place.trim() : "";
  return {
    location: locRaw.length > 0 ? decodeParam(locRaw) : null,
    placeId: placeRaw.length > 0 ? decodeParam(placeRaw) : null,
  };
}

function parseTextQueryParam(sp: Record<string, string | string[] | undefined>): string | null {
  const raw = typeof sp.q === "string" ? sp.q.trim() : "";
  if (raw.length === 0) return null;
  return decodeParam(raw);
}

const EMPTY_DISCOVERY_FILTERS = {
  location: null as string | null,
  placeId: null as string | null,
  cuisines: [] as string[],
  prices: [] as number[],
  tags: [] as string[],
  promos: [] as DiscoveryPromoId[],
};

export function parseDiscoverySearchParams(
  sp: Record<string, string | string[] | undefined>,
): DiscoverySearchState | null {
  const rawCat = typeof sp.category === "string" ? sp.category : "";
  const q = parseTextQueryParam(sp);

  let category: DiscoveryCategoryId;
  if (isDiscoveryCategoryId(rawCat)) {
    category = rawCat;
  } else if (q != null) {
    category = "all";
  } else {
    return null;
  }

  const dateRaw = typeof sp.date === "string" ? sp.date : null;
  const dateIso = parseDiscoveryDateParam(category, dateRaw);
  const { location, placeId } = parseLocationParam(sp);

  const cuisineRaw = typeof sp.cuisine === "string" ? sp.cuisine : undefined;
  const tagRaw = typeof sp.tag === "string" ? sp.tag : undefined;
  const priceRaw = typeof sp.price === "string" ? sp.price : undefined;
  const promoRaw = typeof sp.promo === "string" ? sp.promo : undefined;

  return {
    category,
    q,
    dateIso,
    location,
    placeId,
    cuisines: splitComma(cuisineRaw),
    tags: splitComma(tagRaw),
    prices: splitInts(priceRaw),
    promos: splitPromos(promoRaw),
  };
}

function joinCommaEncoded(values: string[]): string {
  return values.map((v) => encodeURIComponent(v)).join(",");
}

export function serializeDiscoverySearchParams(q: DiscoverySearchState): URLSearchParams {
  const p = new URLSearchParams();
  p.set("category", q.category);
  const text = q.q?.trim() ?? "";
  if (text.length > 0) p.set("q", encodeURIComponent(text));
  const loc = q.location?.trim() ?? "";
  if (loc.length > 0) p.set("loc", encodeURIComponent(loc));
  const place = q.placeId?.trim() ?? "";
  if (place.length > 0) p.set("place", encodeURIComponent(place));
  if (searchCategoryUsesDateFilter(q.category) && q.dateIso) p.set("date", q.dateIso);
  if (q.cuisines.length > 0) p.set("cuisine", joinCommaEncoded(q.cuisines));
  if (q.tags.length > 0) p.set("tag", joinCommaEncoded(q.tags));
  if (q.prices.length > 0) p.set("price", [...new Set(q.prices)].sort().join(","));
  if (q.promos.length > 0) p.set("promo", [...new Set(q.promos)].join(","));
  return p;
}

export function discoveryHref(q: DiscoverySearchState): string {
  const qs = serializeDiscoverySearchParams(q).toString();
  return qs ? `/discover?${qs}` : "/discover";
}

/** Navbar / popular chip search — cross-category, optional extra filters. */
export function discoveryTextSearchHref(
  query: string,
  patch?: Partial<DiscoverySearchState>,
): string {
  const trimmed = query.trim();
  return discoveryHref({
    category: "all",
    q: trimmed.length > 0 ? trimmed : null,
    dateIso: null,
    ...EMPTY_DISCOVERY_FILTERS,
    ...patch,
  });
}

/** Discovery page for one category with no search filters applied. */
export function discoveryCategoryHref(category: SearchCategoryId): string {
  return discoveryHref({
    category,
    q: null,
    dateIso: null,
    ...EMPTY_DISCOVERY_FILTERS,
  });
}

export function mergeDiscoveryQuery(
  base: DiscoverySearchState,
  patch: Partial<DiscoverySearchState>,
): DiscoverySearchState {
  const category = patch.category ?? base.category;
  let dateIso = patch.dateIso !== undefined ? patch.dateIso : base.dateIso;
  if (!searchCategoryUsesDateFilter(category)) dateIso = null;

  const q = patch.q !== undefined ? patch.q : base.q;
  const qNorm = q?.trim() ?? "";
  const qValue = qNorm.length > 0 ? qNorm : null;

  return {
    category,
    q: qValue,
    dateIso,
    location: patch.location !== undefined ? patch.location : base.location,
    placeId: patch.placeId !== undefined ? patch.placeId : base.placeId,
    cuisines: patch.cuisines !== undefined ? patch.cuisines : base.cuisines,
    prices: patch.prices !== undefined ? patch.prices : base.prices,
    tags: patch.tags !== undefined ? patch.tags : base.tags,
    promos: patch.promos !== undefined ? patch.promos : base.promos,
  };
}

/** Narrow discovery category for product-level checks. */
export function asSearchCategoryId(category: DiscoveryCategoryId): SearchCategoryId | null {
  return isSearchCategoryId(category) ? category : null;
}
