import { cn } from "@/lib/utils";

const fieldHover =
  "flex w-full min-w-0 items-center justify-between rounded-search-field-hover text-foreground transition-[background-color,box-shadow] duration-200 ease-out hover:bg-interactive-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

export const discoverSearchSurfaceHeroClass =
  "flex flex-col overflow-hidden rounded-ds-24 bg-card shadow-[0_1px_2px_var(--ds-alpha-black-4)] md:flex-row md:items-center md:gap-1 md:rounded-ds-20 md:p-1.5 md:pr-2";

export const discoverSearchFieldCellClass = "min-h-0 min-w-0 flex-1 p-2 md:px-2 md:py-1.5";

export const discoverSearchFieldCellDesktopClass =
  "min-h-0 min-w-0 flex-1 border-l-[0.5px] border-border first:border-l-0";

export const discoverSearchSubmitDesktopClass =
  "flex size-12 shrink-0 items-center justify-center rounded-search-inner bg-ds-blue-600 text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const discoverSearchSurfaceNavbarClass =
  "flex w-full flex-row items-stretch gap-1 overflow-hidden rounded-ds-16 bg-card py-1.5 pl-2 pr-1.5";

export const discoverSearchFieldCellNavbarClass = cn(
  "discover-search-field-cell flex min-h-0 min-w-0 flex-1 items-stretch py-0 pl-0.5 pr-0.5 first:pl-1",
  "border-l-[0.5px] border-[var(--navbar-discover-bar-divider)] first:border-l-0",
);

export const discoverSearchFieldTriggerNavbarClass = cn(
  fieldHover,
  "min-h-9 w-full flex-1 justify-start gap-2 px-2.5 py-0 text-left text-sm font-medium leading-none",
);

export const discoverSearchSubmitNavbarClass =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-search-inner px-3 text-sm font-medium text-white bg-ds-blue-600 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
