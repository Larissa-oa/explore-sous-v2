import { cn } from "@/lib/utils";

import type { ListingRailTitleAlign, ListingRailWidthMode } from "./types";

/** 2.5 cards visible — keep gap math in sync with `gap-classes.ts` (12px, two gaps = 24px). */
export const navbarSearchRailSlideBasis =
  "min-w-0 shrink-0 grow-0 basis-[calc((100%-24px)/2.5)]";

export const listingRailSlideBasis: Record<ListingRailWidthMode, string> = {
  contained: cn(
    "min-w-0 shrink-0 grow-0 basis-[calc((100%-12px)/1.5)]",
    "md:basis-[calc((100%-24px)/3)]",
    "lg:basis-[calc((100%-36px)/4)]",
  ),
  fullBleed: cn(
    "min-w-0 shrink-0 grow-0 basis-[calc((100%-12px)/1.5)]",
    "sm:basis-[calc((100%-12px)/2)]",
    "md:basis-[calc((100%-24px)/3)]",
    "lg:basis-[calc((100%-36px)/4)]",
    "xl:basis-[calc((100%-48px)/5)]",
    "2xl:basis-[calc((100%-60px)/6)]",
  ),
};

export function listingRailSlideChrome(width: ListingRailWidthMode): string {
  return cn(
    "flex min-h-0 w-full min-w-0 flex-col",
    width === "fullBleed" && "h-full w-full max-w-none",
  );
}

export function listingRailHeaderClassNames(input: {
  titleAlignMobile: ListingRailTitleAlign;
  titleAlignDesktop: ListingRailTitleAlign;
}): {
  row: string;
  lead: string;
  title: string;
  description: string;
  nav: string;
  desktopCenterGrid: boolean;
  spacer: string;
} {
  const { titleAlignMobile, titleAlignDesktop } = input;
  const bothStart = titleAlignMobile === "start" && titleAlignDesktop === "start";
  const desktopCenterGrid = titleAlignDesktop === "center";

  const row = cn(
    "relative min-w-0 items-start gap-4",
    desktopCenterGrid
      ? cn(
          "flex max-md:flex-row",
          titleAlignMobile === "center" ? "max-md:justify-center" : "max-md:justify-between",
          "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-4",
        )
      : cn(
          "flex",
          bothStart
            ? "justify-between"
            : cn(
                titleAlignMobile === "center" ? "max-md:justify-center" : "max-md:justify-between",
                "md:justify-between",
              ),
        ),
  );

  const lead = cn(
    "min-w-0 flex flex-col gap-2",
    titleAlignMobile === "center" && "max-md:w-full max-md:text-center max-md:items-center",
    desktopCenterGrid && "md:col-start-2 md:justify-self-center md:text-center md:items-center",
  );

  const title = "type-h5-sb text-foreground";
  const description =
    "max-w-prose text-base font-normal leading-relaxed text-muted-foreground";

  const nav = cn(
    "flex shrink-0 items-center gap-1 pt-0.5 max-sm:hidden",
    titleAlignMobile === "center" &&
      "max-md:absolute max-md:right-0 max-md:top-1/2 max-md:z-[1] max-md:-translate-y-1/2 max-md:pt-0",
    desktopCenterGrid &&
      "md:static md:z-auto md:col-start-3 md:row-start-1 md:translate-y-0 md:justify-self-end md:self-center md:pt-0.5",
  );

  const spacer = "hidden min-w-0 md:col-start-1 md:row-start-1 md:block";

  return { row, lead, title, description, nav, desktopCenterGrid, spacer };
}
