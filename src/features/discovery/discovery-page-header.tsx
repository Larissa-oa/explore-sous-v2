"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  CalendarBlankIcon,
  CaretDownIcon,
  CurrencyEurIcon,
  FadersHorizontalIcon,
  MapPinIcon,
} from "@phosphor-icons/react";

import { CalendarPicker } from "@/components/pickers/calendar-picker";
import { LocationPicker } from "@/components/pickers/location-picker";
import { Button } from "@/components/ui/button";
import { SearchPickerWrap } from "@/components/search/search-picker-wrap";
import { toIsoDateString } from "@/lib/dates";
import type { DiscoveryPromoId } from "@/lib/discovery/discovery-query";
import type { DiscoveryFilterMeta } from "@/types/discovery";
import type { DiscoveryCategoryId } from "@/types/search";
import { cn } from "@/lib/utils";

import {
  DiscoveryHeaderCategoryIcon as SearchCategoryOptionIcon,
  DiscoveryHeaderCheckboxRow as CheckboxRow,
  DiscoveryHeaderFieldTrigger as FieldTrigger,
  DiscoveryHeaderFilterModalShell as FilterModalShell,
  DiscoveryHeaderModalFooter as ModalFooter,
  discoveryPillActiveClass as PILL_ACTIVE,
  discoveryPillBaseClass as PILL_BASE,
  discoverySearchOptionIdle as searchOptionIdle,
  discoverySearchOptionList as searchOptionList,
  discoverySearchOptionRow as searchOptionRow,
  discoverySearchOptionSelected as searchOptionSelected,
} from "./discovery-header-primitives";
import { useDiscoveryHeaderState, type DiscoveryPageHeaderProps } from "./use-discovery-header";

export type { DiscoveryPageHeaderProps } from "./use-discovery-header";

// —— More filters panel body ————————————————————————————————————————————————

function toggleSet<T>(prev: Set<T>, value: T, on: boolean): Set<T> {
  const next = new Set(prev);
  if (on) next.add(value);
  else next.delete(value);
  return next;
}

interface DiscoveryMoreFiltersBodyProps {
  filterMeta: DiscoveryFilterMeta;
  draftCuisines: Set<string>;
  setDraftCuisines: Dispatch<SetStateAction<Set<string>>>;
  draftPrices: Set<number>;
  setDraftPrices: Dispatch<SetStateAction<Set<number>>>;
  draftTags: Set<string>;
  setDraftTags: Dispatch<SetStateAction<Set<string>>>;
  draftPromos: Set<DiscoveryPromoId>;
  setDraftPromos: Dispatch<SetStateAction<Set<DiscoveryPromoId>>>;
  priceTierAriaLabel: (n: number) => string;
  sectionLabels: {
    cuisine: string;
    price: string;
    tags: string;
    promo: string;
    promoTrending: string;
    promoNew: string;
  };
}

