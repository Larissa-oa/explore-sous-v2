"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import { ImageGalleryModal } from "@/components/image-gallery-modal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface VendorGalleryImage {
  src: string;
  alt: string;
}

const MAX_STRIP_IMAGES = 3;

interface VendorImageGalleryProps {
  images: VendorGalleryImage[];
  /** Accessible name for the gallery region. */
  galleryRegionLabel: string;
  /** Heading shown in the full-screen image gallery modal. */
  galleryOverviewTitle: string;
  viewAllPhotosLabel: string;
  className?: string;
}

/** 12px between gallery images — Framer spacing (3 × 4px). */
const GALLERY_GAP = "gap-[12px]";

const TILE_BUTTON =
  "relative min-h-0 w-full min-w-0 overflow-hidden rounded-ds-12 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

/** Shared strip height (0.8× prior 21 / 24 / 27 rem — 0.2 shorter). */
const STRIP_HEIGHT_CLASS = "h-[16.8rem] sm:h-[19.2rem] md:h-[21.6rem]";

/** Contained slider: full-viewport bleed wrapper; inner wrapper adds start inset only (Embla bleeds right). */
const MOBILE_GALLERY_CONTAINED_TRACK = cn(
  "max-md:relative max-md:flex max-md:w-screen max-md:max-w-[100vw] max-md:shrink-0 max-md:overflow-x-clip max-md:[margin-inline:calc(50%-50vw)]",
);

/** Start inset only — matches shell `pl-4 sm:pl-8`; track bleeds flush to the viewport right. */
const MOBILE_GALLERY_TRACK_LEAD_INSET = "pl-4 sm:pl-8 pr-0";

function GalleryImageFill({
  item,
  sizes,
  priority,
}: {
  item: VendorGalleryImage;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      priority={priority}
      className="object-cover"
      sizes={sizes}
    />
  );
}

export function VendorImageGallery({
  images,
  galleryRegionLabel,
  galleryOverviewTitle,
  viewAllPhotosLabel,
  className,
}: VendorImageGalleryProps) {
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const openGalleryModal = useCallback(() => setGalleryModalOpen(true), []);

  const list = useMemo(() => images.filter((i) => i.src), [images]);
  const stripList = useMemo(
    () => list.slice(0, MAX_STRIP_IMAGES),
    [list],
  );
  const showViewAllButton = list.length >= MAX_STRIP_IMAGES;

  if (list.length === 0) return null;

  return (
    <>
      <section
        aria-label={galleryRegionLabel}
        className={cn("w-full min-w-0", className)}
      >
        {/* Mobile: left gutter + full-bleed right (ListingRail-style track). */}
        <div
          className={cn(
            "md:hidden flex min-h-0 min-w-0 flex-col",
            MOBILE_GALLERY_CONTAINED_TRACK,
            STRIP_HEIGHT_CLASS,
          )}
        >
          <div
            className={cn(
              "box-border flex min-h-0 w-full min-w-0 flex-1 flex-col",
              MOBILE_GALLERY_TRACK_LEAD_INSET,
            )}
          >
            <Carousel
              opts={{ align: "start", loop: stripList.length > 1 }}
              className="h-full min-h-0 w-full min-w-0"
            >
              <CarouselContent className="h-full">
                {stripList.map((item, index) => {
                  const isLastStrip = index === stripList.length - 1;
                  const withOverlay = isLastStrip && showViewAllButton;

                  const slide = (
                    <button
                      type="button"
                      onClick={openGalleryModal}
                      className={cn(TILE_BUTTON, "h-full w-full")}
                    >
                      <GalleryImageFill
                        item={item}
                        priority={index === 0}
                        sizes="(max-width: 768px) 88vw, 0px"
                      />
                    </button>
                  );

                  return (
                    <CarouselItem
                      key={`${item.src}-${index}`}
                      className="h-full basis-[min(88vw,24rem)] shrink-0 self-stretch"
                    >
                      {withOverlay ? (
                        <div className="relative h-full min-h-0 w-full">
                          {slide}
                          <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3">
                            <Button
                              type="button"
                              variant="secondary"
                              className="pointer-events-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGalleryModal();
                              }}
                            >
                              {viewAllPhotosLabel}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        slide
                      )}
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Desktop: one row, equal height; at most three tiles; “View all” on rightmost when ≥3 images */}
        <div
          className={cn("hidden min-h-0 w-full md:flex", STRIP_HEIGHT_CLASS, GALLERY_GAP)}
        >
          {stripList.length === 1 ? (
            <button
              type="button"
              onClick={openGalleryModal}
              className={cn(TILE_BUTTON, "min-h-0 flex-1")}
            >
              <GalleryImageFill
                item={stripList[0]}
                priority
                sizes="(min-width: 768px) 90vw, 0px"
              />
            </button>
          ) : null}

          {stripList.length === 2
            ? stripList.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={openGalleryModal}
                  className={cn(TILE_BUTTON, "min-h-0 flex-1 basis-0")}
                >
                  <GalleryImageFill
                    item={item}
                    priority={index === 0}
                    sizes="(min-width: 768px) 45vw, 0px"
                  />
                </button>
              ))
            : null}

          {stripList.length >= 3 ? (
            <>
              <button
                type="button"
                onClick={openGalleryModal}
                className={cn(TILE_BUTTON, "min-h-0 flex-[2] basis-0")}
              >
                <GalleryImageFill
                  item={stripList[0]}
                  priority
                  sizes="(min-width: 768px) 50vw, 0px"
                />
              </button>
              <button
                type="button"
                onClick={openGalleryModal}
                className={cn(TILE_BUTTON, "min-h-0 flex-1 basis-0")}
              >
                <GalleryImageFill
                  item={stripList[1]}
                  sizes="(min-width: 768px) 25vw, 0px"
                />
              </button>
              <div className="relative min-h-0 min-w-0 flex-1 basis-0">
                <button
                  type="button"
                  onClick={openGalleryModal}
                  className={cn(TILE_BUTTON, "h-full min-h-0 w-full")}
                >
                  <GalleryImageFill
                    item={stripList[2]}
                    sizes="(min-width: 768px) 25vw, 0px"
                  />
                </button>
                {showViewAllButton ? (
                  <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGalleryModal();
                      }}
                    >
                      {viewAllPhotosLabel}
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <ImageGalleryModal
        open={galleryModalOpen}
        onOpenChange={setGalleryModalOpen}
        images={list}
        overviewTitle={galleryOverviewTitle}
      />
    </>
  );
}
