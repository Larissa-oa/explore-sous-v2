import type { ReactNode } from "react";

import type { ListingCardSurface } from "@/types/listing-card";

export type ListingRailWidthMode = "contained" | "fullBleed";
export type ListingRailTitleAlign = "start" | "center";

export type ListingRailNavLabels = {
  prev: string;
  next: string;
  region: string;
};

export interface ListingRailProps {
  width: ListingRailWidthMode;
  title: ReactNode;
  children: ReactNode;
  navLabels: ListingRailNavLabels;
  className?: string;
  /** Short line under the title (optional). */
  description?: ReactNode;
  listingSurface?: ListingCardSurface;
  titleAlignMobile?: ListingRailTitleAlign;
  titleAlignDesktop?: ListingRailTitleAlign;
  /** Optional `id` on the outer `<section>` for in-page links. */
  sectionId?: string;
  /** Overrides default slide width (e.g. search panel 2.5-up). */
  slideBasisClassName?: string;
  /** Overrides {@link CarouselContent} track classes (e.g. search panel full-bleed). */
  trackClassName?: string;
  /** Applied to the track wrapper for edge-to-edge carousel (e.g. right bleed in search panel). */
  trackBleedClassName?: string;
  /** Overrides default {@link listingRailHeaderClassNames} title typography. */
  titleClassName?: string;
  /** Overrides header row layout (e.g. `items-center` for search featured rail). */
  headerRowClassName?: string;
  /** Overrides carousel prev/next cluster (e.g. drop `pt-0.5` when row is centered). */
  navClassName?: string;
  /** Overrides title column wrapper (e.g. `min-h-9 items-center` for search featured rail). */
  headerLeadClassName?: string;
}
