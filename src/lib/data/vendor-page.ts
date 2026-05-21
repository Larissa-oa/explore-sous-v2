import "server-only";

import { getVendorLatLng } from "@/lib/data/vendor-coordinates";
import { getHomeCatalog } from "@/lib/data/home";
import type { CatalogVendor } from "@/types/catalog";
import type { VendorPageDetail } from "@/types/vendor-page";

/** Curated location/contact for select slugs; about copy comes from {@link CatalogVendor.description} in the catalog. */
const VENDOR_PAGE_COPY: Partial<
  Record<
    string,
    Pick<
      VendorPageDetail,
      "streetAddress" | "postalCode" | "city" | "phone" | "lat" | "lng" | "locationCardTitle"
    >
  >
> = {
  "ron-gastrobar": {
    locationCardTitle: "Ron Gastrobar — Amsterdam",
    streetAddress: "Emmastraat 59-65",
    postalCode: "1075 HZ",
    city: "Amsterdam",
    phone: "+31 20 496 23 43",
    lat: 52.3527,
    lng: 4.8688,
  },
  "neni-amsterdam": {
    locationCardTitle: "NENI Amsterdam — Stadionplein",
    streetAddress: "Stadionplein 24",
    postalCode: "1076 CK",
    city: "Amsterdam",
    phone: "+31 20 309 60 11",
    lat: 52.3439,
    lng: 4.8564,
  },
};

export function buildVendorPageDetail(vendor: CatalogVendor): VendorPageDetail {
  const copy = VENDOR_PAGE_COPY[vendor.slug];
  const fallback = getVendorLatLng(vendor.slug);
  const lat = copy?.lat ?? fallback.lat;
  const lng = copy?.lng ?? fallback.lng;
  const streetAddress = copy?.streetAddress ?? "Keizersgracht 100";
  const postalCode = copy?.postalCode ?? "3512 AV";
  const city = copy?.city ?? "Utrecht";
  const phone = copy?.phone ?? "+31 30 000 0000";
  const addressLine = `${streetAddress}, ${postalCode}, ${city}`;
  const locationCardTitle = copy?.locationCardTitle ?? `${vendor.name}`;

  return {
    ...vendor,
    streetAddress,
    postalCode,
    city,
    addressLine,
    phone,
    lat,
    lng,
    locationCardTitle,
  };
}

export function listVendorSlugs(): string[] {
  return getHomeCatalog().vendors.map((v) => v.slug);
}

export function getVendorPageDetailBySlug(slug: string): VendorPageDetail | null {
  const vendor = getHomeCatalog().vendors.find((v) => v.slug === slug);
  if (!vendor) return null;
  return buildVendorPageDetail(vendor);
}
