"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CalendarBlankIcon,
  CaretDownIcon,
  CurrencyEurIcon,
  FadersHorizontalIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { CalendarPicker } from "@/components/pickers/calendar-picker";
import { LocationPicker } from "@/components/pickers/location-picker";
import { Button } from "@/components/ui/button";
import { SearchPickerWrap } from "@/components/search/search-picker-wrap";
import { getSearchCategoryIds } from "@/lib/data/search-categories";
import type {
  DiscoveryPromoId,
  DiscoverySearchState,
} from "@/lib/discovery/discovery-query";
import {
  discoveryHref,
  hasDiscoveryLocation,
  mergeDiscoveryQuery,
  searchCategoryUsesDateFilter,
} from "@/lib/discovery/discovery-query";
import { useMdLayout } from "@/hooks/use-md-layout";
import { formatIsoDateField, parseIsoDateString, toIsoDateString } from "@/lib/dates";
import { useRouter } from "@/i18n/navigation";
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

const SEARCH_CATEGORY_IDS = getSearchCategoryIds();

export interface DiscoveryPageHeaderProps {
  query: DiscoverySearchState;
  filterMeta: DiscoveryFilterMeta;
}

export function DiscoveryPageHeader({ query, filterMeta }: DiscoveryPageHeaderProps) {
  const t = useTranslations("Discovery.header");
  const tHome = useTranslations("HomePage.search");
  const locale = useLocale();
  const layout = useMdLayout();
  const router = useRouter();
  const push = useCallback(
    (patch: Partial<DiscoverySearchState>) => {
      router.push(discoveryHref(mergeDiscoveryQuery(query, patch)));
    },
    [query, router],
  );

  const [openCat, setOpenCat] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openLoc, setOpenLoc] = useState(false);
  const [openCuisine, setOpenCuisine] = useState(false);
  const [openMore, setOpenMore] = useState(false);

  const [locDraft, setLocDraft] = useState<string | null>(() => query.location?.trim() || null);

  const [draftCuisines, setDraftCuisines] = useState<Set<string>>(() => new Set(query.cuisines));
  const [draftPrices, setDraftPrices] = useState<Set<number>>(() => new Set(query.prices));
  const [draftTags, setDraftTags] = useState<Set<string>>(() => new Set(query.tags));
  const [draftPromos, setDraftPromos] = useState<Set<DiscoveryPromoId>>(() => new Set(query.promos));

  const applyLocation = useCallback(
    (location: string | null) => {
      const label = location?.trim() ?? "";
      push({
        location: label.length > 0 ? label : null,
        placeId: null,
      });
    },
    [push],
  );

  const onLocOpenChange = useCallback(
    (o: boolean) => {
      if (o) setLocDraft(query.location?.trim() || null);
      setOpenLoc(o);
    },
    [query.location],
  );

  const onCuisineOpenChange = useCallback(
    (o: boolean) => {
      if (o) setDraftCuisines(new Set(query.cuisines));
      setOpenCuisine(o);
    },
    [query.cuisines],
  );

  const onMoreOpenChange = useCallback(
    (o: boolean) => {
      if (o) {
        setDraftCuisines(new Set(query.cuisines));
        setDraftPrices(new Set(query.prices));
        setDraftTags(new Set(query.tags));
        setDraftPromos(new Set(query.promos));
      }
      setOpenMore(o);
    },
    [query.cuisines, query.prices, query.promos, query.tags],
  );

  const categoryOptions = useMemo(
    () => [
      {
        value: "all" as const,
        label: t("categoryAll"),
        icon: <SearchCategoryOptionIcon id="all" />,
      },
      ...SEARCH_CATEGORY_IDS.map((key) => ({
        value: key,
        label: tHome(`categories.${key}`),
        icon: <SearchCategoryOptionIcon id={key} />,
      })),
    ],
    [t, tHome],
  );

  const categoryDisplay =
    categoryOptions.find((o) => o.value === query.category)?.label ?? query.category;

  const dateValue = useMemo(
    () => parseIsoDateString(query.dateIso),
    [query.dateIso],
  );

  const dateDisplay = formatIsoDateField(query.dateIso, locale, t("datePlaceholder"));
  const showDateField = searchCategoryUsesDateFilter(query.category);

  const locationRaw = query.location?.trim() ?? "";
  const locationDisplay = locationRaw || t("locationPlaceholder");

  const cuisineCount = query.cuisines.length;
  const cuisinePillValue =
    cuisineCount === 0 ? t("cuisinePlaceholder") : t("cuisineCount", { count: cuisineCount });

  const moreActiveCount =
    query.prices.length + query.tags.length + query.promos.length;
  const morePillValue =
    moreActiveCount === 0 ? t("morePlaceholder") : t("moreCount", { count: moreActiveCount });

  const pending = layout === "pending";

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
              className={cn(
                searchOptionRow,
                selected ? searchOptionSelected : searchOptionIdle,
              )}
              onClick={() => {
                setOpenCat(false);
                push({ category: opt.value as DiscoveryCategoryId });
              }}
            >
              {opt.icon}
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
          setOpenLoc(false);
        }}
        onClose={() => setOpenLoc(false)}
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
            setOpenLoc(false);
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
          onCheckedChange={(on) => {
            setDraftCuisines((prev) => {
              const next = new Set(prev);
              if (on) next.add(c);
              else next.delete(c);
              return next;
            });
          }}
        />
      ))}
    </div>
  );

  const cuisineFooter = (
    <ModalFooter
      clearLabel={t("clearFilters")}
      applyLabel={t("applyFilters")}
      onClear={() => setDraftCuisines(new Set())}
      onApply={() => {
        push({ cuisines: [...draftCuisines].sort((a, b) => a.localeCompare(b)) });
        setOpenCuisine(false);
      }}
    />
  );

  const priceLabels = [1, 2, 3, 4] as const;
  const moreBody = (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="type-body-md-sb text-foreground">{t("sectionCuisine")}</h3>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {filterMeta.cuisines.map((c, i) => (
            <CheckboxRow
              key={`m-${c}`}
              id={`d-more-c-${i}`}
              label={c}
              checked={draftCuisines.has(c)}
              onCheckedChange={(on) => {
                setDraftCuisines((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(c);
                  else next.delete(c);
                  return next;
                });
              }}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="type-body-md-sb text-foreground">{t("sectionPrice")}</h3>
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
                  <span className="sr-only">{t("priceTierAria", { level: n })}</span>
                </>
              }
              checked={draftPrices.has(n)}
              onCheckedChange={(on) => {
                setDraftPrices((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(n);
                  else next.delete(n);
                  return next;
                });
              }}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="type-body-md-sb text-foreground">{t("sectionTags")}</h3>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {filterMeta.tags.map((tag, i) => (
            <CheckboxRow
              key={tag}
              id={`d-more-tag-${i}`}
              label={tag}
              checked={draftTags.has(tag)}
              onCheckedChange={(on) => {
                setDraftTags((prev) => {
                  const next = new Set(prev);
                  if (on) next.add(tag);
                  else next.delete(tag);
                  return next;
                });
              }}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="type-body-md-sb text-foreground">{t("sectionPromo")}</h3>
        <div className="mt-2 flex flex-col gap-1">
          <CheckboxRow
            id="promo-trending"
            label={t("promoTrending")}
            checked={draftPromos.has("trendingNow")}
            onCheckedChange={(on) =>
              setDraftPromos((prev) => {
                const next = new Set(prev);
                if (on) next.add("trendingNow");
                else next.delete("trendingNow");
                return next;
              })
            }
          />
          <CheckboxRow
            id="promo-new"
            label={t("promoNew")}
            checked={draftPromos.has("newOnSous")}
            onCheckedChange={(on) =>
              setDraftPromos((prev) => {
                const next = new Set(prev);
                if (on) next.add("newOnSous");
                else next.delete("newOnSous");
                return next;
              })
            }
          />
        </div>
      </section>
    </div>
  );

  const moreFooter = (
    <ModalFooter
      clearLabel={t("clearFilters")}
      applyLabel={t("applyFilters")}
      onClear={() => {
        setDraftCuisines(new Set());
        setDraftPrices(new Set());
        setDraftTags(new Set());
        setDraftPromos(new Set());
      }}
      onApply={() => {
        push({
          cuisines: [...draftCuisines].sort((a, b) => a.localeCompare(b)),
          prices: [...draftPrices].sort((a, b) => a - b),
          tags: [...draftTags].sort((a, b) => a.localeCompare(b)),
          promos: [...draftPromos],
        });
        setOpenMore(false);
      }}
    />
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
                  hasDiscoveryLocation(query) ? PILL_ACTIVE : undefined,
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

          <span className="mx-0.5 hidden h-7 w-px shrink-0 self-center bg-border md:inline-block" aria-hidden />

          <button
            type="button"
            disabled={pending}
            className={cn(PILL_BASE, cuisineCount > 0 && PILL_ACTIVE)}
            aria-label={`${t("cuisineLabel")}: ${cuisinePillValue}`}
            onClick={() => setOpenCuisine(true)}
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
            onClick={() => setOpenMore(true)}
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
        footer={cuisineFooter}
      >
        {cuisineBody}
      </FilterModalShell>

      <FilterModalShell
        layout={layout}
        open={openMore}
        onOpenChange={onMoreOpenChange}
        title={t("moreModalTitle")}
        footer={moreFooter}
      >
        {moreBody}
      </FilterModalShell>
    </>
  );
}
