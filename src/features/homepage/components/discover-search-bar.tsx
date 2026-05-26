"use client";

import type { ComponentProps } from "react";
import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { CalendarPicker } from "@/components/pickers/calendar-picker";
import { LocationPicker } from "@/components/pickers/location-picker";
import { DiscoverySearchCategoryOptionList } from "@/features/discovery/discovery-header-primitives";
import { SearchPickerWrap } from "@/components/search/search-picker-wrap";
import {
  useDiscoverSearchBar,
  useDiscoverSearchPickers,
} from "@/features/homepage/hooks/discover-search";
import {
  discoverSearchFieldCellClass,
  discoverSearchFieldCellDesktopClass,
  discoverSearchSubmitDesktopClass,
  discoverSearchSurfaceHeroClass,
} from "@/features/homepage/lib/discover-search-surface";
import type { SearchCategoryId } from "@/types/search";
import { cn } from "@/lib/utils";

const DETAIL_SHEET_MIN = "min-h-[min(72vh,28rem)]";

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
        "flex w-full min-w-0 items-center justify-between gap-3 rounded-search-field-hover px-4 py-3.5 text-left text-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 md:px-5 md:py-3",
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

export type DiscoverSearchBarLayout = "hero-embedded" | "hero-section";

export function DiscoverSearchBar({
  layout,
  surfaceId,
  className,
}: {
  layout: DiscoverSearchBarLayout;
  surfaceId?: string;
  className?: string;
}) {
  const bar = useDiscoverSearchBar();
  const pickers = useDiscoverSearchPickers(true);
  const {
    t,
    locale,
    layout: mdLayout,
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

  const cellDivider = cn(
    discoverSearchFieldCellClass,
    "min-w-0 flex-1 border-t-[0.5px] border-border md:border-0",
    discoverSearchFieldCellDesktopClass,
  );

  return (
    <form
      onSubmit={handleDiscoverSubmit}
      className={cn(
        "mx-auto flex w-full flex-col",
        layout === "hero-embedded" && "max-w-[40rem]",
        layout === "hero-section" && "max-w-5xl",
        className,
      )}
    >
      <div id={surfaceId} className={discoverSearchSurfaceHeroClass} data-search-field-surface="">
        <div className={discoverSearchFieldCellClass}>
          <SearchPickerWrap
            variant="home"
            layout={mdLayout}
            {...pickers.bind("category")}
            sheetTitle={t("categoryLabel")}
            popoverWidthClass="w-64"
            trigger={<FieldTrigger label={t("categoryLabel")} value={categoryDisplay} disabled={pending} />}
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

        <div className={cellDivider}>
          <SearchPickerWrap
            variant="home"
            layout={mdLayout}
            {...pickers.bind("location")}
            sheetTitle={t("locationLabel")}
            popoverWidthClass="w-80"
            sheetContentClassName={mdLayout === "mobile" ? DETAIL_SHEET_MIN : undefined}
            trigger={
              <FieldTrigger
                label={t("locationLabel")}
                value={locationDisplay}
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
          <div className={cellDivider}>
            <SearchPickerWrap
              variant="home"
              layout={mdLayout}
              {...pickers.bind("date")}
              sheetTitle={t("whenLabel")}
              popoverWidthClass="w-80"
              sheetContentClassName={mdLayout === "mobile" ? DETAIL_SHEET_MIN : undefined}
              trigger={<FieldTrigger label={t("whenLabel")} value={dateDisplay} disabled={pending} />}
              panel={
                <CalendarPicker
                  value={selectedDate}
                  onChange={(d) => {
                    setSelectedDate(d);
                    pickers.close();
                  }}
                  confirmSelection={mdLayout === "mobile"}
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

        <div className="border-t-[0.5px] border-border p-3 md:hidden">
          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-search-inner bg-ds-blue-600 px-6 text-base font-medium text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={t("explore")}
          >
            <MagnifyingGlassIcon className="size-6 shrink-0" aria-hidden />
            {t("explore")}
          </button>
        </div>

        <div className="hidden shrink-0 p-1 md:block">
          <button type="submit" className={discoverSearchSubmitDesktopClass} aria-label={t("explore")}>
            <MagnifyingGlassIcon className="size-5 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
