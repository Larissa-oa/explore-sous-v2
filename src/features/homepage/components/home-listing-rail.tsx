import { getTranslations } from "next-intl/server";

import { ListingRail, ListingRailSlide } from "@/components/carousel";
import {
  getHomePartners,
  getHomeVendorsByOffer,
  type HomeVendorOfferKind,
} from "@/lib/data/home";
import { HOME_DELIVERY_RAIL_ID, HOME_PICKUP_RAIL_ID } from "@/features/homepage/lib/home-section-ids";
import { heroBandBackgroundClass } from "@/lib/site-layout";

import { PartnerListingCard } from "./partner-listing-card";

type HomeRailKind = "delivery" | "pickup" | "partners";

const OFFER_BY_KIND: Record<"delivery" | "pickup", HomeVendorOfferKind> = {
  delivery: "delivery",
  pickup: "pickup",
};

const RAIL_CONFIG: Record<
  HomeRailKind,
  {
    sectionId?: string;
    titleKey: "delivery.title" | "pickup.title" | "partners.title";
    descriptionKey: "delivery.description" | "pickup.description" | "partners.description";
    width: "contained" | "fullBleed";
    listingSurface: "standard" | "card";
    className?: string;
    titleAlignDesktop?: "start" | "center";
  }
> = {
  delivery: {
    sectionId: HOME_DELIVERY_RAIL_ID,
    titleKey: "delivery.title",
    descriptionKey: "delivery.description",
    width: "contained",
    listingSurface: "standard",
  },
  pickup: {
    sectionId: HOME_PICKUP_RAIL_ID,
    titleKey: "pickup.title",
    descriptionKey: "pickup.description",
    width: "contained",
    listingSurface: "standard",
  },
  partners: {
    titleKey: "partners.title",
    descriptionKey: "partners.description",
    width: "fullBleed",
    listingSurface: "card",
    className: heroBandBackgroundClass,
    titleAlignDesktop: "center",
  },
};

function railSlides(kind: HomeRailKind) {
  const items =
    kind === "partners"
      ? getHomePartners()
      : getHomeVendorsByOffer(OFFER_BY_KIND[kind]);

  return items.map((item) => (
    <ListingRailSlide key={item.id}>
      <PartnerListingCard item={item} />
    </ListingRailSlide>
  ));
}

/** Shared homepage listing rails; rows come from mock-backed helpers in `@/lib/data/home`. */
export async function HomeListingRail({ kind }: { kind: HomeRailKind }) {
  const t = await getTranslations("HomePage");
  const navLabels = {
    prev: t("listingRail.prev"),
    next: t("listingRail.next"),
    region: t("listingRail.region"),
  } as const;
  const config = RAIL_CONFIG[kind];

  return (
    <ListingRail
      width={config.width}
      sectionId={config.sectionId}
      title={t(config.titleKey)}
      description={t(config.descriptionKey)}
      navLabels={navLabels}
      listingSurface={config.listingSurface}
      className={config.className}
      titleAlignDesktop={config.titleAlignDesktop}
    >
      {railSlides(kind)}
    </ListingRail>
  );
}
