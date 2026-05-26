"use client";

import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { CaretDownIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { usePathname } from "@/i18n/navigation";

import { CalendarPicker } from "@/components/pickers/calendar-picker";
import { LocationPicker } from "@/components/pickers/location-picker";
import { DiscoverySearchCategoryOptionList } from "@/features/discovery/discovery-header-primitives";
import { SearchPickerWrap } from "@/components/search/search-picker-wrap";
import {
  useDiscoverSearchBar,
  useDiscoverSearchPickers,
  type DiscoverSearchField,
} from "@/features/homepage/hooks/discover-search";
import {
  discoverSearchFieldCellNavbarClass,
  discoverSearchFieldTriggerNavbarClass,
  discoverSearchSubmitNavbarClass,
  discoverSearchSurfaceNavbarClass,
} from "@/features/homepage/lib/discover-search-surface";
import type { SearchCategoryId } from "@/types/search";
import { cn } from "@/lib/utils";

const MOBILE_SUBMIT =
  "flex h-14 w-full items-center justify-center gap-3 rounded-ds-full bg-ds-blue-600 px-6 text-base font-medium text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function PillTrigger({
  fieldLabel,
  placeholder,
  displayValue,
  isEmpty,
  valueTitle,
  ...props
}: ComponentProps<"button"> & {
  fieldLabel: string;
  placeholder: string;
  displayValue: string;
  isEmpty: boolean;
  valueTitle?: string;
}) {
  const visible = isEmpty ? placeholder : displayValue;
  const title = valueTitle?.trim() || visible;
  return (
    <button
      type="button"
      className={discoverSearchFieldTriggerNavbarClass}
      aria-label={`${fieldLabel}, ${title}`}
      {...props}
    >
      <span
        title={!isEmpty && title.length > visible.length ? title : undefined}
        className="min-w-0 flex-1 truncate leading-none"
      >
        {visible}
      </span>
      <CaretDownIcon className="size-4 shrink-0" aria-hidden weight="bold" />
    </button>
  );
}

function MobileSheetRow({
  label,
  value,
  valueTitle,
  open,
  onToggle,
  children,
}: {
  label: string;
  value: string;
  valueTitle?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="min-w-0 flex-1">
          <span className="text-muted-foreground block text-xs font-medium">{label}</span>
          <span title={valueTitle} className="mt-0.5 block truncate text-base font-semibold">
            {value}
          </span>
        </span>
        <CaretDownIcon className="size-4 shrink-0" aria-hidden weight="bold" />
      </button>
      {open ? <div className="border-t border-border px-2 py-2">{children}</div> : null}
    </div>
  );
}

type DiscoverBar = ReturnType<typeof useDiscoverSearchBar>;
type DiscoverPickers = ReturnType<typeof useDiscoverSearchPickers>;

