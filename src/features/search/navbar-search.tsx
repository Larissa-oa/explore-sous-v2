"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { carouselInterCardGapClass, ListingRail, ListingRailSlide } from "@/components/carousel";
import { navbarSearchRailSlideBasis } from "@/components/carousel/presets";
import { PartnerListingCard } from "@/features/homepage/components/partner-listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import { discoveryTextSearchHref } from "@/lib/discovery/discovery-query";
import { buildNavbarSearchSuggestions } from "@/lib/search/navbar-search-suggestions";
import type { PartnerListing } from "@/types/home";
import type { SearchSuggestVendor } from "@/types/search";
import { cn } from "@/lib/utils";

const SUGGEST_DEBOUNCE_MS = 180;

const suggestionRowClass =
  "flex w-full items-center gap-3 rounded-ds-8 px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const desktopWidthClass = "w-[min(100vw-6rem,28rem)] lg:w-[32rem]";
const desktopPanelClass = cn(
  "absolute right-0 top-[calc(100%+0.5rem)] w-full",
  "max-h-[min(80vh,36rem)] overflow-y-auto overflow-x-clip rounded-ds-12 border border-border bg-background shadow-md",
  "px-4 pt-4 pb-8",
);

const railBleedClass = "-mr-4 w-[calc(100%+1rem)]";

// —— Shared client logic —————————————————————————————————————————————————————

