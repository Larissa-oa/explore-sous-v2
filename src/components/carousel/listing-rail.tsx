"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  pageContainedRailBleedTrackInsetClass,
  pageSectionPaddingYClass,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";

import { listingRailHeaderClasses, listingRailSlideBasis } from "./presets";
import type { ListingRailProps } from "./types";

const SlideBasisCtx = createContext<string | null>(null);

function useListingRailSlideBasis(): string {
  const override = useContext(SlideBasisCtx);
  return override ?? listingRailSlideBasis;
}

const NAV = "size-9";
const EMBLA = {
  align: "start" as const,
  direction: "ltr" as const,
  loop: false,
  containScroll: "trimSnaps" as const,
};

export function ListingRail({
  title,
  description,
  children,
  className,
  navLabels,
  sectionId,
  slideBasisClassName,
  trackClassName,
  trackBleedClassName,
  titleClassName,
  headerRowClassName,
  headerLeadClassName,
  navClassName,
}: ListingRailProps) {
  const h = listingRailHeaderClasses;

  return (
    <section id={sectionId} className={cn(pageSectionPaddingYClass, className)}>
      <SlideBasisCtx.Provider value={slideBasisClassName ?? null}>
        <Carousel
          aria-label={navLabels.region}
          opts={EMBLA}
          className="relative flex w-full min-w-0 flex-col gap-6"
        >
          <div className={cn(h.row, headerRowClassName)}>
            <div className={cn(h.lead, headerLeadClassName)}>
              <div className={titleClassName ?? h.title}>{title}</div>
              {description != null && description !== "" ? (
                <div className={h.description}>{description}</div>
              ) : null}
            </div>
            <div className={cn(h.nav, navClassName)}>
              <CarouselPrevious aria-label={navLabels.prev} className={NAV} />
              <CarouselNext aria-label={navLabels.next} className={NAV} />
            </div>
          </div>
          <div
            className={cn(
              "min-w-0 w-full md:pb-8",
              trackBleedClassName,
              !trackBleedClassName &&
                "max-sm:relative max-sm:flex max-sm:w-screen max-sm:max-w-[100vw] max-sm:shrink-0 max-sm:overflow-x-clip max-sm:[margin-inline:calc(50%-50vw)]",
            )}
          >
            <CarouselContent
              className={cn(
                "touch-pan-y",
                trackClassName ?? pageContainedRailBleedTrackInsetClass,
              )}
            >
              {children}
            </CarouselContent>
          </div>
        </Carousel>
      </SlideBasisCtx.Provider>
    </section>
  );
}

export interface ListingRailSlideProps {
  children: ReactNode;
  className?: string;
}

export function ListingRailSlide({ children, className }: ListingRailSlideProps) {
  const basis = useListingRailSlideBasis();
  return (
    <CarouselItem className={cn(basis, className)}>
      <div
        data-carousel-slide-chrome
        className="flex min-h-0 w-full min-w-0 flex-col"
      >
        {children}
      </div>
    </CarouselItem>
  );
}