function DiscoveryMoreFiltersBody({
  filterMeta,
  draftCuisines,
  setDraftCuisines,
  draftPrices,
  setDraftPrices,
  draftTags,
  setDraftTags,
  draftPromos,
  setDraftPromos,
  priceTierAriaLabel,
  sectionLabels,
}: DiscoveryMoreFiltersBodyProps) {
  const priceLabels = [1, 2, 3, 4] as const;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="type-body-md-sb text-foreground">{sectionLabels.cuisine}</h3>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {filterMeta.cuisines.map((c, i) => (
            <CheckboxRow
              key={`m-${c}`}
              id={`d-more-c-${i}`}
              label={c}
              checked={draftCuisines.has(c)}
              onCheckedChange={(on) => setDraftCuisines((prev) => toggleSet(prev, c, on))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-body-md-sb text-foreground">{sectionLabels.price}</h3>
        <div className="mt-2 flex flex-col gap-1">
          {priceLabels.map((n) => (
            <CheckboxRow
              key={n}
              id={`price-${n}`}
              label={
                <>
                  <span className="inline-flex items-center gap-px text-foreground" aria-hidden>
                    {Array.from({ length: n }, (_, i) => (
                      <CurrencyEurIcon
                        key={i}
                        className="size-[1.0625rem] shrink-0"
                        weight="bold"
                        aria-hidden
                      />
                    ))}
                  </span>
                  <span className="sr-only">{priceTierAriaLabel(n)}</span>
                </>
              }
              checked={draftPrices.has(n)}
              onCheckedChange={(on) => setDraftPrices((prev) => toggleSet(prev, n, on))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-body-md-sb text-foreground">{sectionLabels.tags}</h3>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {filterMeta.tags.map((tag, i) => (
            <CheckboxRow
              key={tag}
              id={`d-more-tag-${i}`}
              label={tag}
              checked={draftTags.has(tag)}
              onCheckedChange={(on) => setDraftTags((prev) => toggleSet(prev, tag, on))}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-body-md-sb text-foreground">{sectionLabels.promo}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <CheckboxRow
            id="promo-trending"
            label={sectionLabels.promoTrending}
            checked={draftPromos.has("trendingNow")}
            onCheckedChange={(on) =>
              setDraftPromos((prev) => toggleSet<DiscoveryPromoId>(prev, "trendingNow", on))
            }
          />
          <CheckboxRow
            id="promo-new"
            label={sectionLabels.promoNew}
            checked={draftPromos.has("newOnSous")}
            onCheckedChange={(on) =>
              setDraftPromos((prev) => toggleSet<DiscoveryPromoId>(prev, "newOnSous", on))
            }
          />
        </div>
      </section>
    </div>
  );
}

// —— Main header component ——————————————————————————————————————————————————

export function DiscoveryPageHeader(props: DiscoveryPageHeaderProps) {
  const {
    t, tHome, locale, layout, push, pending,
    openCat, setOpenCat,
    openDate, setOpenDate,
    openLoc, onLocOpenChange,
    openCuisine, onCuisineOpenChange,
    openMore, onMoreOpenChange,
    locDraft, setLocDraft,
    applyLocation,
    draftCuisines, setDraftCuisines,
    draftPrices, setDraftPrices,
    draftTags, setDraftTags,
    draftPromos, setDraftPromos,
    categoryOptions,
    categoryDisplay,
    dateValue,
    dateDisplay,
    showDateField,
    locationRaw,
    locationDisplay,
    hasLocation,
    cuisineCount,
    cuisinePillValue,
    moreActiveCount,
    morePillValue,
    applyCuisine,
    applyMore,
    clearMore,
    filterMeta,
    query,
  } = useDiscoveryHeaderState(props);

  const categoryPanel = (
    <ul className={cn(searchOptionList, "flex flex-col gap-1")} role="listbox">
      {categoryOptions.map((opt) => {
        const selected = opt.value === query.category;
        return (
          <li key={opt.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              className={cn(searchOptionRow, selected ? searchOptionSelected : searchOptionIdle)}
              onClick={() => {
                setOpenCat(false);
                push({ category: opt.value as DiscoveryCategoryId });
              }}
            >
              <SearchCategoryOptionIcon id={opt.value} />
              <span className="min-w-0 flex-1 truncate">{opt.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const datePanel = (
    <div className="flex flex-col">
      <CalendarPicker
        value={dateValue}
        onChange={(d) => {
          push({ dateIso: toIsoDateString(d) });
          setOpenDate(false);
        }}
        confirmSelection={layout === "mobile"}
        selectDateLabel={tHome("calendar.selectDate")}
        prevMonthLabel={tHome("calendar.prevMonth")}
        nextMonthLabel={tHome("calendar.nextMonth")}
        weekdayShort={(k) => tHome(`calendar.weekdaysShort.${k}`)}
        locale={locale}
        density={layout === "desktop" ? "compact" : "default"}
      />
      {query.dateIso ? (
        <div className={cn("border-t border-border", layout === "desktop" ? "p-3" : "p-4")}>
          <Button
            type="button"
            variant="ghost"
            className="h-11 w-full rounded-search-inner text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => {
              push({ dateIso: null });
              setOpenDate(false);
            }}
          >
            {t("clearDate")}
          </Button>
        </div>
      ) : null}
    </div>
  );

  const locationPanel = (
    <div className="flex flex-col">
      <LocationPicker
        value={locDraft}
        onChange={setLocDraft}
        onClearApplied={() => {
          setLocDraft(null);
          applyLocation(null);
          onLocOpenChange(false);
        }}
        onClose={() => onLocOpenChange(false)}
        locale={locale}
        title={tHome("locationPicker.title")}
        clearLabel={tHome("locationPicker.clear")}
        closeLabel={tHome("locationPicker.close")}
        placeholder={tHome("locationPicker.placeholder")}
        useCurrentLocationLabel={tHome("locationPicker.useCurrentLocation")}
        locatingLabel={tHome("locationPicker.locating")}
        locationFallbackLabel={tHome("locationPicker.currentLocationResult")}
        density={layout === "desktop" ? "compact" : "default"}
      />
      <div className={cn("border-t border-border", layout === "desktop" ? "p-3" : "p-4")}>
        <Button
          type="button"
          className={cn(
            "w-full rounded-search-inner bg-ds-blue-600 text-sm font-medium text-white hover:bg-ds-blue-900",
            layout === "desktop" ? "h-9" : "h-11",
          )}
          onClick={() => {
            applyLocation(locDraft);
            onLocOpenChange(false);
          }}
        >
          {t("applyLocation")}
        </Button>
      </div>
    </div>
  );

  const cuisineBody = (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-4">
      {filterMeta.cuisines.map((c, i) => (
        <CheckboxRow
          key={c}
          id={`d-cuisine-${i}`}
          label={c}
          checked={draftCuisines.has(c)}
          onCheckedChange={(on) =>
            setDraftCuisines((prev) => toggleSet(prev, c, on))
          }
        />
      ))}
    </div>
  );

  return (
    <>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <SearchPickerWrap
            variant="discovery"
            layout={layout}
            open={openCat}
            onOpenChange={setOpenCat}
            sheetTitle={tHome("categoryLabel")}
            popoverWidthClass="w-64"
            trigger={
              <FieldTrigger
                label={tHome("categoryLabel")}
                value={categoryDisplay}
                disabled={pending}
                className={cn(PILL_ACTIVE)}
              />
            }
            panel={categoryPanel}
          />

          <SearchPickerWrap
            variant="discovery"
            layout={layout}
            open={openLoc}
            onOpenChange={onLocOpenChange}
            sheetTitle={tHome("locationLabel")}
            popoverWidthClass="w-80 max-w-[min(100vw-2rem,20rem)]"
            trigger={
              <FieldTrigger
                label={tHome("locationLabel")}
                value={locationDisplay}
                valueTitle={locationRaw || undefined}
                disabled={pending}
                icon={<MapPinIcon className="size-4" weight="bold" aria-hidden />}
                className={cn(
                  "max-w-[9rem] sm:max-w-[11rem] md:max-w-none",
                  hasLocation ? PILL_ACTIVE : undefined,
                )}
              />
            }
            panel={locationPanel}
          />

          {showDateField ? (
            <SearchPickerWrap
              variant="discovery"
              layout={layout}
              open={openDate}
              onOpenChange={setOpenDate}
              sheetTitle={tHome("whenLabel")}
              popoverWidthClass="w-[min(100vw-2rem,17.5rem)]"
              trigger={
                <FieldTrigger
                  label={t("dateLabel")}
                  value={dateDisplay}
                  disabled={pending}
                  icon={<CalendarBlankIcon className="size-4" weight="regular" aria-hidden />}
                  className={cn(query.dateIso ? PILL_ACTIVE : undefined)}
                />
              }
              panel={datePanel}
            />
          ) : null}

          <span
            className="mx-0.5 hidden h-7 w-px shrink-0 self-center bg-border md:inline-block"
            aria-hidden
          />

          <button
            type="button"
            disabled={pending}
            className={cn(PILL_BASE, cuisineCount > 0 && PILL_ACTIVE)}
            aria-label={`${t("cuisineLabel")}: ${cuisinePillValue}`}
            onClick={() => onCuisineOpenChange(true)}
          >
            <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold leading-tight text-inherit">
              {cuisinePillValue}
            </span>
            <CaretDownIcon className="size-4 shrink-0 text-inherit" aria-hidden weight="bold" />
          </button>

          <button
            type="button"
            disabled={pending}
            className={cn(PILL_BASE, moreActiveCount > 0 && PILL_ACTIVE)}
            aria-label={`${t("moreLabel")}: ${morePillValue}`}
            onClick={() => onMoreOpenChange(true)}
          >
            <FadersHorizontalIcon className="size-4 shrink-0 text-inherit" weight="bold" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold leading-tight text-inherit">
              {morePillValue}
            </span>
            <CaretDownIcon className="size-4 shrink-0 text-inherit" aria-hidden weight="bold" />
          </button>
        </div>

        <div
          className="discovery-map-bleed-right h-[0.5px] min-w-0 shrink-0 bg-border"
          aria-hidden
        />
      </div>

      <FilterModalShell
        layout={layout}
        open={openCuisine}
        onOpenChange={onCuisineOpenChange}
        title={t("cuisineModalTitle")}
        footer={
          <ModalFooter
            clearLabel={t("clearFilters")}
            applyLabel={t("applyFilters")}
            onClear={() => setDraftCuisines(new Set())}
            onApply={applyCuisine}
          />
        }
      >
        {cuisineBody}
      </FilterModalShell>

      <FilterModalShell
        layout={layout}
        open={openMore}
        onOpenChange={onMoreOpenChange}
        title={t("moreModalTitle")}
        footer={
          <ModalFooter
            clearLabel={t("clearFilters")}
            applyLabel={t("applyFilters")}
            onClear={clearMore}
            onApply={applyMore}
          />
        }
      >
        <DiscoveryMoreFiltersBody
          filterMeta={filterMeta}
          draftCuisines={draftCuisines}
          setDraftCuisines={setDraftCuisines}
          draftPrices={draftPrices}
          setDraftPrices={setDraftPrices}
          draftTags={draftTags}
          setDraftTags={setDraftTags}
          draftPromos={draftPromos}
          setDraftPromos={setDraftPromos}
          priceTierAriaLabel={(n) => t("priceTierAria", { level: n })}
          sectionLabels={{
            cuisine: t("sectionCuisine"),
            price: t("sectionPrice"),
            tags: t("sectionTags"),
            promo: t("sectionPromo"),
            promoTrending: t("promoTrending"),
            promoNew: t("promoNew"),
          }}
        />
      </FilterModalShell>
    </>
  );
}
