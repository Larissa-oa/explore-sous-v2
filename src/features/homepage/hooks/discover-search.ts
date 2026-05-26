"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useMdLayout } from "@/hooks/use-md-layout";
import { useRouter } from "@/i18n/navigation";
import { getSearchCategoryIds } from "@/lib/data/search-categories";
import { formatOptionalDateField } from "@/lib/dates";
import {
  discoveryDateIsoForCategory,
  discoveryHref,
  searchCategoryUsesDateFilter,
} from "@/lib/discovery/discovery-query";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import {
  NAVBAR_DISCOVER_SEARCH_SCROLL_VH,
  SEARCH_PICKER_CLOSE_SCROLL_VH,
  SITE_HEADER_HEIGHT_CSS_VAR,
  SITE_HOME_HERO_SEARCH_ELEMENT_ID,
} from "@/lib/site-layout";
import type { SearchCategoryId } from "@/types/search";

const CATEGORY_IDS = getSearchCategoryIds();

export type DiscoverSearchField = "category" | "location" | "date";

/** Form state + labels for hero and navbar discover search. */
export function useDiscoverSearchBar() {
  const t = useTranslations("HomePage.search");
  const locale = useLocale();
  const layout = useMdLayout();
  const router = useRouter();
  const [category, setCategory] = useState<SearchCategoryId>("delivery");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const showDateField = searchCategoryUsesDateFilter(category);
  const pending = layout === "pending";

  const categoryOptions = useMemo(
    () =>
      CATEGORY_IDS.map((id) => ({
        value: id,
        label: t(`categories.${id}`),
        description: t(`categories.${id}Description`),
      })),
    [t],
  );

  const locationPickerLabels = useMemo(
    () => ({
      placeholder: t("locationPicker.placeholder"),
      useCurrentLocation: t("locationPicker.useCurrentLocation"),
      locating: t("locationPicker.locating"),
      locationFallback: t("locationPicker.currentLocationResult"),
      recent: t("locationPicker.recent"),
    }),
    [t],
  );

  const categoryDisplay =
    categoryOptions.find((o) => o.value === category)?.label ?? t("categoryPlaceholder");
  const locationRaw = location?.trim() ?? "";
  const locationDisplay = locationRaw || t("locationPlaceholder");
  const dateDisplay = formatOptionalDateField(selectedDate, locale, t("whenPlaceholder"));

  function selectCategory(next: SearchCategoryId) {
    setCategory(next);
    if (!searchCategoryUsesDateFilter(next)) setSelectedDate(null);
  }

  function handleDiscoverSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const locTrim = location?.trim() ?? "";
    const q: DiscoverySearchState = {
      category,
      q: null,
      dateIso: discoveryDateIsoForCategory(category, selectedDate),
      location: locTrim.length > 0 ? locTrim : null,
      placeId: null,
      cuisines: [],
      prices: [],
      tags: [],
      promos: [],
    };
    router.push(discoveryHref(q));
  }

  return {
    t,
    locale,
    layout,
    pending,
    category,
    selectCategory,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
    showDateField,
    categoryOptions,
    locationPickerLabels,
    categoryDisplay,
    locationDisplay,
    locationRaw,
    dateDisplay,
    handleDiscoverSubmit,
  };
}

/** One open desktop popover at a time; optional auto-close on window scroll. */
export function useDiscoverSearchPickers(closeOnScroll = false) {
  const [open, setOpen] = useState<DiscoverSearchField | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!closeOnScroll || open == null) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) >= window.innerHeight * SEARCH_PICKER_CLOSE_SCROLL_VH) {
        close();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [closeOnScroll, open, close]);

  const bind = (field: DiscoverSearchField) => ({
    open: open === field,
    onOpenChange: (next: boolean) => setOpen(next ? field : null),
  });

  return { close, bind };
}

function headerBottomPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    SITE_HEADER_HEIGHT_CSS_VAR,
  );
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 60;
}

/** Show navbar discover search after hero scroll (home) or 10vh (other routes). Never on /discover. */
export function useNavbarDiscoverSearchVisible(isHomeRoute: boolean, isDiscoverRoute: boolean) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isDiscoverRoute) {
      setVisible(false);
      return;
    }

    const update = () => {
      if (isHomeRoute) {
        const el = document.getElementById(SITE_HOME_HERO_SEARCH_ELEMENT_ID);
        if (!el) {
          setVisible(false);
          return;
        }
        setVisible(el.getBoundingClientRect().bottom <= headerBottomPx());
        return;
      }
      setVisible(window.scrollY >= window.innerHeight * NAVBAR_DISCOVER_SEARCH_SCROLL_VH);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHomeRoute, isDiscoverRoute]);

  return visible;
}
