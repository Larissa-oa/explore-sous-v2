import type { ReactNode } from "react";

export type ListingRailNavLabels = {
  prev: string;
  next: string;
  region: string;
};

export interface ListingRailProps {
  title: ReactNode;
  children: ReactNode;
  navLabels: ListingRailNavLabels;
  className?: string;
  /** Short line under the title (optional). */
  description?: ReactNode;
  /** Optional `id` on the outer `<section>` for in-page links. */
  sectionId?: string;
  /** Overrides default slide width (e.g. search panel 2.5-up). */
  slideBasisClassName?: string;
  /** Overrides {@link CarouselContent} track classes (e.g. search panel edge bleed). */
  trackClassName?: string;
  /** Applied to the track wrapper for edge-to-edge carousel (e.g. right bleed in search panel). */
  trackBleedClassName?: string;
  /** Overrides default header title typography. */
  titleClassName?: string;
  /** Overrides header row layout (e.g. `items-center` for search featured rail). */
  headerRowClassName?: string;
  /** Overrides carousel prev/next cluster. */
  navClassName?: string;
  /** Overrides title column wrapper. */
  headerLeadClassName?: string;
}
