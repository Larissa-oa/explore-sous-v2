"use client";

import type { ComponentProps, FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { CalendarPicker } from "@/components/pickers/calendar-picker";
import { LocationPicker } from "@/components/pickers/location-picker";
import { DiscoveryHeaderCategoryIcon as SearchCategoryOptionIcon } from "@/features/discovery/discovery-header-primitives";
import { SearchPickerWrap } from "@/components/search/search-picker-wrap";
import { useMdLayout } from "@/hooks/use-md-layout";
import { getSearchCategoryIds } from "@/lib/data/search-categories";
import { formatOptionalDateField } from "@/lib/dates";
import {
  discoveryDateIsoForCategory,
  discoveryHref,
  searchCategoryUsesDateFilter,
} from "@/lib/discovery/discovery-query";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import { useRouter } from "@/i18n/navigation";
import { pageContentGutterXClass, pageSearchBandPaddingYClass } from "@/lib/site-layout";
import type { SearchCategoryId } from "@/types/search";
import { cn } from "@/lib/utils";

const SEARCH_CATEGORY_IDS = getSearchCategoryIds();

type SelectOption = { value: string; label: string; icon?: ReactNode };

interface OptionListProps {
  options: SelectOption[];
  value: string | null;
  onSelect: (v: string) => void;
}

const SUBMIT_BTN =
  "rounded-search-inner bg-ds-blue-600 text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Outer pill: white card on hero (`bg-card`), subtle elevation token (`--ds-alpha-black-4`). */
const SEARCH_BAR_SURFACE =
  "flex flex-col overflow-hidden rounded-ds-24 bg-card shadow-[0_1px_2px_var(--ds-alpha-black-4)] md:flex-row md:items-center md:gap-1 md:rounded-ds-20 md:p-1.5 md:pr-2";

const SEARCH_FIELD_CELL = "min-h-0 min-w-0 flex-1 p-2 md:px-2 md:py-1.5";

const DETAIL_SHEET_MIN = "min-h-[min(72vh,28rem)]";

const searchOptionList = "max-h-[min(50vh,320px)] overflow-y-auto p-2";
const searchOptionRow =
  "flex w-full items-center gap-3 rounded-search-inner px-4 py-2.5 text-left text-sm font-normal leading-snug text-foreground transition-colors";
const searchOptionSelected = "bg-ds-blue-600/15 font-medium text-foreground";
const searchOptionIdle = "hover:bg-interactive-hover";

function FieldTrigger({
  label,
  value,
  valueTitle,
  className,
  disabled,
  ...props
}: ComponentProps<"button"> & { label: string; value: string; valueTitle?: string }) {
  const title = valueTitle?.trim() || value;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-3 rounded-search-field-hover px-4 py-3.5 text-left text-foreground transition-colors hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 md:px-5 md:py-3",
        className,
      )}
      aria-label={`${label}, ${title}`}
      {...props}
    >
      <span className="min-w-0 flex-1">
        <span className="text-muted-foreground block text-xs font-medium">{label}</span>
        <span
          title={title.length > value.length ? title : undefined}
          className="mt-0.5 block max-w-full truncate text-base font-semibold leading-tight max-md:max-w-[11rem]"
        >
          {value}
        </span>
      </span>
      <CaretDownIcon className="size-4 shrink-0" aria-hidden weight="bold" />
    </button>
  );
}

