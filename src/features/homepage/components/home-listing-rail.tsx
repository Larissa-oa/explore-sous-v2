import { getTranslations } from "next-intl/server";

import { ListingRail, ListingRailSlide } from "@/components/carousel";
import { getHomeVendorsByOffer } from "@/lib/data/home";
import { HOME_DELIVERY_RAIL_ID, HOME_PICKUP_RAIL_ID } from "@/features/homepage/lib/home-section-ids";

import { PartnerListingCard } from "./partner-listing-card";

type HomeRailKind = "delivery" | "pickup";

const RAILS: Record<
  HomeRailKind,
  {
    sectionId: string;
    titleKey: "delivery.title" | "pickup.title";
    descriptionKey: "delivery.description" | "pickup.description";
  }
> = {
  delivery: {
    sectionId: HOME_DELIVERY_RAIL_ID,
    titleKey: "delivery.title",
    descriptionKey: "delivery.description",
  },
  pickup: {
    sectionId: HOME_PICKUP_RAIL_ID,
    titleKey: "pickup.title",
    descriptionKey: "pickup.description",
  },
};

/** Shared homepage listing rails; rows come from mock-backed helpers in `@/lib/data/home`. */
export async function HomeListingRail({ kind }: { kind: HomeRailKind }) {
  const t = await getTranslations("HomePage");
  const rail = RAILS[kind];

  return (
    <ListingRail
      sectionId={rail.sectionId}
      title={t(rail.titleKey)}
      description={t(rail.descriptionKey)}
      navLabels={{
        prev: t("listingRail.prev"),
        next: t("listingRail.next"),
        region: t("listingRail.region"),
      }}
    >
      {getHomeVendorsByOffer(kind).map((item) => (
        <ListingRailSlide key={item.id}>
          <PartnerListingCard item={item} />
        </ListingRailSlide>
      ))}
    </ListingRail>
  );
}
