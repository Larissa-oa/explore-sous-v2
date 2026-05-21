"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { ArrowUpRight } from "lucide-react";

import {
  ExploreMenuCategoryColumn,
  ExploreMenuMegaLeftFooter,
  ExploreMenuTrendingList,
} from "@/components/explore-menu";
import {
  EXPLORE_MEGA_COLUMN_DIVIDER_CLASS,
  EXPLORE_MEGA_INNER_SHELL_CLASS,
  EXPLORE_MEGA_MAIN_GRID_CLASS,
  EXPLORE_MEGA_SHEET_CONTENT_CLASS,
} from "@/components/explore-menu/explore-mega-layout";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ExploreMenuPanelData } from "@/types/explore-menu";
import type { SiteNavbarCenterNavEntry, SiteNavbarMegaMenuEntry } from "@/types/site-navbar";

const ICON_WEIGHT = "bold" as const;

const legacyMegaSheetContentClass = cn(
  "max-h-[min(92vh,900px)] w-full max-w-none gap-0 overflow-y-auto rounded-t-none rounded-b-ds-16 border-x-0 border-t-0 p-0 sm:max-w-none",
  "data-[side=top]:pt-14",
);

const sheetLinkClass = cn(
  "block rounded-ds-8 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

const navItemLabelClass = "h-9 px-2 text-sm font-medium text-foreground";

/** Light top-to-bottom stagger for Explore mega columns only (no extra modules). */
function exploreMegaColumnMotion(open: boolean, stagger: "first" | "second" | "third") {
  const delay =
    stagger === "first" ? "delay-0" : stagger === "second" ? "delay-[180ms]" : "delay-[360ms]";
  return cn(
    "transition-[opacity,transform] duration-[720ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    open
      ? cn("translate-y-0 opacity-100", delay)
      : "-translate-y-1.5 opacity-0 duration-300 delay-0 ease-out",
  );
}

function MegaMenuLink({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose asChild>
      <Link href={href} className={sheetLinkClass}>
        {label}
      </Link>
    </SheetClose>
  );
}

function NavMegaMenu({
  entry,
  exploreMenuPanel,
  exploreTrendingSectionTitle,
  exploreSeeAllLabel,
  exploreSeeAllHref,
  open,
  onOpenChange,
}: {
  entry: SiteNavbarMegaMenuEntry;
  exploreMenuPanel: ExploreMenuPanelData;
  exploreTrendingSectionTitle: string;
  exploreSeeAllLabel: string;
  exploreSeeAllHref: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { label, sheetTitle, sheetDescription, items } = entry;
  const useExplorePanel = entry.id === "explore";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" className={cn(navItemLabelClass, "gap-1")}>
          {label}
          <CaretDownIcon className="size-4 shrink-0" weight={ICON_WEIGHT} aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        scrimAboveNavbar={!useExplorePanel}
        overlayClassName={
          useExplorePanel ? "top-[var(--site-navbar-height)]" : undefined
        }
        className={useExplorePanel ? EXPLORE_MEGA_SHEET_CONTENT_CLASS : legacyMegaSheetContentClass}
        aria-label={sheetTitle}
        showCloseButton={!useExplorePanel}
      >
        {useExplorePanel ? (
          <>
            <SheetTitle className="sr-only">{sheetTitle}</SheetTitle>
            {sheetDescription ? (
              <p id="explore-mega-desc" className="sr-only">
                {sheetDescription}
              </p>
            ) : null}
            <div className={EXPLORE_MEGA_INNER_SHELL_CLASS}>
              <div
                className={EXPLORE_MEGA_MAIN_GRID_CLASS}
                {...(sheetDescription ? { "aria-describedby": "explore-mega-desc" } : {})}
              >
                <div
                  className={cn(
                    "flex min-h-0 w-full min-w-0 flex-col gap-3 md:flex-1 md:gap-4",
                    exploreMegaColumnMotion(open, "first"),
                  )}
                >
                  <ExploreMenuCategoryColumn
                    categories={exploreMenuPanel.categories}
                    layout="mega"
                    className="min-h-0 flex-1"
                  />
                  <ExploreMenuMegaLeftFooter />
                </div>
                <div
                  className={cn(EXPLORE_MEGA_COLUMN_DIVIDER_CLASS, exploreMegaColumnMotion(open, "second"))}
                  aria-hidden
                />
                <div
                  className={cn(
                    "flex min-h-0 w-full min-w-0 flex-col md:h-full md:min-h-0",
                    exploreMegaColumnMotion(open, "third"),
                  )}
                >
                  <ExploreMenuTrendingList
                    menus={exploreMenuPanel.menus}
                    trendingTitle={exploreTrendingSectionTitle}
                    variant="mega"
                    fillHeight
                    seeAllLabel={exploreSeeAllLabel}
                    seeAllHref={exploreSeeAllHref}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="border-b border-border px-6 pb-4 text-left sm:px-10">
              <SheetTitle className="type-h4-sb">{sheetTitle}</SheetTitle>
              {sheetDescription ? (
                <SheetDescription className="text-base">{sheetDescription}</SheetDescription>
              ) : null}
            </SheetHeader>
            <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
              <nav aria-label={sheetTitle} className="min-w-0">
                <ul className="flex flex-col gap-0.5">
                  {(items ?? []).map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <MegaMenuLink href={item.href} label={item.label} />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function SiteNavbarCenterNav({
  entries,
  exploreMenuPanel,
  exploreTrendingSectionTitle,
  exploreSeeAllLabel,
  exploreSeeAllHref,
  openMegaId,
  onMegaSheetOpenChange,
}: {
  entries: SiteNavbarCenterNavEntry[];
  exploreMenuPanel: ExploreMenuPanelData;
  exploreTrendingSectionTitle: string;
  exploreSeeAllLabel: string;
  exploreSeeAllHref: string;
  openMegaId: string | null;
  onMegaSheetOpenChange: (entryId: string, open: boolean) => void;
}) {
  return (
    <>
      {entries.map((entry) => {
        if ("megaMenu" in entry && entry.megaMenu) {
          return (
            <NavMegaMenu
              key={entry.id}
              entry={entry}
              exploreMenuPanel={exploreMenuPanel}
              exploreTrendingSectionTitle={exploreTrendingSectionTitle}
              exploreSeeAllLabel={exploreSeeAllLabel}
              exploreSeeAllHref={exploreSeeAllHref}
              open={openMegaId === entry.id}
              onOpenChange={(open) => onMegaSheetOpenChange(entry.id, open)}
            />
          );
        }
        if ("placeholder" in entry && entry.placeholder) {
          return (
            <span
              key={entry.id}
              className={cn("inline-flex cursor-default items-center", navItemLabelClass)}
              aria-disabled="true"
            >
              {entry.label}
            </span>
          );
        }
        if ("externalHref" in entry) {
          return (
            <a
              key={entry.id}
              href={entry.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                navItemLabelClass,
              )}
            >
              {entry.label}
              <ArrowUpRight className="size-4 shrink-0" aria-hidden />
            </a>
          );
        }
        return null;
      })}
    </>
  );
}
