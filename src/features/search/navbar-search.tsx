"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { NavbarSearchPanelData } from "@/lib/data/navbar-search-panel";
import type { SearchSuggestVendor } from "@/types/search";
import { cn } from "@/lib/utils";

import { NavbarSearchField } from "./navbar-search-field";
import { NavbarSearchPanelBody } from "./navbar-search-panel-body";
import {
  useCloseWhenMd,
  useNavbarSearchLabels,
  useNavbarSearchQuery,
} from "./use-navbar-search";

const DESKTOP_WIDTH_CLASS = "w-[min(100vw-6rem,28rem)] lg:w-[32rem]";
const DESKTOP_PANEL_CLASS = cn(
  "absolute right-0 top-[calc(100%+0.5rem)] w-full",
  "max-h-[min(80vh,36rem)] overflow-y-auto overflow-x-clip rounded-ds-12 border border-border bg-background shadow-md",
  "px-4 pt-4 pb-8",
);
const SCRIM_CLASS =
  "fixed inset-x-0 bottom-0 z-[59] cursor-default border-0 bg-[var(--ds-alpha-black-55)] p-0";

export interface NavbarSearchProps {
  searchAria: string;
  panel: NavbarSearchPanelData;
  suggestVendors: SearchSuggestVendor[];
}

export type NavbarSearchMobileProps = NavbarSearchProps & {
  onOpenChange?: (open: boolean) => void;
};

function SearchScrim({
  className,
  closeLabel,
  onClose,
}: {
  className: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(SCRIM_CLASS, className)}
      style={{ top: "var(--site-header-height)" }}
      aria-label={closeLabel}
      onClick={onClose}
    />
  );
}

function useNavbarSearchOverlay() {
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
    const focusId = window.requestAnimationFrame(() => inputRef.current?.focus());

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
      window.cancelAnimationFrame(focusId);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [close, open]);

  return {
    labels,
    query,
    setQuery,
    handleKeyDown,
    open,
    close,
    openSearch,
    clearQuery,
    inputRef,
    panelRef,
    selectSearch,
  };
}

export function NavbarSearchDesktop({ searchAria, panel, suggestVendors }: NavbarSearchProps) {
  const {
    labels,
    query,
    setQuery,
    handleKeyDown,
    open,
    close,
    openSearch,
    clearQuery,
    inputRef,
    panelRef,
    selectSearch,
  } = useNavbarSearchOverlay();

  return (
    <>
      {open ? (
        <SearchScrim className="hidden md:block" closeLabel={labels.close} onClose={close} />
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
            className={cn("relative", DESKTOP_WIDTH_CLASS)}
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
              clearLabel={labels.clear}
              clearAriaLabel={labels.clearAria}
              onClear={clearQuery}
              onCloseOverlay={close}
              closeAriaLabel={labels.close}
              inputRef={inputRef}
            />
            <div className={DESKTOP_PANEL_CLASS}>
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
  onOpenChange,
}: NavbarSearchMobileProps) {
  const {
    labels,
    query,
    setQuery,
    handleKeyDown,
    open,
    close,
    openSearch,
    clearQuery,
    inputRef,
    panelRef,
    selectSearch,
  } = useNavbarSearchOverlay();

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useCloseWhenMd(open, close);

  const toggleSearch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (open) close();
      else openSearch();
    },
    [close, open, openSearch],
  );

  return (
    <>
      {open ? (
        <SearchScrim className="md:hidden" closeLabel={labels.close} onClose={close} />
      ) : null}

      {open ? (
        <div
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 z-[70] flex w-full flex-col bg-background md:hidden"
          style={{ top: "var(--site-header-height)" }}
          role="dialog"
          aria-modal="true"
          aria-label={searchAria}
        >
          <div className="shrink-0 border-b border-border px-4 py-4">
            <NavbarSearchField
              id="navbar-search-mobile"
              value={query}
              onChange={setQuery}
              onKeyDown={(e) => handleKeyDown(e, close)}
              placeholder={labels.placeholder}
              ariaLabel={searchAria}
              clearLabel={labels.clear}
              clearAriaLabel={labels.clearAria}
              onClear={clearQuery}
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
              onNavigate={close}
              onSelect={selectSearch}
            />
          </div>
        </div>
      ) : null}

      <div className="relative z-[calc(var(--z-site-navbar)+1)] md:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-foreground"
          aria-label={open ? labels.close : searchAria}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggleSearch}
        >
          <span className="relative flex size-5 items-center justify-center" aria-hidden>
            <MagnifyingGlassIcon
              className={cn(
                "absolute size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                open
                  ? "pointer-events-none scale-90 opacity-0 rotate-90"
                  : "scale-100 opacity-100 rotate-0",
              )}
              weight="bold"
            />
            <XIcon
              className={cn(
                "absolute size-5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                open
                  ? "scale-100 opacity-100 rotate-0"
                  : "pointer-events-none scale-90 opacity-0 -rotate-90",
              )}
              weight="bold"
            />
          </span>
        </Button>
      </div>
    </>
  );
}
