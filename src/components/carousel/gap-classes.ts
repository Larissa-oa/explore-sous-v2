/**
 * Carousel track/grid gap tokens — no React, safe to import from Server Components.
 * Keep in sync with slide `basis` math in `presets.ts` (12px → two gaps = 24px).
 */
export const carouselInterCardGapClass = "gap-[12px]";

/** Same gap for category grids so cards line up with listing rails. */
export const sectionCardGridGapClass = carouselInterCardGapClass;
