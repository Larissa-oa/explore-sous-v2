import type { VendorPriceLevel } from "@/types/catalog";
import type { ListingPrice } from "@/types/listing-card";

export interface PartnerListing {
  id: string;
  /** Route slug for `/vendors/[slug]`. */
  slug: string;
  name: string;
  imageUrl?: string;
  hoverImageUrl?: string;
  /** Vendor € tier (1–4); rendered via {@link ListingCardPrice}. */
  price: VendorPriceLevel;
}

export interface ProductListing {
  id: string;
  vendorName: string;
  /** When set, the card links to `/vendors/[vendorSlug]`. */
  vendorSlug?: string;
  title: string;
  price: ListingPrice;
  imageUrl?: string;
  hoverImageUrl?: string;
}

/** Homepage vendor spotlight column ids — keys match {@link HomePage.vendorSpotlight.blocks} in messages and {@link HomeCatalog.homepage.vendorSpotlight.blocks} in the catalog mock. */
export type VendorSpotlightBlockKey = "climbing" | "bookTonight" | "newOnPlatform";

export interface VendorSpotlightRow {
  id: string;
  /** Route slug for `/vendors/[slug]`. */
  slug: string;
  name: string;
  imageUrl: string;
  location: string;
  cuisineTags: string[];
}

export interface VendorSpotlightBlock {
  blockKey: VendorSpotlightBlockKey;
  rows: VendorSpotlightRow[];
}
