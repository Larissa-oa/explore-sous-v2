"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HeartIcon } from "@phosphor-icons/react";

import sousLogo from "@/assets/SOUS_idlAewIad1_1.svg";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NAVBAR_SURFACE_TRANSITION_CLASS,
  SITE_HOME_HERO_ELEMENT_ID,
  isLocalizedDiscoverPathname,
  isLocalizedHomePathname,
  navbarSurfaceBackgroundClass,
  pageShellContentClass,
} from "@/lib/site-layout";
import { useNavbarDiscoverSearchVisible } from "@/features/homepage/hooks/discover-search";
import {
  NavbarDiscoverSearch,
  NavbarSearchDesktop,
  NavbarSearchMobile,
} from "@/features/search";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { SearchSuggestVendor } from "@/types/search";

export type SiteNavbarViewProps = {
  className?: string;
  logoLinkAria: string;
  loginLabel: string;
  searchAria: string;
  wishlistAria: string;
  navbarSearchPanel: NavbarSearchPanelData;
  suggestVendors: SearchSuggestVendor[];
};

export function SiteNavbarView({
  className,
  logoLinkAria,
  loginLabel,
  searchAria,
  wishlistAria,
  navbarSearchPanel,
  suggestVendors,
}: SiteNavbarViewProps) {
  const pathname = usePathname();
  const isHomeRoute = isLocalizedHomePathname(pathname);
  const isDiscoverRoute = isLocalizedDiscoverPathname(pathname);
  const [homeHeroInView, setHomeHeroInView] = useState(isHomeRoute);
  const [mobileTextSearchOpen, setMobileTextSearchOpen] = useState(false);
  const [mobileDiscoverSheetOpen, setMobileDiscoverSheetOpen] = useState(false);

  const discoverSearchInNavbar = useNavbarDiscoverSearchVisible(isHomeRoute, isDiscoverRoute);

  useEffect(() => {
    if (discoverSearchInNavbar) setMobileTextSearchOpen(false);
  }, [discoverSearchInNavbar]);

  useEffect(() => {
    if (!isHomeRoute) {
      setHomeHeroInView(false);
      return;
    }

    const el = document.getElementById(SITE_HOME_HERO_ELEMENT_ID);
    if (!el) {
      setHomeHeroInView(true);
      return;
    }

    const observer = new IntersectionObserver(([e]) => setHomeHeroInView(e.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHomeRoute]);

  const surfaceClass = navbarSurfaceBackgroundClass({
    isHomeRoute,
    homeHeroInView,
    mobileSearchOpen: mobileTextSearchOpen || mobileDiscoverSheetOpen,
    discoverSearchInNavbar,
  });

  const showDiscoverSearch = discoverSearchInNavbar;

  return (
    <header
      className={cn(
        NAVBAR_SURFACE_TRANSITION_CLASS,
        surfaceClass,
        "w-full shrink-0 text-foreground",
        showDiscoverSearch && "navbar-discover-header-elevated md:overflow-visible",
        mobileDiscoverSheetOpen && "max-md:relative max-md:z-[71]",
        className,
      )}
    >
      <div
        className={cn(
          pageShellContentClass,
          "flex items-center gap-3 py-2.5 md:gap-4",
          showDiscoverSearch ? "md:py-2.5" : "md:py-3.5",
          showDiscoverSearch && "max-md:gap-2",
        )}
      >
        <div className="flex min-w-0 shrink-0 items-center">
          <Link
            href="/"
            className="inline-flex items-center text-ds-blue-900 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={logoLinkAria}
          >
            <Image
              src={sousLogo}
              alt=""
              width={120}
              height={34}
              className="h-4 w-auto"
              priority
            />
          </Link>
        </div>

        {showDiscoverSearch ? (
          <div className="min-w-0 flex-1 overflow-visible transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none">
            <NavbarDiscoverSearch onSheetOpenChange={setMobileDiscoverSheetOpen} />
          </div>
        ) : null}

        <div
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1 sm:gap-2",
            showDiscoverSearch && "max-md:hidden",
          )}
        >
          <Button variant="ghost" className="h-9 px-2 text-sm font-medium text-foreground" asChild>
            <Link href="/">{loginLabel}</Link>
          </Button>
          <NavbarSearchDesktop
            searchAria={searchAria}
            panel={navbarSearchPanel}
            suggestVendors={suggestVendors}
          />
          {!showDiscoverSearch ? (
            <NavbarSearchMobile
              searchAria={searchAria}
              panel={navbarSearchPanel}
              suggestVendors={suggestVendors}
              onOpenChange={setMobileTextSearchOpen}
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground"
            aria-label={wishlistAria}
          >
            <HeartIcon className="size-5" weight="bold" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