function useDebouncedValue<T>(value: T, delayMs = SUGGEST_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function useNavbarSearchLabels() {
  const t = useTranslations("SiteNavbar.search");
  const tRail = useTranslations("HomePage.listingRail");
  const popularLabel = useCallback((id: string) => t(`popular.${id}` as "popular.italian"), [t]);

  return {
    placeholder: t("placeholder"),
    close: t("close"),
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

function useNavbarSearchQuery() {
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

// —— Panel UI ———————————————————————————————————————————————————————————————

function SearchField({
  id,
  value,
  onChange,
  onKeyDown,
  placeholder,
  ariaLabel,
  closeLabel,
  onClose,
  inputRef,
  size = "sm",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
  closeLabel: string;
  onClose: () => void;
  inputRef?: Ref<HTMLInputElement>;
  size?: "sm" | "md";
}) {
  const fieldClass =
    size === "md"
      ? "h-11 pl-9 pr-11 text-base"
      : "h-10 pl-9 pr-10 text-sm";

  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        weight="bold"
        aria-hidden
      />
      <Input
        ref={inputRef}
        id={id}
        type="search"
        name="site-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className={cn(
          "w-full rounded-ds-12 border border-border bg-background shadow-none",
          fieldClass,
          "focus-visible:border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={closeLabel}
        onClick={onClose}
      >
        <XIcon className="size-4" weight="bold" aria-hidden />
      </Button>
    </div>
  );
}

function SearchPanelBody({
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
      trimmed.length > 0
        ? buildNavbarSearchSuggestions(suggestVendors, debouncedQuery)
        : [],
    [debouncedQuery, suggestVendors, trimmed.length],
  );

  if (trimmed.length > 0) {
    return (
      <ul className="flex flex-col py-1" role="listbox">
        {suggestions.map((s) => (
          <li key={s.slug} role="presentation">
            <button type="button" role="option" className={suggestionRowClass} onClick={() => onSelect(s.name)}>
              <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" weight="regular" aria-hidden />
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
                <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" weight="regular" aria-hidden />
                <span className="min-w-0 truncate">{labels.popularLabel(item.id)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {panel.featuredVendors.length > 0 ? (
        <ListingRail
          title={labels.featuredTitle}
          width="contained"
          listingSurface="standard"
          navLabels={labels.railNav}
          slideBasisClassName={navbarSearchRailSlideBasis}
          trackBleedClassName={railBleedClass}
          trackClassName={cn("pl-0 pr-0", carouselInterCardGapClass)}
          titleClassName="px-1 type-h6-sb leading-none text-foreground"
          headerRowClassName="items-center gap-3"
          headerLeadClassName="min-h-9 flex-row items-center gap-0 py-0"
          navClassName="flex shrink-0 items-center gap-1 self-center p-0 pt-0"
          className="!py-0 [&_[data-slot=carousel]]:gap-4"
          titleAlignDesktop="start"
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

// —— Desktop + mobile entry points ————————————————————————————————————————————

export interface NavbarSearchProps {
  searchAria: string;
  panel: NavbarSearchPanelData;
  suggestVendors: SearchSuggestVendor[];
}

export function NavbarSearchDesktop({ searchAria, panel, suggestVendors }: NavbarSearchProps) {
  const labels = useNavbarSearchLabels();
  const pathname = usePathname();
  const { query, setQuery, clearQuery, navigateToSearch, handleKeyDown } = useNavbarSearchQuery();

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipOutsideCloseRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    clearQuery();
  }, [clearQuery]);

  const selectSearch = useCallback(
    (value: string) => {
      close();
      navigateToSearch(value);
    },
    [close, navigateToSearch],
  );

  useEffect(() => {
    close();
  }, [pathname, close]);

  const openSearch = useCallback(() => {
    skipOutsideCloseRef.current = true;
    setOpen(true);
    window.setTimeout(() => {
      skipOutsideCloseRef.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());

    const onPointerDown = (event: PointerEvent) => {
      if (skipOutsideCloseRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("header")) return;
      close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.cancelAnimationFrame(id);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [close, open]);

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 z-[59] hidden cursor-default border-0 bg-[var(--ds-alpha-black-55)] p-0 md:block"
          style={{ top: "var(--site-navbar-height)" }}
          aria-label={labels.close}
          onClick={close}
        />
      ) : null}

      <div className="relative z-[70] hidden min-w-0 items-center md:flex">
        {!open ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-foreground"
            aria-label={searchAria}
            aria-expanded={false}
            aria-haspopup="dialog"
            onClick={(e) => {
              e.stopPropagation();
              openSearch();
            }}
          >
            <MagnifyingGlassIcon className="size-5" weight="bold" aria-hidden />
          </Button>
        ) : (
          <div
            ref={panelRef}
            className={cn("relative", desktopWidthClass)}
            role="dialog"
            aria-label={searchAria}
          >
            <SearchField
              id="navbar-search-desktop"
              value={query}
              onChange={setQuery}
              onKeyDown={(e) => handleKeyDown(e, close)}
              placeholder={labels.placeholder}
              ariaLabel={searchAria}
              closeLabel={labels.close}
              onClose={close}
              inputRef={inputRef}
            />
            <div className={desktopPanelClass}>
              <SearchPanelBody
                panel={panel}
                query={query}
                suggestVendors={suggestVendors}
                labels={labels}
                onNavigate={close}
                onSelect={selectSearch}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function NavbarSearchMobile({
  searchAria,
  panel,
  suggestVendors,
  menuOpen,
  onSearchActiveChange,
  onDismissMenu,
}: NavbarSearchProps & {
  menuOpen: boolean;
  onSearchActiveChange?: (active: boolean) => void;
  /** Closes the mobile menu sheet (and its overlay). */
  onDismissMenu?: () => void;
}) {
  const labels = useNavbarSearchLabels();
  const { query, setQuery, clearQuery, navigateToSearch, handleKeyDown } = useNavbarSearchQuery();
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const deactivate = useCallback(() => {
    setActive(false);
    clearQuery();
  }, [clearQuery]);

  const dismissSearchUi = useCallback(() => {
    deactivate();
    onDismissMenu?.();
  }, [deactivate, onDismissMenu]);

  const selectSearch = useCallback(
    (value: string) => {
      dismissSearchUi();
      navigateToSearch(value);
    },
    [dismissSearchUi, navigateToSearch],
  );

  useEffect(() => {
    if (!menuOpen) deactivate();
  }, [deactivate, menuOpen]);

  useEffect(() => {
    onSearchActiveChange?.(active);
  }, [active, onSearchActiveChange]);

  useEffect(() => {
    if (!active || !menuOpen) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [active, menuOpen]);

  return (
    <>
      {!active ? (
        <div className="shrink-0 px-4 py-5">
          <button
            type="button"
            className="relative block w-full cursor-text text-left"
            aria-label={searchAria}
            onClick={() => setActive(true)}
          >
            <span className="sr-only">{searchAria}</span>
            <span
              aria-hidden
              className={cn(
                "pointer-events-none flex h-11 w-full items-center rounded-ds-12 border border-border bg-background pl-4 pr-11 text-base text-muted-foreground",
              )}
            >
              {labels.placeholder}
            </span>
            <MagnifyingGlassIcon
              className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              weight="bold"
              aria-hidden
            />
          </button>
        </div>
      ) : null}

      {active && menuOpen ? (
        <div
          className="absolute inset-0 z-10 flex min-h-0 flex-col bg-popover"
          role="dialog"
          aria-modal="true"
          aria-label={searchAria}
        >
          <div className="shrink-0 border-b border-border px-4 pb-4 pt-5">
            <SearchField
              id="mobile-menu-search-active"
              value={query}
              onChange={setQuery}
              onKeyDown={(e) => handleKeyDown(e, dismissSearchUi)}
              placeholder={labels.placeholder}
              ariaLabel={searchAria}
              closeLabel={labels.close}
              onClose={deactivate}
              inputRef={inputRef}
              size="md"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <SearchPanelBody
              panel={panel}
              query={query}
              suggestVendors={suggestVendors}
              labels={labels}
              onNavigate={dismissSearchUi}
              onSelect={selectSearch}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
