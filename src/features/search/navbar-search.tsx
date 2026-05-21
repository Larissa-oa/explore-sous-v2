"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { SearchSuggestVendor } from "@/types/search";
import { cn } from "@/lib/utils";

import { NavbarSearchField } from "./navbar-search-field";
import { NavbarSearchPanelBody } from "./navbar-search-panel-body";
import { useNavbarSearchLabels, useNavbarSearchQuery } from "./use-navbar-search";

const desktopWidthClass = "w-[min(100vw-6rem,28rem)] lg:w-[32rem]";
const desktopPanelClass = cn(
  "absolute right-0 top-[calc(100%+0.5rem)] w-full",
  "max-h-[min(80vh,36rem)] overflow-y-auto overflow-x-clip rounded-ds-12 border border-border bg-background shadow-md",
  "px-4 pt-4 pb-8",
);

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
            <NavbarSearchField
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
              <NavbarSearchPanelBody
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
              className="pointer-events-none flex h-11 w-full items-center rounded-ds-12 border border-border bg-background pl-4 pr-11 text-base text-muted-foreground"
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
            <NavbarSearchField
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
            <NavbarSearchPanelBody
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
