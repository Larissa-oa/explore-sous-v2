import { HOME_MAIN_CONTENT_ID } from "@/features/homepage/lib/home-section-ids";
import { cn } from "@/lib/utils";

/** Hash link used by explore category tiles and “How it works”. */
export const EXPLORE_MAIN_CONTENT_HREF = `/#${HOME_MAIN_CONTENT_ID}` as const;

/** Shared row style for trending vendor rows and “See all” (mega + mobile). */
export const TRENDING_ROW_LINK_CLASS = cn(
  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-interactive-hover/60 sm:gap-3 sm:px-4 sm:py-3",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

export const TRENDING_ROW_CHEVRON_CLASS =
  "size-4 shrink-0 text-muted-foreground sm:size-[1.125rem]" as const;

export const TRENDING_VENDOR_THUMB_CLASS =
  "relative size-12 shrink-0 overflow-hidden rounded-ds-8 bg-muted sm:size-14" as const;

export const TRENDING_SEE_ALL_THUMB_CLASS = cn(
  "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-ds-8 bg-muted sm:size-14",
  "ring-1 ring-border/50",
);

export const TRENDING_LIST_UL_CLASS =
  "flex flex-col divide-y divide-border border-0 bg-transparent px-0 shadow-none" as const;

/** Horizontal inset for “Trending now” heading so it lines up with row padding. */
export const TRENDING_SECTION_TITLE_INSET = "px-3 sm:px-4" as const;

/** Section labels in Explore mega menu, mobile drawer, and navbar search featured rail. */
export const EXPLORE_SECTION_LABEL_CLASS =
  "text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs";

/** Extra padding / gap for mobile drawer trending rows (mega uses base only). */
export const TRENDING_ROW_LINK_MOBILE_CLASS = cn(
  "py-3.5 gap-3.5 px-4 sm:py-4 sm:gap-4 sm:px-5",
);

/** Larger thumbnails on mobile trending list. */
export const TRENDING_VENDOR_THUMB_MOBILE_CLASS = cn(
  "size-[3.75rem] rounded-ds-10 sm:size-[4.25rem] sm:rounded-ds-10",
);

export const TRENDING_SEE_ALL_THUMB_MOBILE_CLASS = cn(
  "size-[3.75rem] rounded-ds-10 sm:size-[4.25rem] sm:rounded-ds-10",
);

export const TRENDING_ROW_CHEVRON_MOBILE_CLASS = "size-5 shrink-0 text-muted-foreground sm:size-[1.25rem]" as const;

/** Match row inset when mobile rows use wider padding. */
export const TRENDING_SECTION_TITLE_INSET_MOBILE = "px-4 sm:px-5" as const;

export const MEGA_HOW_IT_WORKS_LINK_CLASS = cn(
  "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ds-blue-600 transition-colors",
  "hover:text-ds-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

export const MEGA_LEFT_FOOTER_ROW_CLASS = cn(
  "mt-auto flex w-full shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-4",
);

export function exploreCategoryImageSizes(layout: "default" | "mega" | "mobileSheet"): string {
  switch (layout) {
    case "mega":
      return "(min-width:768px) 12vw, 32vw";
    case "mobileSheet":
      return "(max-width: 768px) 92vw, 360px";
    default:
      return "(max-width: 768px) 100vw, 280px";
  }
}
