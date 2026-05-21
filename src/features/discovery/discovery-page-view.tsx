"use client";

import { MapTrifoldIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { DiscoveryMap } from "@/components/maps/discovery-map";
import { Button } from "@/components/ui/button";
import { DiscoveryMobileMapExplore } from "@/features/discovery/discovery-mobile-map-explore";
import { DiscoveryPageHeader } from "@/features/discovery/discovery-page-header";
import { DiscoveryVendorRowView } from "@/features/discovery/discovery-vendor-row-view";
import type { DiscoveryFilterMeta, DiscoverySearchGeo, DiscoveryVendorRow } from "@/types/discovery";
import {
  formatDiscoveryFilterHeading,
  hasDiscoveryFilterHeading,
  hasDiscoveryTextQuery,
} from "@/lib/discovery/discovery-query";
import type { DiscoveryPromoId, DiscoverySearchState } from "@/lib/discovery/discovery-query";
import { Link } from "@/i18n/navigation";
import { pageContentGutterXClass, pageShellContentClass } from "@/lib/site-layout";
import { cn } from "@/lib/utils";

// Inner list scroll on `lg+`; smaller breakpoints use window scroll — keep both in mind when changing layout.
const LIST_SCROLL =
  "min-h-0 lg:h-full lg:max-h-[calc(100dvh-10rem)] lg:overflow-y-auto lg:pr-1";
/** Fills the spanned grid rows on desktop (no `56rem` cap) and sticks under the navbar while scrolling. */
const MAP_STICKY =
  "lg:sticky lg:top-[var(--site-navbar-height)] lg:z-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:self-stretch";

/** One shell for filters + results so the sticky bar stays in a tall scroll parent. */
const discoveryPageShellClass = cn(
  "mx-auto w-full min-w-0 max-w-[1800px]",
  pageContentGutterXClass,
  "lg:pr-0 xl:pr-0",
);

export type DiscoveryPageIssue = "ok" | "bad_params";

const PAGE_SIZE = 24;

export interface DiscoveryPageViewProps {
  rows: DiscoveryVendorRow[];
  issue: DiscoveryPageIssue;
  query?: DiscoverySearchState | null;
  searchGeo?: DiscoverySearchGeo;
  filterMeta?: DiscoveryFilterMeta;
}

export function DiscoveryPageView({
  rows,
  issue,
  query,
  searchGeo,
  filterMeta,
}: DiscoveryPageViewProps) {
  const t = useTranslations("Discovery");
  const tHeader = useTranslations("Discovery.header");
  const tm = useTranslations("Discovery.mobileMap");

  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PAGE_SIZE, rows.length),
  );
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + PAGE_SIZE, rows.length));
  }, [rows.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= rows.length) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: "100px", threshold: 0 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [loadMore, visibleCount, rows.length]);

  const visibleRows = rows.slice(0, visibleCount);
  const textQuery = query != null && hasDiscoveryTextQuery(query) ? query.q!.trim() : null;
  const filterHeading =
    query != null && hasDiscoveryFilterHeading(query)
      ? formatDiscoveryFilterHeading(query, {
          trendingNow: tHeader("promoTrending"),
          newOnSous: tHeader("promoNew"),
        } satisfies Record<DiscoveryPromoId, string>)
      : null;
  const showResultsHeading = textQuery != null || filterHeading != null;
  const resultsCountLabel =
    rows.length === 0
      ? textQuery != null
        ? t("searchResults.empty", { query: textQuery })
        : t("noResultsFilters")
      : t("searchResults.count", { count: rows.length });

  if (issue !== "ok") {
    return (
      <div className={cn(pageShellContentClass, "flex flex-1 flex-col py-10 md:py-14")}>
        <div className="mx-auto max-w-lg text-center">
          <p className="type-body-md text-muted-foreground">
            {t("invalidHint")}
          </p>
          <Button asChild variant="default" className="mt-6 rounded-ds-10">
            <Link href="/">{t("browseHome")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col pb-6 pt-2 md:pb-8 md:pt-3 lg:pb-0">
      <div className={discoveryPageShellClass}>
        {textQuery != null ? (
          <div className="pb-5 pt-2 md:pb-5 md:pt-1">
            <h1 className="type-h6-sb leading-snug text-foreground md:type-h4-sb md:tracking-[-0.03em]">
              {t("searchResults.title", { query: textQuery })}
            </h1>
          </div>
        ) : null}

        {filterHeading != null ? (
          <div className="pb-3 pt-2 md:pt-3">
            <h1 className="type-h6-sb leading-snug text-foreground">{filterHeading}</h1>
          </div>
        ) : null}

        {query != null && filterMeta != null ? (
          <div className="sticky top-[var(--site-navbar-height)] z-40 bg-background">
            <DiscoveryPageHeader query={query} filterMeta={filterMeta} />
          </div>
        ) : null}

        <div
          className={cn(
            "mt-3 flex min-h-0 flex-col gap-6",
            "lg:mt-0 lg:grid lg:min-h-[calc(100dvh-10rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-0",
          )}
        >
          <p
            className={cn(
              "pt-3 lg:col-start-1 lg:row-start-1 lg:self-start lg:pr-6 lg:pt-4",
              rows.length === 0
                ? "type-body-md text-muted-foreground"
                : "text-sm text-muted-foreground",
            )}
          >
            {showResultsHeading
              ? resultsCountLabel
              : rows.length === 0
                ? t("noResultsFilters")
                : t("summary", { count: rows.length })}
          </p>

          <div
            className={cn("flex min-h-0 flex-col", LIST_SCROLL, "lg:col-start-1 lg:row-start-2 lg:mt-6 lg:pr-6")}
          >
            {rows.length > 0 ? (
              <>
                <div className="flex min-h-0 flex-col divide-y divide-border">
                  {visibleRows.map((row) => (
                    <DiscoveryVendorRowView key={row.slug} row={row} orderCta={t("orderCta")} />
                  ))}
                </div>
                <div ref={sentinelRef} className="h-4 shrink-0" aria-hidden />
              </>
            ) : null}
          </div>

          <div
            className={cn(
              "hidden min-h-0 min-w-0 discovery-map-bleed-right",
              MAP_STICKY,
              "lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex",
            )}
          >
            {query != null && searchGeo != null ? (
              <DiscoveryMap
                className="h-[min(40vh,22rem)] w-full min-h-[12rem] rounded-none lg:min-h-0 lg:flex-1"
                center={{ lat: searchGeo.centerLat, lng: searchGeo.centerLng }}
                radiusKm={searchGeo.radiusKm}
                showSearchRadius={(query.location?.trim() ?? "").length > 0}
                vendors={rows}
                mapAriaLabel={t("mapTitle")}
                userPinTooltip={
                  (query.location?.trim() ?? "").length > 0
                    ? t("mapUserPinNamed", { label: query.location!.trim() })
                    : t("mapUserPin")
                }
                userPinPopupHint={t("mapUserPinHint")}
              />
            ) : null}
          </div>
        </div>
      </div>

      {query != null && searchGeo != null ? (
        <>
          <Button
            type="button"
            size="lg"
            onClick={() => setMobileMapOpen(true)}
            className={cn(
              "fixed z-30 gap-2 rounded-ds-10 px-5 py-0 text-sm font-semibold text-white shadow-lg transition-opacity duration-200 lg:hidden",
              "h-11 min-h-11 bg-ds-blue-600 hover:bg-ds-blue-900 active:bg-ds-blue-900",
              "[&_svg]:size-5 [&_svg]:text-white",
              "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
              mobileMapOpen && "pointer-events-none opacity-0",
            )}
            aria-expanded={mobileMapOpen}
            aria-controls="discovery-mobile-map-explore"
          >
            <MapTrifoldIcon className="text-white" weight="fill" aria-hidden />
            {tm("exploreMap")}
          </Button>

          <div id="discovery-mobile-map-explore" className="lg:hidden">
            <DiscoveryMobileMapExplore
              open={mobileMapOpen}
              onOpenChange={setMobileMapOpen}
              rows={rows}
              query={query}
              searchGeo={searchGeo}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
