"use client";

import { ListingCard } from "@/components/listing-cards/listing-card";
import { useOptionalListingRailCardSurface } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import type { ListingCardSurface } from "@/types/listing-card";
import type { PartnerListing } from "@/types/home";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PartnerListingCardProps {
  item: PartnerListing;
  /** Overrides {@link ListingRail} `listingSurface` when set. */
  surface?: ListingCardSurface;
  /** Hide price tier on the card (e.g. navbar search featured rail). */
  showPrice?: boolean;
  /** Hide hover arrow beside title (e.g. image + title only). */
  showTitleArrow?: boolean;
  /** Fires before navigation (e.g. close navbar search / mobile menu). */
  onNavigate?: () => void;
}

export function PartnerListingCard({
  item,
  surface,
  showPrice = true,
  showTitleArrow = true,
  onNavigate,
}: PartnerListingCardProps) {
  const fromRail = useOptionalListingRailCardSurface();
  const resolvedSurface = surface ?? fromRail ?? "card";
  const t = useTranslations("HomePage.listingCard");

  return (
    <Link
      href={`/vendors/${item.slug}`}
      onClick={() => onNavigate?.()}
      className={cn(
        "block h-full min-h-0 w-full min-w-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        resolvedSurface === "card" ? "rounded-ds-20" : "rounded-ds-12",
      )}
    >
      <ListingCard
        className="h-full min-h-0 w-full"
        surface={resolvedSurface}
        mode="vendor"
        title={item.name}
        price={showPrice ? item.price : null}
        primaryImageSrc={item.imageUrl}
        hoverImageSrc={item.hoverImageUrl}
        priceFromLabel={resolvedSurface === "standard" ? t("priceFrom") : undefined}
        showTitleArrow={showTitleArrow}
      />
    </Link>
  );
}
