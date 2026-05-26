"use client";

import { useMemo } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { carouselInterCardGapClass, ListingRail, ListingRailSlide } from "@/components/carousel";
import { navbarSearchRailSlideBasis } from "@/components/carousel/presets";
import { PartnerListingCard } from "@/features/homepage/components/partner-listing-card";
import { Link } from "@/i18n/navigation";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import { buildNavbarSearchSuggestions } from "@/lib/search/navbar-search-suggestions";
import type { PartnerListing } from "@/types/home";
import type { SearchSuggestVendor } from "@/types/search";
import { cn } from "@/lib/utils";

import { useDebouncedValue, useNavbarSearchLabels } from "./use-navbar-search";

const suggestionRowClass =
  "flex w-full items-center gap-3 rounded-ds-8 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const railBleedClass = "-mr-4 w-[calc(100%+1rem)]";

export function NavbarSearchPanelBody({
  panel,
  query,
  suggestVendors,
  labels,
  onNavigate,
  onSelect,
}: {
  panel: NavbarSearchPanelData;
  query: string;
  suggestVendors: SearchSuggestVendor[];
  labels: ReturnType<typeof useNavbarSearchLabels>;
  onNavigate: () => void;
  onSelect: (value: string) => void;
}) {
  const trimmed = query.trim();
  const debouncedQuery = useDebouncedValue(query);
  const suggestions = useMemo(
    () =>
      trimmed.length > 0 ? buildNavbarSearchSuggestions(suggestVendors, debouncedQuery) : [],
    [debouncedQuery, suggestVendors, trimmed.length],
  );

  if (trimmed.length > 0) {
    return (
      <ul className="flex flex-col py-1" role="listbox">
        {suggestions.map((s) => (
          <li key={s.slug} role="presentation">
            <button
              type="button"
              role="option"
              className={suggestionRowClass}
              onClick={() => onSelect(s.name)}
            >
              <MagnifyingGlassIcon
                className="size-4 shrink-0 text-muted-foreground"
                weight="regular"
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.name}</span>
                {s.subtitle ? (
                  <span className="block truncate text-xs text-muted-foreground">{s.subtitle}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
        <li role="presentation">
          <button
            type="button"
            role="option"
            className={cn(suggestionRowClass, "text-primary")}
            onClick={() => onSelect(trimmed)}
          >
            <MagnifyingGlassIcon className="size-4 shrink-0" weight="regular" aria-hidden />
            <span className="min-w-0 truncate font-medium">{labels.searchFor(trimmed)}</span>
          </button>
        </li>
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="type-body-sm-sb px-1 text-muted-foreground">{labels.popularTitle}</p>
        <ul className="mt-2 flex flex-col" role="list">
          {panel.popularSearches.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={suggestionRowClass} onClick={onNavigate}>
                <MagnifyingGlassIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  weight="regular"
                  aria-hidden
                />
                <span className="min-w-0 truncate">{labels.popularLabel(item.id)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {panel.featuredVendors.length > 0 ? (
        <ListingRail
          title={labels.featuredTitle}
          navLabels={labels.railNav}
          slideBasisClassName={navbarSearchRailSlideBasis}
          trackBleedClassName={railBleedClass}
          trackClassName={cn("pl-0 pr-0", carouselInterCardGapClass)}
          titleClassName="px-1 type-h6-sb leading-none text-foreground"
          headerRowClassName="items-center gap-3"
          headerLeadClassName="min-h-9 flex-row items-center gap-0 py-0"
          navClassName="flex shrink-0 items-center gap-1 self-center p-0 pt-0"
          className="!py-0 [&_[data-slot=carousel]]:gap-4"
        >
          {panel.featuredVendors.map((item: PartnerListing) => (
            <ListingRailSlide key={item.id}>
              <PartnerListingCard
                item={item}
                showPrice={false}
                showTitleArrow={false}
                onNavigate={onNavigate}
              />
            </ListingRailSlide>
          ))}
        </ListingRail>
      ) : null}
    </div>
  );
}
