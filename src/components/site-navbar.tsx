import { getTranslations } from "next-intl/server";

import { getExploreMenuPanelData } from "@/lib/data/explore-menu-panel";
import { getDiscoverySearchSource } from "@/lib/data/discovery-search";
import { HOME_DELIVERY_RAIL_ID } from "@/features/homepage/lib/home-section-ids";
import type { SiteNavbarCenterNavEntry } from "@/types/site-navbar";

import { SiteNavbarView } from "./site-navbar-view";

const POWERED_BY_HREF = "https://poweredbysous.com/";

export async function SiteNavbar({ className }: { className?: string }) {
  const t = await getTranslations("SiteNavbar");
  const tTrend = await getTranslations("HomePage.trending");
  const exploreMenuPanel = getExploreMenuPanelData();
  const searchSource = getDiscoverySearchSource();
  const navbarSearchPanel = searchSource.getNavbarSearchPanelData();
  const suggestVendors = searchSource.getSuggestVendors();

  const centerNavEntries: SiteNavbarCenterNavEntry[] = [
    {
      id: "explore",
      label: t("explore.trigger"),
      megaMenu: true,
      sheetTitle: t("explore.megaMenuTitle"),
      sheetDescription: t("explore.megaMenuDescription"),
    },
    {
      id: "restaurants",
      label: t("restaurants"),
      placeholder: true,
    },
    {
      id: "powered",
      label: t("poweredBy"),
      externalHref: POWERED_BY_HREF,
    },
  ];

  return (
    <SiteNavbarView
      className={className}
      logoLinkAria={t("logoLinkAria")}
      mainNavAria={t("mainNavAria")}
      mobileMenuAria={t("mobileMenuAria")}
      mobileMenuCloseAria={t("mobileMenuCloseAria")}
      mobileMenuTitle={t("mobileMenuTitle")}
      loginLabel={t("login")}
      searchAria={t("searchAria")}
      wishlistAria={t("wishlistAria")}
      centerNavEntries={centerNavEntries}
      exploreMenuPanel={exploreMenuPanel}
      exploreTrendingSectionTitle={tTrend("badges.trendingNow")}
      exploreSeeAllLabel={t("explore.seeAll")}
      exploreSeeAllHref={`/#${HOME_DELIVERY_RAIL_ID}`}
      navbarSearchPanel={navbarSearchPanel}
      suggestVendors={suggestVendors}
    />
  );
}
