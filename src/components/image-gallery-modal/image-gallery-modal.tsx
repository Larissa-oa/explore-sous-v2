"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLeft, X } from "lucide-react";

import { CarouselChevronNavButton } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  buildMosaicSegments,
  GALLERY_DETAIL_PHOTO_CLIP_CLASS,
  GALLERY_DETAIL_PHOTO_IMAGE_CLASS,
  GALLERY_MOSAIC_ROW_GAP_CLASS,
  mosaicSizesFor,
  mosaicTileClass,
} from "./gallery-mosaic-layout";
import type { ImageGalleryItem } from "./types";

export interface ImageGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ImageGalleryItem[];
  /** Modal heading (e.g. vendor name). */
  overviewTitle: string;
}

const dialogSurface = cn(
  "flex min-h-0 flex-col overflow-hidden border border-border bg-card p-0 text-card-foreground shadow-lg outline-none",
  "max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:max-h-[85vh] max-md:w-full max-md:max-w-none max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-b-none max-md:rounded-t-ds-16 max-md:border-x-0 max-md:border-b-0 max-md:border-t max-md:p-4 max-md:pt-3 max-md:pb-[max(1rem,env(safe-area-inset-bottom))]",
  "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[min(90vh,900px)] md:w-[calc(100%-2rem)] md:max-w-5xl md:rounded-ds-16 md:p-6",
);

const dialogMotion = cn(
  "gap-4 duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
  "max-md:data-[state=open]:slide-in-from-bottom-6 max-md:data-[state=closed]:slide-out-to-bottom-6",
  "md:data-[state=open]:zoom-in-95 md:data-[state=closed]:zoom-out-95",
);

const galleryTitleClass =
  "text-xl font-semibold tracking-tight text-foreground";

/**
 * Reusable **photo grid + full-screen image** lightbox: mobile bottom sheet, desktop dialog; chevron prev/next in detail view.
 * Strings come from **`ImageGalleryModal`** (`next-intl`); pass `overviewTitle` from the host (e.g. venue name).
 */
export function ImageGalleryModal({
  open,
  onOpenChange,
  images,
  overviewTitle,
}: ImageGalleryModalProps) {
  const t = useTranslations("ImageGalleryModal");
  const [phase, setPhase] = React.useState<"grid" | "detail">("grid");
  const [detailIndex, setDetailIndex] = React.useState(0);

  const list = React.useMemo(() => images.filter((i) => i.src), [images]);
  const mosaicSegments = React.useMemo(() => buildMosaicSegments(list.length), [list.length]);

  React.useEffect(() => {
    if (!open) {
      setPhase("grid");
      setDetailIndex(0);
    }
  }, [open]);

  const openDetail = React.useCallback((index: number) => {
    setDetailIndex(index);
    setPhase("detail");
  }, []);

  const backToGrid = React.useCallback(() => {
    setPhase("grid");
  }, []);

  const goDetailPrev = React.useCallback(() => {
    setDetailIndex((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const goDetailNext = React.useCallback(() => {
    setDetailIndex((i) => (i + 1) % list.length);
  }, [list.length]);

  const handleEscapeKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (phase === "detail") {
        event.preventDefault();
        setPhase("grid");
      }
    },
    [phase],
  );

  React.useEffect(() => {
    if (!open || phase !== "detail" || list.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goDetailPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goDetailNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase, list.length, goDetailPrev, goDetailNext]);

  const detailItem = list[detailIndex];
  const showDetailNav = list.length > 1;

  if (list.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        onEscapeKeyDown={handleEscapeKeyDown}
        className={cn(
          dialogSurface,
          dialogMotion,
          phase === "detail" &&
            "max-md:h-auto max-md:max-h-[85vh] md:h-[min(90vh,900px)] md:max-h-[min(90vh,900px)]",
        )}
      >
        {phase === "grid" ? (
          <div className="flex w-full shrink-0 items-start justify-between gap-4 pr-2">
            <DialogTitle className={galleryTitleClass}>{overviewTitle}</DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label={t("close")}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="flex w-full shrink-0 items-center gap-3 pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              aria-label={t("backToGrid")}
              onClick={backToGrid}
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Button>
            <DialogTitle className={cn(galleryTitleClass, "min-w-0 flex-1 truncate")}>
              {overviewTitle}
            </DialogTitle>
            <p className="sr-only" aria-live="polite">
              {t("detailProgress", {
                current: detailIndex + 1,
                total: list.length,
              })}
            </p>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label={t("close")}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </DialogClose>
          </div>
        )}

        {phase === "grid" ? (
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain",
              "flex flex-col",
              GALLERY_MOSAIC_ROW_GAP_CLASS,
            )}
          >
                {mosaicSegments.map((seg) =>
                  seg.layout === "pair" ? (
                    <div
                      key={`mosaic-pair-${seg.indices[0]}-${seg.indices[1]}`}
                      className={cn(
                        "grid w-full grid-cols-1 md:grid-cols-2",
                        GALLERY_MOSAIC_ROW_GAP_CLASS,
                      )}
                    >
                      {seg.indices.map((idx) => {
                        const item = list[idx]!;
                        return (
                          <button
                            key={`mosaic-${item.src}-${idx}`}
                            type="button"
                            onClick={() => openDetail(idx)}
                            className={mosaicTileClass("half")}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes={mosaicSizesFor("half")}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div key={`mosaic-wide-${seg.indices[0]}`} className="w-full min-w-0">
                      {seg.indices.map((idx) => {
                        const item = list[idx]!;
                        return (
                          <button
                            key={`mosaic-${item.src}-${idx}`}
                            type="button"
                            onClick={() => openDetail(idx)}
                            className={mosaicTileClass("wide")}
                          >
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes={mosaicSizesFor("wide")}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ),
                )}
          </div>
        ) : detailItem ? (
          <div className="relative min-h-0 w-full flex-1 bg-transparent">
            {showDetailNav ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center md:left-2">
                  <CarouselChevronNavButton
                    direction="previous"
                    aria-label={t("previousPhoto")}
                    className="pointer-events-auto shadow-sm"
                    onClick={goDetailPrev}
                  />
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center md:right-2">
                  <CarouselChevronNavButton
                    direction="next"
                    aria-label={t("nextPhoto")}
                    className="pointer-events-auto shadow-sm"
                    onClick={goDetailNext}
                  />
                </div>
              </>
            ) : null}

            <div className="flex h-full w-full items-center justify-center md:absolute md:inset-0">
              <div className={GALLERY_DETAIL_PHOTO_CLIP_CLASS}>
                <Image
                  key={detailItem.src}
                  src={detailItem.src}
                  alt={detailItem.alt}
                  width={1920}
                  height={1080}
                  className={GALLERY_DETAIL_PHOTO_IMAGE_CLASS}
                  sizes="(max-width: 768px) 100vw, min(896px, 90vw)"
                  priority
                />
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
