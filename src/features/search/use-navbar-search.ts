"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { discoveryTextSearchHref } from "@/lib/discovery/discovery-query";

export const SUGGEST_DEBOUNCE_MS = 180;

export function useDebouncedValue<T>(value: T, delayMs = SUGGEST_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function useNavbarSearchLabels() {
  const t = useTranslations("SiteNavbar.search");
  const tRail = useTranslations("HomePage.listingRail");
  const popularLabel = useCallback((id: string) => t(`popular.${id}` as "popular.italian"), [t]);

  return {
    placeholder: t("placeholder"),
    close: t("close"),
    clear: t("clear"),
    clearAria: t("clearInput"),
    popularTitle: t("popularTitle"),
    featuredTitle: t("featured"),
    searchFor: (query: string) => t("searchFor", { query }),
    popularLabel,
    railNav: {
      prev: tRail("prev"),
      next: tRail("next"),
      region: tRail("region"),
    },
  };
}

export function useNavbarSearchQuery() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const clearQuery = useCallback(() => setQuery(""), []);

  const navigateToSearch = useCallback(
    (value: string) => {
      router.push(discoveryTextSearchHref(value));
      clearQuery();
    },
    [clearQuery, router],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>, onClose?: () => void) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (event.key === "Enter" && trimmed.length > 0) {
        event.preventDefault();
        onClose?.();
        navigateToSearch(trimmed);
      }
    },
    [navigateToSearch, trimmed],
  );

  return { query, setQuery, trimmed, clearQuery, navigateToSearch, handleKeyDown };
}

/** Close overlay when crossing the `md` breakpoint (mobile search only). */
export function useCloseWhenMd(open: boolean, onClose: () => void) {
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onCrossMd = () => {
      if (mq.matches && open) onClose();
    };
    mq.addEventListener("change", onCrossMd);
    return () => mq.removeEventListener("change", onCrossMd);
  }, [onClose, open]);
}
