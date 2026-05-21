"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { HeartIcon } from "@phosphor-icons/react";

import sousLogo from "@/assets/SOUS_idlAewIad1_1.svg";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NAVBAR_SURFACE_TRANSITION_CLASS,
  SITE_HOME_HERO_ELEMENT_ID,
  isLocalizedHomePathname,
  navbarSurfaceBackgroundClass,
  pageShellContentClass,
} from "@/lib/site-layout";
import type { ExploreMenuPanelData } from "@/types/explore-menu";
import type { SiteNavbarCenterNavEntry } from "@/types/site-navbar";

import { NavbarSearchDesktop } from "@/features/search";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { SearchSuggestVendor } from "@/types/search";

import { SiteNavbarCenterNav } from "./site-navbar-center-nav";
import { SiteNavbarMobileMenu } from "./site-navbar-mobile-menu";

export type SiteNavbarViewProps = {
  className?: string;
  logoLinkAria: string;
  mainNavAria: string;
  mobileMenuAria: string;
  mobileMenuCloseAria: string;
  mobileMenuTitle: string;
  loginLabel: string;
  searchAria: string;
  wishlistAria: string;
  centerNavEntries: SiteNavbarCenterNavEntry[];
  exploreMenuPanel: ExploreMenuPanelData;
  /** Section heading above explore trending list (mega + mobile). */
  exploreTrendingSectionTitle: string;
  exploreSeeAllLabel: string;
  exploreSeeAllHref: string;
  navbarSearchPanel: NavbarSearchPanelData;
  suggestVendors: SearchSuggestVendor[];
};

export function SiteNavbarView({
  className,
  logoLinkAria,
  mainNavAria,
  mobileMenuAria,
  mobileMenuCloseAria,
  mobileMenuTitle,
  loginLabel,
  searchAria,
  wishlistAria,
  centerNavEntries,
  exploreMenuPanel,
  exploreTrendingSectionTitle,
  exploreSeeAllLabel,
  exploreSeeAllHref,
  navbarSearchPanel,
  suggestVendors,
}: SiteNavbarViewProps) {
  const pathname = usePathname();
  const isHomeRoute = isLocalizedHomePathname(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMegaId, setOpenMegaId] = useState<string | null>(null);
  const megaMenuOpen = openMegaId != null;
  const [homeHeroInView, setHomeHeroInView] = useState(isHomeRoute);

  const handleMegaSheetOpenChange = useCallback((entryId: string, open: boolean) => {
    setOpenMegaId((prev) => {
      if (open) return entryId;
      return prev === entryId ? null : prev;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onCrossMdBreakpoint = () => {
      if (mq.matches) {
        setMobileMenuOpen(false);
      } else {
        setOpenMegaId(null);
      }
    };
    mq.addEventListener("change", onCrossMdBreakpoint);
    return () => mq.removeEventListener("change", onCrossMdBreakpoint);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMegaId(null);
  }, [pathname]);

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
    megaMenuOpen,
    mobileMenuOpen,
  });

  return (
    <header
      className={cn(
        NAVBAR_SURFACE_TRANSITION_CLASS,
        surfaceClass,
        "sticky top-0 z-[60] w-full shrink-0 text-foreground",
        className,
      )}
    >
      <div className={cn(pageShellContentClass, "flex items-center gap-4 py-3 md:gap-6 md:py-4")}>
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

        <nav
          aria-label={mainNavAria}
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex"
        >
          <SiteNavbarCenterNav
            entries={centerNavEntries}
            exploreMenuPanel={exploreMenuPanel}
            exploreTrendingSectionTitle={exploreTrendingSectionTitle}
            exploreSeeAllLabel={exploreSeeAllLabel}
            exploreSeeAllHref={exploreSeeAllHref}
            openMegaId={openMegaId}
            onMegaSheetOpenChange={handleMegaSheetOpenChange}
          />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" className="h-9 px-2 text-sm font-medium text-foreground" asChild>
            <Link href="/">{loginLabel}</Link>
          </Button>
          <NavbarSearchDesktop
            searchAria={searchAria}
            panel={navbarSearchPanel}
            suggestVendors={suggestVendors}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground"
            aria-label={wishlistAria}
          >
            <HeartIcon className="size-5" weight="bold" aria-hidden="true" />
          </Button>
          <SiteNavbarMobileMenu
            entries={centerNavEntries}
            exploreMenuPanel={exploreMenuPanel}
            menuAria={mobileMenuAria}
            menuCloseAria={mobileMenuCloseAria}
            menuTitle={mobileMenuTitle}
            trendingSectionTitle={exploreTrendingSectionTitle}
            seeAllLabel={exploreSeeAllLabel}
            seeAllHref={exploreSeeAllHref}
            searchAria={searchAria}
            navbarSearchPanel={navbarSearchPanel}
            suggestVendors={suggestVendors}
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
          />
        </div>
      </div>
    </header>
  );
}
