/** 2.5 cards visible — keep gap math in sync with `gap-classes.ts` (12px, two gaps = 24px). */
export const navbarSearchRailSlideBasis =
  "min-w-0 shrink-0 grow-0 basis-[calc((100%-24px)/2.5)]";

export const listingRailSlideBasis =
  "min-w-0 shrink-0 grow-0 basis-[calc((100%-12px)/1.5)] md:basis-[calc((100%-24px)/3)] lg:basis-[calc((100%-36px)/4)]";

export const listingRailHeaderClasses = {
  row: "relative flex min-w-0 items-start justify-between gap-4",
  lead: "min-w-0 flex flex-col gap-2",
  title: "type-h5-sb text-foreground",
  description: "max-w-prose text-base font-normal leading-relaxed text-muted-foreground",
  nav: "flex shrink-0 items-center gap-1 pt-0.5 max-sm:hidden",
} as const;
