import type { SearchSuggestVendor } from "@/types/search";

/** Fields required for client/server text matching. */
export type VendorTextSearchFields = Pick<
  SearchSuggestVendor,
  "name" | "slug" | "cuisineTags" | "tags"
>;

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function vendorMatchesTextQuery(vendor: VendorTextSearchFields, rawQuery: string): boolean {
  const q = normalizeSearchText(rawQuery);
  if (q.length === 0) return true;

  if (normalizeSearchText(vendor.name).includes(q)) return true;
  if (normalizeSearchText(vendor.slug).replace(/-/g, " ").includes(q)) return true;

  for (const cuisine of vendor.cuisineTags) {
    if (normalizeSearchText(cuisine).includes(q)) return true;
  }
  for (const tag of vendor.tags) {
    if (normalizeSearchText(tag).includes(q)) return true;
  }

  return false;
}

export function rankVendorTextMatch(vendor: VendorTextSearchFields, rawQuery: string): number {
  const q = normalizeSearchText(rawQuery);
  if (q.length === 0) return 0;

  const name = normalizeSearchText(vendor.name);
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(q)) return 2;

  const slug = normalizeSearchText(vendor.slug).replace(/-/g, " ");
  if (slug.startsWith(q)) return 3;

  for (const cuisine of vendor.cuisineTags) {
    const c = normalizeSearchText(cuisine);
    if (c === q || c.startsWith(q)) return 4;
    if (c.includes(q)) return 5;
  }

  for (const tag of vendor.tags) {
    const t = normalizeSearchText(tag);
    if (t === q || t.startsWith(q)) return 6;
    if (t.includes(q)) return 7;
  }

  return 8;
}
