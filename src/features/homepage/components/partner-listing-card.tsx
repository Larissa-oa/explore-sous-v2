"use client";

import { ListingCard } from "@/components/listing-cards/listing-card";
import { Link } from "@/i18n/navigation";
import type { PartnerListing } from "@/types/home";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PartnerListingCardProps {
  item: PartnerListing;
  /** Hide price tier on the card (e.g. navbar search featured rail). */
  showPrice?: boolean;
  /** Hide hover arrow beside title (e.g. image + title only). */
  showTitleArrow?: boolean;
  /** Fires before navigation (e.g. close navbar search / mobile menu). */
  onNavigate?: () => void;
}

export function PartnerListingCard({
  item,
  showPrice = true,
  showTitleArrow = true,
  onNavigate,
}: PartnerListingCardProps) {
  const t = useTranslations("HomePage.listingCard");

  return (
    <Link
      href={`/vendors/${item.slug}`}
      onClick={() => onNavigate?.()}
      className={cn(
        "block h-full min-h-0 w-full min-w-0 rounded-ds-12 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
      )}
    >
      <ListingCard
        className="h-full min-h-0 w-full"
        surface="standard"
        mode="vendor"
        title={item.name}
        price={showPrice ? item.price : null}
        primaryImageSrc={item.imageUrl}
        hoverImageSrc={item.hoverImageUrl}
        priceFromLabel={t("priceFrom")}
        showTitleArrow={showTitleArrow}
      />
    </Link>
  );
}
