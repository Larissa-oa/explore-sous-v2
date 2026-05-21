"use client";

import { useEffect, useMemo, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  buildMonthGrid,
  CALENDAR_WEEKDAY_ORDER,
  isBeforeDay,
  isSameDay,
  startOfDay,
  toIsoDateString,
} from "@/lib/dates";
import type { CatalogWeekday } from "@/types/catalog";
import { cn } from "@/lib/utils";

export type CalendarPickerProps = {
  value: Date | null;
  onChange: (date: Date) => void;
  /** Mobile sheet: pick day then confirm. Desktop: day tap commits immediately. */
  confirmSelection?: boolean;
  selectDateLabel: string;
  prevMonthLabel: string;
  nextMonthLabel: string;
  weekdayShort: (key: CatalogWeekday) => string;
  locale: string;
  className?: string;
  /** When set and non-empty, only these ISO dates (`yyyy-mm-dd`) are selectable (past days stay disabled). */
  allowedIsoDates?: ReadonlySet<string> | null;
  /** Tighter layout for popovers (e.g. discovery header). */
  density?: "default" | "compact";
};

export function CalendarPicker({
  value,
  onChange,
  confirmSelection,
  selectDateLabel,
  prevMonthLabel,
  nextMonthLabel,
  weekdayShort,
  locale,
  className,
  allowedIsoDates,
  density = "default",
}: CalendarPickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(() => {
    const base = value ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [draft, setDraft] = useState<Date | null>(value);

  useEffect(() => {
    setDraft(value);
    if (value) setCursor(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const monthTitle = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        new Date(year, month, 1),
      );
    } catch {
      return `${month + 1}/${year}`;
    }
  }, [locale, month, year]);

  const commit = (d: Date) => {
    onChange(startOfDay(d));
  };

  const isDayDisabled = (cell: Date): boolean => {
    if (isBeforeDay(cell, today)) return true;
    const restricted = allowedIsoDates != null && allowedIsoDates.size > 0;
    if (!restricted) return false;
    return !allowedIsoDates.has(toIsoDateString(startOfDay(cell)));
  };

  const handleDayClick = (d: Date) => {
    if (isDayDisabled(d)) return;
    if (confirmSelection) {
      setDraft(startOfDay(d));
    } else {
      commit(d);
    }
  };

  const selectedForUi = confirmSelection ? draft : value;
  const compact = density === "compact";

  return (
    <div className={cn(compact ? "p-2.5" : "p-4", className)}>
      <div className={cn("flex items-center justify-between gap-2", compact ? "mb-2" : "mb-4")}>
        <button
          type="button"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-search-inner text-foreground transition-colors hover:bg-interactive-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            compact ? "size-8" : "size-9",
          )}
          aria-label={prevMonthLabel}
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          <CaretLeftIcon className={compact ? "size-3.5" : "size-4"} aria-hidden />
        </button>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-center font-semibold text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {monthTitle}
        </span>
        <button
          type="button"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-search-inner text-foreground transition-colors hover:bg-interactive-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            compact ? "size-8" : "size-9",
          )}
          aria-label={nextMonthLabel}
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          <CaretRightIcon className={compact ? "size-3.5" : "size-4"} aria-hidden />
        </button>
      </div>

      <div className={cn("grid grid-cols-7 text-center", compact ? "mb-1 gap-0.5" : "mb-2 gap-1")}>
        {CALENDAR_WEEKDAY_ORDER.map((k) => (
          <div
            key={k}
            className={cn(
              "pb-1 font-medium text-muted-foreground",
              compact ? "text-[10px] leading-none" : "text-xs",
            )}
          >
            {weekdayShort(k)}
          </div>
        ))}
      </div>

      <div
        className={cn("grid grid-cols-7", compact ? "gap-0.5" : "gap-1")}
        role="grid"
        aria-label={monthTitle}
      >
        {weeks.map((week, wi) =>
          week.map((cell, di) => {
            const key = `${wi}-${di}`;
            if (!cell) {
              return <div key={key} className="aspect-square" />;
            }
            const disabled = isDayDisabled(cell);
            const selected = selectedForUi != null && isSameDay(cell, selectedForUi);
            return (
              <button
                key={key}
                type="button"
                role="gridcell"
                disabled={disabled}
                aria-selected={selected}
                className={cn(
                  "flex aspect-square min-h-0 min-w-0 items-center justify-center rounded-search-inner font-normal transition-colors",
                  compact ? "max-h-8 max-w-8 text-xs" : "text-sm",
                  disabled && "cursor-not-allowed text-muted-foreground line-through opacity-50",
                  !disabled && !selected && "text-foreground hover:bg-interactive-hover",
                  selected &&
                    "bg-ds-blue-600/18 font-semibold text-foreground ring-1 ring-inset ring-ds-blue-600/20",
                )}
                onClick={() => handleDayClick(cell)}
              >
                {cell.getDate()}
              </button>
            );
          }),
        )}
      </div>

      {confirmSelection ? (
        <div
          className={cn(
            "border-t-[0.5px] border-border",
            compact ? "mt-2 border-t pt-2" : "mt-4 pt-4",
          )}
        >
          <Button
            type="button"
            className={cn(
              "w-full rounded-search-inner bg-ds-blue-600 text-sm font-medium text-white hover:bg-ds-blue-900",
              compact ? "h-9" : "h-11",
            )}
            disabled={!draft || (draft != null && isDayDisabled(draft))}
            onClick={() => draft && commit(draft)}
          >
            {selectDateLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
