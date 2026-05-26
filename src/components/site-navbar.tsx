import { getTranslations } from "next-intl/server";

import { getDiscoverySearchSource } from "@/lib/data/discovery-search";

import { SiteTopBar } from "./SiteTopBar";
import { SiteNavbarView } from "./site-navbar-view";

const POWERED_BY_HREF = "https://poweredbysous.com/";

export async function SiteNavbar({ className }: { className?: string }) {
  const t = await getTranslations("SiteNavbar");
  const searchSource = getDiscoverySearchSource();
  const navbarSearchPanel = searchSource.getNavbarSearchPanelData();
  const suggestVendors = searchSource.getSuggestVendors();

  return (
    <div className="sticky top-0 z-[60] w-full shrink-0">
      <SiteTopBar label={t("poweredBy")} href={POWERED_BY_HREF} />
      <SiteNavbarView
        className={className}
        logoLinkAria={t("logoLinkAria")}
        loginLabel={t("login")}
        searchAria={t("searchAria")}
        wishlistAria={t("wishlistAria")}
        navbarSearchPanel={navbarSearchPanel}
        suggestVendors={suggestVendors}
      />
    </div>
  );
}