function NavbarDiscoverSearchDesktop({
  bar,
  pickers,
  className,
}: {
  bar: DiscoverBar;
  pickers: DiscoverPickers;
  className?: string;
}) {
  const {
    t,
    locale,
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
  } = bar;

  return (
    <form
      onSubmit={handleDiscoverSubmit}
      className={cn("mx-auto hidden w-full max-w-[min(100%,34rem)] lg:max-w-[38rem] md:block", className)}
    >
      <div className={discoverSearchSurfaceNavbarClass} data-navbar-discover-bar="">
        <div className={discoverSearchFieldCellNavbarClass}>
          <SearchPickerWrap
            variant="home"
            layout="desktop"
            {...pickers.bind("category")}
            sheetTitle={t("categoryLabel")}
            popoverWidthClass="w-64"
            trigger={
              <PillTrigger
                fieldLabel={t("categoryLabel")}
                placeholder={t("navbarPill.what")}
                displayValue={categoryDisplay}
                isEmpty={category === "delivery"}
                disabled={pending}
              />
            }
            panel={
              <DiscoverySearchCategoryOptionList
                options={categoryOptions}
                value={category}
                onSelect={(v) => {
                  selectCategory(v as SearchCategoryId);
                  pickers.close();
                }}
              />
            }
          />
        </div>

        <div className={discoverSearchFieldCellNavbarClass}>
          <SearchPickerWrap
            variant="home"
            layout="desktop"
            {...pickers.bind("location")}
            sheetTitle={t("locationLabel")}
            popoverWidthClass="w-80"
            trigger={
              <PillTrigger
                fieldLabel={t("locationLabel")}
                placeholder={t("navbarPill.where")}
                displayValue={locationDisplay}
                isEmpty={locationRaw.length === 0}
                valueTitle={locationRaw || undefined}
                disabled={pending}
              />
            }
            panel={
              <LocationPicker
                value={location}
                labels={locationPickerLabels}
                onChange={(sel) => {
                  setLocation(sel);
                  pickers.close();
                }}
              />
            }
          />
        </div>

        {showDateField ? (
          <div className={discoverSearchFieldCellNavbarClass}>
            <SearchPickerWrap
              variant="home"
              layout="desktop"
              {...pickers.bind("date")}
              sheetTitle={t("whenLabel")}
              popoverWidthClass="w-80"
              trigger={
                <PillTrigger
                  fieldLabel={t("whenLabel")}
                  placeholder={t("navbarPill.when")}
                  displayValue={dateDisplay}
                  isEmpty={selectedDate == null}
                  disabled={pending}
                />
              }
              panel={
                <CalendarPicker
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    pickers.close();
                  }}
                  confirmSelection={false}
                  selectDateLabel={t("calendar.selectDate")}
                  prevMonthLabel={t("calendar.prevMonth")}
                  nextMonthLabel={t("calendar.nextMonth")}
                  weekdayShort={(k) => t(`calendar.weekdaysShort.${k}`)}
                  locale={locale}
                />
              }
            />
          </div>
        ) : null}

        <div className="discover-search-submit-cell flex shrink-0 items-center py-0 pl-0.5 pr-1">
          <button type="submit" className={discoverSearchSubmitNavbarClass} aria-label={t("explore")}>
            <MagnifyingGlassIcon className="size-4 shrink-0" aria-hidden />
            <span className="leading-none">{t("explore")}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function NavbarDiscoverSearchMobile({
  bar,
  onSheetOpenChange,
}: {
  bar: DiscoverBar;
  onSheetOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [section, setSection] = useState<DiscoverSearchField | null>(null);
  const {
    t,
    locale,
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
  } = bar;

  const setSheet = useCallback(
    (open: boolean) => {
      setSheetOpen(open);
      onSheetOpenChange?.(open);
      if (!open) setSection(null);
    },
    [onSheetOpenChange],
  );

  const toggleSection = (field: DiscoverSearchField) =>
    setSection((current) => (current === field ? null : field));

  const toggleSheet = () => {
    if (sheetOpen) setSheet(false);
    else {
      setSheet(true);
      setSection("category");
    }
  };

  useEffect(() => {
    setSheet(false);
  }, [pathname, setSheet]);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  return (
    <div className="min-w-0 flex-1 md:hidden">
      <button
        type="button"
        disabled={pending}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-ds-12 border-0 bg-card px-3.5 py-2 text-left shadow-[0_1px_2px_var(--ds-alpha-black-4)] transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        aria-label={sheetOpen ? t("locationPicker.close") : t("categoryLabel")}
        onClick={toggleSheet}
      >
        <span className="min-w-0 flex-1">
          <span className="text-muted-foreground block text-[10px] font-medium">{t("categoryLabel")}</span>
          <span className="mt-0.5 block truncate text-sm font-semibold leading-tight">{categoryDisplay}</span>
        </span>
        <span className="relative size-4 shrink-0" aria-hidden>
          <CaretDownIcon
            className={cn(
              "absolute inset-0 size-4 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              sheetOpen ? "scale-75 opacity-0" : "opacity-100",
            )}
            weight="bold"
          />
          <XIcon
            className={cn(
              "absolute inset-0 size-4 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              sheetOpen ? "opacity-100" : "scale-75 opacity-0",
            )}
            weight="bold"
          />
        </span>
      </button>

      {sheetOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 z-[59] cursor-default border-0 bg-[var(--ds-alpha-black-55)] p-0 md:hidden"
          style={{ top: "var(--site-header-height)" }}
          aria-label={t("locationPicker.close")}
          onClick={() => setSheet(false)}
        />
      ) : null}

      {sheetOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[70] flex flex-col bg-background md:hidden"
          style={{ top: "var(--site-header-height)" }}
          role="dialog"
          aria-modal="true"
          aria-label={t("explore")}
        >
          <form
            onSubmit={(e) => {
              handleDiscoverSubmit(e);
              setSheet(false);
            }}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-4 pt-4"
          >
            <div className="overflow-hidden rounded-ds-12 bg-card shadow-sm">
              <MobileSheetRow
                label={t("categoryLabel")}
                value={categoryDisplay}
                open={section === "category"}
                onToggle={() => toggleSection("category")}
              >
                <DiscoverySearchCategoryOptionList
                  options={categoryOptions}
                  value={category}
                  onSelect={(v) => {
                    selectCategory(v as SearchCategoryId);
                    setSection(null);
                  }}
                />
              </MobileSheetRow>

              <MobileSheetRow
                label={t("locationLabel")}
                value={locationDisplay}
                valueTitle={locationRaw || undefined}
                open={section === "location"}
                onToggle={() => toggleSection("location")}
              >
                <LocationPicker
                  value={location}
                  labels={locationPickerLabels}
                  onChange={(sel) => {
                    setLocation(sel);
                    setSection(null);
                  }}
                />
              </MobileSheetRow>

              {showDateField ? (
                <MobileSheetRow
                  label={t("whenLabel")}
                  value={dateDisplay}
                  open={section === "date"}
                  onToggle={() => toggleSection("date")}
                >
                  <CalendarPicker
                    value={selectedDate}
                    onChange={(d) => {
                      setSelectedDate(d);
                      setSection(null);
                    }}
                    confirmSelection={false}
                    selectDateLabel={t("calendar.selectDate")}
                    prevMonthLabel={t("calendar.prevMonth")}
                    nextMonthLabel={t("calendar.nextMonth")}
                    weekdayShort={(k) => t(`calendar.weekdaysShort.${k}`)}
                    locale={locale}
                  />
                </MobileSheetRow>
              ) : null}

              <div className="p-4">
                <button type="submit" className={MOBILE_SUBMIT} aria-label={t("explore")}>
                  <MagnifyingGlassIcon className="size-6 shrink-0" aria-hidden />
                  {t("explore")}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

/** Scroll-linked navbar discover search (desktop bar + mobile sheet). */
export function NavbarDiscoverSearch({
  onSheetOpenChange,
}: {
  onSheetOpenChange?: (open: boolean) => void;
}) {
  const bar = useDiscoverSearchBar();
  const pickers = useDiscoverSearchPickers(true);
  return (
    <>
      <NavbarDiscoverSearchDesktop bar={bar} pickers={pickers} />
      <NavbarDiscoverSearchMobile bar={bar} onSheetOpenChange={onSheetOpenChange} />
    </>
  );
}
