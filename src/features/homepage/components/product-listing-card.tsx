"use client";

import { ListingCard } from "@/components/listing-cards/listing-card";
import { useOptionalListingRailCardSurface } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import type { ListingCardSurface } from "@/types/listing-card";
import type { ProductListing } from "@/types/home";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ProductListingCardProps {
  item: ProductListing;
  /** Overrides {@link ListingRail} `listingSurface` when set. */
  surface?: ListingCardSurface;
}

export function ProductListingCard({ item, surface }: ProductListingCardProps) {
  const fromRail = useOptionalListingRailCardSurface();
  const resolvedSurface = surface ?? fromRail ?? "standard";
  const t = useTranslations("HomePage.listingCard");

  const card = (
    <ListingCard
      className="h-full min-h-0 w-full"
      surface={resolvedSurface}
      mode="product"
      title={item.title}
      vendorName={item.vendorName}
      price={item.price}
      primaryImageSrc={item.imageUrl}
      hoverImageSrc={item.hoverImageUrl}
      priceFromLabel={resolvedSurface === "standard" ? t("priceFrom") : undefined}
    />
  );

  if (item.vendorSlug) {
    return (
      <Link
        href={`/vendors/${item.vendorSlug}`}
        className={cn(
          "block h-full min-h-0 w-full min-w-0 rounded-ds-12 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
          resolvedSurface === "card" && "rounded-ds-20",
        )}
      >
        {card}
      </Link>
    );
  }

  return card;
}
