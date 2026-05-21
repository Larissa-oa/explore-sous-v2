"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

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
  pageShellContentClass,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";

import { ListingRailCardSurfaceProvider } from "./card-surface-context";
import { listingRailHeaderClassNames, listingRailSlideBasis, listingRailSlideChrome } from "./presets";
import type { ListingRailProps, ListingRailWidthMode } from "./types";

const WidthCtx = createContext<ListingRailWidthMode | null>(null);
const SlideBasisCtx = createContext<string | null>(null);

function useListingRailWidth(): ListingRailWidthMode {
  const v = useContext(WidthCtx);
  if (v == null) throw new Error("ListingRailSlide must be used inside <ListingRail>.");
  return v;
}

function useListingRailSlideBasis(width: ListingRailWidthMode): string {
  const override = useContext(SlideBasisCtx);
  return override ?? listingRailSlideBasis[width];
}

const NAV = "size-9";
const EMBLA = {
  align: "start" as const,
  direction: "ltr" as const,
  loop: false,
  containScroll: "trimSnaps" as const,
};

function HeaderBlock({
  h,
  title,
  titleClassName,
  headerRowClassName,
  headerLeadClassName,
  navClassName,
  description,
  width,
  navLabels,
}: {
  h: ReturnType<typeof listingRailHeaderClassNames>;
  title: ReactNode;
  titleClassName?: string;
  headerRowClassName?: string;
  headerLeadClassName?: string;
  navClassName?: string;
  description: ReactNode | undefined;
  width: ListingRailWidthMode;
  navLabels: ListingRailProps["navLabels"];
}) {
  const inner = (
    <div className={cn(h.row, headerRowClassName)}>
      {h.desktopCenterGrid ? <div aria-hidden className={h.spacer} /> : null}
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
  );

  if (width === "fullBleed") {
    return <div className={pageShellContentClass}>{inner}</div>;
  }

  return inner;
}

export function ListingRail({
  width,
  title,
  description,
  children,
  className,
  listingSurface,
  titleAlignMobile = "start",
  titleAlignDesktop = "start",
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
  const w = useMemo(() => width, [width]);
  const h = listingRailHeaderClassNames({ titleAlignMobile, titleAlignDesktop });

  const inner = (
    <SlideBasisCtx.Provider value={slideBasisClassName ?? null}>
    <WidthCtx.Provider value={w}>
      <Carousel
        aria-label={navLabels.region}
        opts={EMBLA}
        className="relative flex w-full min-w-0 flex-col gap-6"
      >
        <HeaderBlock
          h={h}
          title={title}
          titleClassName={titleClassName}
          headerRowClassName={headerRowClassName}
          headerLeadClassName={headerLeadClassName}
          navClassName={navClassName}
          description={description}
          width={width}
          navLabels={navLabels}
        />
        <div
          className={cn(
            "min-w-0 w-full md:pb-8",
            trackBleedClassName,
            width === "contained" &&
              !trackBleedClassName &&
              "max-sm:relative max-sm:flex max-sm:w-screen max-sm:max-w-[100vw] max-sm:shrink-0 max-sm:overflow-x-clip max-sm:[margin-inline:calc(50%-50vw)]",
          )}
        >
          <CarouselContent
            className={cn(
              "touch-pan-y",
              trackClassName ??
                (width === "contained" ? pageContainedRailBleedTrackInsetClass : undefined),
            )}
          >
            {children}
          </CarouselContent>
        </div>
      </Carousel>
    </WidthCtx.Provider>
    </SlideBasisCtx.Provider>
  );

  const body =
    listingSurface == null ? (
      inner
    ) : (
      <ListingRailCardSurfaceProvider surface={listingSurface}>{inner}</ListingRailCardSurfaceProvider>
    );

  if (width === "fullBleed") {
    return (
      <section
        id={sectionId}
        className={cn(
          "relative w-screen max-w-[100vw] shrink-0 overflow-x-clip [margin-inline:calc(50%-50vw)]",
          pageSectionPaddingYClass,
          className,
        )}
      >
        {body}
      </section>
    );
  }

  return (
    <section id={sectionId} className={cn(pageSectionPaddingYClass, className)}>
      {body}
    </section>
  );
}

export interface ListingRailSlideProps {
  children: ReactNode;
  className?: string;
}

export function ListingRailSlide({ children, className }: ListingRailSlideProps) {
  const width = useListingRailWidth();
  const basis = useListingRailSlideBasis(width);
  return (
    <CarouselItem className={cn(basis, className)}>
      <div data-carousel-slide-chrome className={listingRailSlideChrome(width)}>
        {children}
      </div>
    </CarouselItem>
  );
}
