import { cn } from "@/lib/utils";

/** Top sheet shell for the Explore mega panel (height, position, no radius). */
export const EXPLORE_MEGA_SHEET_CONTENT_CLASS = cn(
  "explore-mega-sheet flex min-h-0 max-h-[min(68rem,calc(100dvh-var(--site-navbar-height)-0.5rem))] flex-col gap-0 overflow-hidden border-0 bg-popover p-0 shadow-lg",
  "!inset-x-0 !top-[var(--site-navbar-height)] !bottom-auto !left-0 !right-0 !h-auto",
  "!z-[55] !rounded-none",
  "data-[side=top]:!pt-3",
);

/** Inner max-width container + vertical rhythm for Explore mega content. */
export const EXPLORE_MEGA_INNER_SHELL_CLASS =
  "mx-auto flex w-full max-w-[1800px] min-h-0 flex-1 flex-col overflow-hidden px-5 pt-3 pb-6 md:px-14 md:pt-9 md:pb-11 lg:px-20 lg:pt-10 lg:pb-12";

/** Two-column grid: categories + divider + trending. */
export const EXPLORE_MEGA_MAIN_GRID_CLASS =
  "grid min-h-0 flex-1 grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.85fr)_1px_minmax(0,1fr)] md:items-stretch md:gap-10 lg:gap-12";

export const EXPLORE_MEGA_COLUMN_DIVIDER_CLASS =
  "hidden w-px shrink-0 bg-border md:block md:min-h-0 md:self-stretch";
