"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { ExploreMenuCategoryColumn, ExploreMenuTrendingList } from "@/components/explore-menu";
import { NavbarSearchMobile } from "@/features/search";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { SearchSuggestVendor } from "@/types/search";
import { TRENDING_LIST_UL_CLASS } from "@/components/explore-menu/explore-menu-constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ExploreMenuPanelData } from "@/types/explore-menu";
import type { SiteNavbarCenterNavEntry } from "@/types/site-navbar";

/** Same horizontal inset as {@link TRENDING_ROW_LINK_MOBILE_CLASS} (`px-4 sm:px-5`). */
const footerNavRowShared = cn(
  "flex w-full items-center justify-start gap-3 text-left text-base font-semibold leading-tight text-foreground",
  "px-4 sm:px-5",
  "py-3.5 sm:py-4",
);

const footerColumnLinkClass = cn(
  footerNavRowShared,
  "justify-start gap-0",
  "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

const footerColumnPlaceholderClass = cn(footerNavRowShared);

export function SiteNavbarMobileMenu({
  entries,
  exploreMenuPanel,
  menuAria,
  menuCloseAria,
  menuTitle,
  trendingSectionTitle,
  seeAllLabel,
  seeAllHref,
  searchAria,
  navbarSearchPanel,
  suggestVendors,
  open,
  onOpenChange,
}: {
  entries: SiteNavbarCenterNavEntry[];
  exploreMenuPanel: ExploreMenuPanelData;
  menuAria: string;
  menuCloseAria: string;
  menuTitle: string;
  trendingSectionTitle: string;
  seeAllLabel: string;
  seeAllHref: string;
  searchAria: string;
  navbarSearchPanel: NavbarSearchPanelData;
  suggestVendors: SearchSuggestVendor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const skipDismissRef = useRef(false);
  const [menuSearchActive, setMenuSearchActive] = useState(false);

  useEffect(() => {
    if (!open) {
      setMenuSearchActive(false);
    }
  }, [open]);

  const footerEntries = entries.filter(
    (e) => ("placeholder" in e && e.placeholder) || ("externalHref" in e && e.externalHref),
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && skipDismissRef.current) return;
      onOpenChange(next);
    },
    [onOpenChange],
  );

  const dismissMenu = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (open) {
        onOpenChange(false);
        return;
      }
      skipDismissRef.current = true;
      onOpenChange(true);
      window.setTimeout(() => {
        skipDismissRef.current = false;
      }, 0);
    },
    [onOpenChange, open],
  );

  function renderFooterEntry(entry: (typeof footerEntries)[number]) {
    if ("placeholder" in entry && entry.placeholder) {
      return (
        <p className={footerColumnPlaceholderClass} aria-disabled="true">
          {entry.label}
        </p>
      );
    }
    if ("externalHref" in entry) {
      return (
        <SheetClose asChild>
          <a
            href={entry.externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className={footerColumnLinkClass}
          >
            <span className="min-w-0">{entry.label}</span>
            <ArrowUpRight className="size-5 shrink-0 text-foreground" aria-hidden />
          </a>
        </SheetClose>
      );
    }
    return null;
  }

  return (
    <div className="md:hidden">
      {/* Non-modal: Radix dialog `modal` inerts the page and blocked the header close control. */}
      <Sheet open={open} onOpenChange={handleOpenChange} modal={false}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-mobile-menu-toggle
          className="relative z-[calc(var(--z-site-navbar)+1)] text-foreground"
          aria-label={open ? menuCloseAria : menuAria}
          aria-expanded={open}
          aria-controls="site-navbar-mobile-menu"
          aria-haspopup="dialog"
          onClick={handleToggle}
        >
          <span className="relative flex size-5 items-center justify-center" aria-hidden>
            <Menu
              className={cn(
                "absolute size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                open ? "pointer-events-none scale-90 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0",
              )}
              strokeWidth={2}
            />
            <X
              className={cn(
                "absolute size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                open ? "scale-100 opacity-100 rotate-0" : "pointer-events-none scale-90 opacity-0 -rotate-90",
              )}
              strokeWidth={2}
            />
          </span>
        </Button>
        <SheetContent
          id="site-navbar-mobile-menu"
          side="right"
          showCloseButton={false}
          scrimAboveNavbar={false}
          overlayClassName="!inset-x-0 !bottom-0 !top-[var(--site-navbar-height)]"
          onPointerDownOutside={(event) => {
            const target = event.target;
            if (
              target instanceof Element &&
              target.closest("[data-mobile-menu-toggle], header")
            ) {
              event.preventDefault();
            }
          }}
          className={cn(
            "z-[59] flex w-screen max-w-none flex-col gap-0 border-l border-border bg-popover p-0 sm:max-w-none",
            "!inset-y-auto !left-auto !right-0 !top-[var(--site-navbar-height)] !bottom-0",
            "!h-[calc(100dvh-var(--site-navbar-height))] !w-screen !max-w-none",
            menuSearchActive ? "overflow-hidden" : "overflow-y-auto overscroll-contain",
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{menuTitle}</SheetTitle>
          </SheetHeader>

          <div
            className={cn(
              "relative flex min-h-0 flex-1 flex-col",
              menuSearchActive && "overflow-hidden",
            )}
          >
            <NavbarSearchMobile
              searchAria={searchAria}
              panel={navbarSearchPanel}
              suggestVendors={suggestVendors}
              menuOpen={open}
              onSearchActiveChange={setMenuSearchActive}
              onDismissMenu={dismissMenu}
            />

            {!menuSearchActive ? (
              <div
                className={cn(
                  "flex flex-col gap-4 px-4",
                  "pb-[max(2rem,env(safe-area-inset-bottom,0px))]",
                )}
              >
                <ExploreMenuCategoryColumn
                  categories={exploreMenuPanel.categories}
                  layout="mobileSheet"
                />

                <ExploreMenuTrendingList
                  menus={exploreMenuPanel.menus}
                  trendingTitle={trendingSectionTitle}
                  variant="mobile"
                  seeAllLabel={seeAllLabel}
                  seeAllHref={seeAllHref}
                />

                <div className="flex w-full shrink-0 flex-col border-t border-border">
                  <ul className={TRENDING_LIST_UL_CLASS}>
                    {footerEntries.map((entry) => (
                      <li key={entry.id} className="min-w-0">
                        {renderFooterEntry(entry)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
