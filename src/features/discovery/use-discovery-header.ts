"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { getSearchCategoryIds } from "@/lib/data/search-categories";
import { formatIsoDateField, parseIsoDateString } from "@/lib/dates";
import type { DiscoveryPromoId, DiscoverySearchState } from "@/lib/discovery/discovery-query";
import {
  discoveryHref,
  hasDiscoveryLocation,
  mergeDiscoveryQuery,
  searchCategoryUsesDateFilter,
} from "@/lib/discovery/discovery-query";
import { useMdLayout } from "@/hooks/use-md-layout";
import { useRouter } from "@/i18n/navigation";
import type { DiscoveryFilterMeta } from "@/types/discovery";

export interface DiscoveryPageHeaderProps {
  query: DiscoverySearchState;
  filterMeta: DiscoveryFilterMeta;
}

const SEARCH_CATEGORY_IDS = getSearchCategoryIds();

export function useDiscoveryHeaderState({ query, filterMeta }: DiscoveryPageHeaderProps) {
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
      push({ location: label.length > 0 ? label : null, placeId: null });
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
      { value: "all" as const, label: t("categoryAll"), description: t("categoryAllDescription") },
      ...SEARCH_CATEGORY_IDS.map((id) => ({
        value: id,
        label: tHome(`categories.${id}`),
        description: tHome(`categories.${id}Description`),
      })),
    ],
    [t, tHome],
  );

  const locationPickerLabels = useMemo(
    () => ({
      placeholder: tHome("locationPicker.placeholder"),
      useCurrentLocation: tHome("locationPicker.useCurrentLocation"),
      locating: tHome("locationPicker.locating"),
      locationFallback: tHome("locationPicker.currentLocationResult"),
      recent: tHome("locationPicker.recent"),
    }),
    [tHome],
  );

  const categoryDisplay =
    categoryOptions.find((o) => o.value === query.category)?.label ?? query.category;
  const dateValue = useMemo(() => parseIsoDateString(query.dateIso), [query.dateIso]);
  const dateDisplay = formatIsoDateField(query.dateIso, locale, t("datePlaceholder"));
  const showDateField = searchCategoryUsesDateFilter(query.category);
  const locationRaw = query.location?.trim() ?? "";
  const locationDisplay = locationRaw || t("locationPlaceholder");
  const hasLocation = hasDiscoveryLocation(query);

  const cuisineCount = query.cuisines.length;
  const cuisinePillValue =
    cuisineCount === 0 ? t("cuisinePlaceholder") : t("cuisineCount", { count: cuisineCount });

  const moreActiveCount = query.prices.length + query.tags.length + query.promos.length;
  const morePillValue =
    moreActiveCount === 0 ? t("morePlaceholder") : t("moreCount", { count: moreActiveCount });

  const applyCuisine = useCallback(() => {
    push({ cuisines: [...draftCuisines].sort((a, b) => a.localeCompare(b)) });
    setOpenCuisine(false);
  }, [draftCuisines, push]);

  const applyMore = useCallback(() => {
    push({
      cuisines: [...draftCuisines].sort((a, b) => a.localeCompare(b)),
      prices: [...draftPrices].sort((a, b) => a - b),
      tags: [...draftTags].sort((a, b) => a.localeCompare(b)),
      promos: [...draftPromos],
    });
    setOpenMore(false);
  }, [draftCuisines, draftPrices, draftPromos, draftTags, push]);

  const clearMore = useCallback(() => {
    setDraftCuisines(new Set());
    setDraftPrices(new Set());
    setDraftTags(new Set());
    setDraftPromos(new Set());
  }, []);

  return {
    t,
    tHome,
    locale,
    layout,
    push,
    pending: layout === "pending",
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
    locationPickerLabels,
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
  };
}

