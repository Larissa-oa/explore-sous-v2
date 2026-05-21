import { carouselInterCardGapClass } from "@/components/carousel/gap-classes";
import { cn } from "@/lib/utils";

/** Row/column gap for mosaic rows — same 12px as {@link carouselInterCardGapClass}. */
export const GALLERY_MOSAIC_ROW_GAP_CLASS = carouselInterCardGapClass;

/** Mosaic grid tile surface (clip + placeholder bg). */
export const GALLERY_MOSAIC_TILE_SURFACE_CLASS =
  "overflow-hidden rounded-ds-12 bg-muted";

/** Detail photo — clip frame shrinks to the image (`w-fit`), same max bounds as before. */
export const GALLERY_DETAIL_PHOTO_CLIP_CLASS =
  "w-fit max-w-full max-h-[min(68dvh,720px)] overflow-hidden rounded-ds-12";

export const GALLERY_DETAIL_PHOTO_IMAGE_CLASS =
  "block h-auto w-auto max-h-[min(68dvh,720px)] max-w-full object-contain";

export type MosaicSegment =
  | { layout: "wide"; indices: [number] }
  | { layout: "pair"; indices: [number, number] };

/**
 * Builds row segments for the **1 wide + 2 half** repeating mosaic (desktop + mobile column order).
 * Reusable for any gallery that renders the same pattern (vendors, listings, etc.).
 */
export function buildMosaicSegments(length: number): MosaicSegment[] {
  const out: MosaicSegment[] = [];
  let i = 0;
  while (i < length) {
    const rem = length - i;
    if (rem >= 3) {
      out.push({ layout: "wide", indices: [i] });
      out.push({ layout: "pair", indices: [i + 1, i + 2] });
      i += 3;
    } else if (rem === 2) {
      out.push({ layout: "wide", indices: [i] });
      out.push({ layout: "wide", indices: [i + 1] });
      i += 2;
    } else {
      out.push({ layout: "wide", indices: [i] });
      i += 1;
    }
  }
  return out;
}

export function mosaicTileClass(role: "wide" | "half"): string {
  return cn(
    "relative min-h-0 w-full min-w-0 shrink-0",
    GALLERY_MOSAIC_TILE_SURFACE_CLASS,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    role === "wide" ? "max-md:aspect-video" : "max-md:aspect-[4/3]",
    role === "wide" ? "md:aspect-[16/9]" : "md:aspect-[4/3]",
  );
}

export function mosaicSizesFor(role: "wide" | "half"): string {
  if (role === "wide") {
    return "(max-width: 768px) 92vw, min(896px, 90vw)";
  }
  return "(max-width: 768px) 92vw, min(448px, 46vw)";
}
