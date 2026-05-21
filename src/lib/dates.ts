import type { CatalogWeekday } from "@/types/catalog";

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Sun-first column order for {@link CalendarPicker}. */
export const CALENDAR_WEEKDAY_ORDER: readonly CatalogWeekday[] = [
  "su",
  "mo",
  "tu",
  "we",
  "th",
  "fr",
  "sa",
];

const WEEKDAY_BY_JS_DAY: readonly CatalogWeekday[] = CALENDAR_WEEKDAY_ORDER;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isValidIsoDateString(value: string): boolean {
  return ISO_DATE_RE.test(value);
}

/** ISO calendar day `yyyy-mm-dd` in local timezone (URL / API filters). */
export function toIsoDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIsoDateString(iso: string | null | undefined): Date | null {
  if (iso == null || !isValidIsoDateString(iso)) return null;
  const m = ISO_DATE_RE.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (!y || month < 0 || month > 11 || !day) return null;
  return startOfDay(new Date(y, month, day));
}

export function formatDateField(d: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatOptionalDateField(
  date: Date | null,
  locale: string,
  placeholder: string,
): string {
  return date ? formatDateField(date, locale) : placeholder;
}

export function formatIsoDateField(
  dateIso: string | null,
  locale: string,
  placeholder: string,
): string {
  const parsed = parseIsoDateString(dateIso);
  return parsed ? formatDateField(parsed, locale) : placeholder;
}

export function isoDateMatchesWeekdays(
  dateIso: string,
  availableDays: readonly CatalogWeekday[],
): boolean {
  const parsed = parseIsoDateString(dateIso);
  if (!parsed) return false;
  return availableDays.includes(WEEKDAY_BY_JS_DAY[parsed.getDay()]);
}

export function buildMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDow = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
