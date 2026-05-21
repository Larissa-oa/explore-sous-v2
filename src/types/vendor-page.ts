import type { CatalogVendor } from "@/types/catalog";

/** Public vendor profile used by the vendor detail route and reusable blocks. */
export interface VendorPageDetail extends CatalogVendor {
  streetAddress: string;
  postalCode: string;
  city: string;
  /** Preformatted single line for pin context. */
  addressLine: string;
  phone: string;
  lat: number;
  lng: number;
  /** Heading on the location card (e.g. venue + neighbourhood). */
  locationCardTitle: string;
}