function OptionList({ options, value, onSelect }: OptionListProps) {
  return (
    <ul className={cn(searchOptionList, "flex flex-col gap-1")} role="listbox">
      {options.map((opt) => {
        const selected = opt.value === value;
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
              onClick={() => onSelect(opt.value)}
            >
              {opt.icon != null ? opt.icon : null}
              <span className="min-w-0 flex-1 truncate">{opt.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function HomeSearchBar({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const t = useTranslations("HomePage.search");
  const locale = useLocale();
  const layout = useMdLayout();
  const router = useRouter();
  const [openCat, setOpenCat] = useState(false);
  const [openLoc, setOpenLoc] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [category, setCategory] = useState<SearchCategoryId>("delivery");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const showDateField = searchCategoryUsesDateFilter(category);

  function handleDiscoverSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (layout === "pending") return;

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

  const categoryOptions = useMemo(
    () =>
      SEARCH_CATEGORY_IDS.map((key) => ({
        value: key,
        label: t(`categories.${key}`),
        icon: <SearchCategoryOptionIcon id={key} />,
      })),
    [t],
  );

  const categoryDisplay =
    categoryOptions.find((o) => o.value === category)?.label ?? t("categoryPlaceholder");
  const locationRaw = location?.trim() ?? "";
  const locationDisplay = locationRaw || t("locationPlaceholder");
  const dateDisplay = formatOptionalDateField(selectedDate, locale, t("whenPlaceholder"));

  const pending = layout === "pending";

  const categoryPanel = (
    <OptionList
      options={categoryOptions}
      value={category}
      onSelect={(v) => {
        const next = v as SearchCategoryId;
        setCategory(next);
        if (!searchCategoryUsesDateFilter(next)) {
          setSelectedDate(null);
          setOpenDate(false);
        }
        setOpenCat(false);
      }}
    />
  );

  const locationPanel = (
    <LocationPicker
      value={location}
      onChange={(sel) => {
        setLocation(sel);
        if (sel != null) setOpenLoc(false);
      }}
      onClose={() => setOpenLoc(false)}
      locale={locale}
      title={t("locationPicker.title")}
      clearLabel={t("locationPicker.clear")}
      closeLabel={t("locationPicker.close")}
      placeholder={t("locationPicker.placeholder")}
      useCurrentLocationLabel={t("locationPicker.useCurrentLocation")}
      locatingLabel={t("locationPicker.locating")}
      locationFallbackLabel={t("locationPicker.currentLocationResult")}
    />
  );

  const datePanel = (
    <CalendarPicker
      value={selectedDate}
      onChange={(d) => {
        setSelectedDate(d);
        setOpenDate(false);
      }}
      confirmSelection={layout === "mobile"}
      selectDateLabel={t("calendar.selectDate")}
      prevMonthLabel={t("calendar.prevMonth")}
      nextMonthLabel={t("calendar.nextMonth")}
      weekdayShort={(k) => t(`calendar.weekdaysShort.${k}`)}
      locale={locale}
    />
  );

  const inner = (
    <form
      onSubmit={handleDiscoverSubmit}
      className={cn(
        "mx-auto flex w-full flex-col",
        embedded ? "max-w-[40rem]" : "max-w-5xl",
      )}
    >
      <div className={SEARCH_BAR_SURFACE} data-search-field-surface>
        <div className={SEARCH_FIELD_CELL}>
          <SearchPickerWrap
            variant="home"
            layout={layout}
            open={openCat}
            onOpenChange={setOpenCat}
            sheetTitle={t("categoryLabel")}
            popoverWidthClass="w-64"
            trigger={
              <FieldTrigger
                label={t("categoryLabel")}
                value={categoryDisplay}
                disabled={pending}
              />
            }
            panel={categoryPanel}
          />
        </div>
        <div
          className={cn(
            SEARCH_FIELD_CELL,
            "min-w-0 flex-1 border-t-[0.5px] border-border md:border-t-0 md:border-l-[0.5px] md:border-border",
          )}
        >
          <SearchPickerWrap
            variant="home"
            layout={layout}
            open={openLoc}
            onOpenChange={setOpenLoc}
            sheetTitle={t("locationLabel")}
            popoverWidthClass="w-80"
            sheetContentClassName={layout === "mobile" ? DETAIL_SHEET_MIN : undefined}
            trigger={
              <FieldTrigger
                label={t("locationLabel")}
                value={locationDisplay}
                valueTitle={locationRaw || undefined}
                disabled={pending}
              />
            }
            panel={locationPanel}
          />
        </div>

        {showDateField ? (
          <div
            className={cn(
              SEARCH_FIELD_CELL,
              "min-w-0 flex-1 border-t-[0.5px] border-border md:border-t-0 md:border-l-[0.5px] md:border-border",
            )}
          >
            <SearchPickerWrap
              variant="home"
              layout={layout}
              open={openDate}
              onOpenChange={setOpenDate}
              sheetTitle={t("whenLabel")}
              popoverWidthClass="w-80"
              sheetContentClassName={layout === "mobile" ? DETAIL_SHEET_MIN : undefined}
              trigger={
                <FieldTrigger
                  label={t("whenLabel")}
                  value={dateDisplay}
                  disabled={pending}
                />
              }
              panel={datePanel}
            />
          </div>
        ) : null}

        <div className="border-t-[0.5px] border-border p-3 md:hidden">
          <button
            type="submit"
            className={cn(
              "flex h-14 w-full items-center justify-center gap-3 px-6 text-base font-medium",
              SUBMIT_BTN,
            )}
            aria-label={t("explore")}
          >
            <MagnifyingGlassIcon className="size-6 shrink-0" weight="regular" aria-hidden />
            {t("explore")}
          </button>
        </div>

        <div className="hidden shrink-0 p-1 md:block">
          <button
            type="submit"
            className={cn("flex size-12 items-center justify-center", SUBMIT_BTN)}
            aria-label={t("explore")}
          >
            <MagnifyingGlassIcon className="size-5" weight="regular" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );

  if (embedded) {
    return inner;
  }

  return (
    <section className={cn("bg-background", pageContentGutterXClass, pageSearchBandPaddingYClass)}>
      {inner}
    </section>
  );
}
