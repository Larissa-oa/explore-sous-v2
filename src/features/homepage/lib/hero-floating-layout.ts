import { cn } from "@/lib/utils";

/**
 * Hero image pyramids: desktop side strips + mobile stacked pyramid.
 *
 * Breakpoints: layout uses `max-[989px]` (mobile pyramid) vs `min-[990px]` (desktop strips).
 * Do not introduce dynamic Tailwind class strings (template interpolation); the scanner must see full utilities.
 *
 * Desktop: strips clip overflow; `--hero-inner-edge` drives list translate so inner columns stay visible.
 * Top row nudges toward center; bottom row nudges toward the outer edge (staggered bands).
 *
 * Mobile: `--pyramid-base` scales tile widths; `--pyramid-mobile-top-shift` nudges the top row right.
 * Mobile pyramid: bottom scrim uses `var(--hero-background)` (same as the hero band) and a custom gradient
 * so copy fades earlier; tile motion keyframes live in `globals.css` (`.hero-floating-mosaic`).
 */
export const heroFloatingRootTokens = cn(
  "[--hero-center-half:min(24.5rem,calc(50vw-1rem))]",
  "[--hero-side-strip-w:min(50vw,calc(50vw-var(--hero-center-half)-0.75rem))]",
  "[--hero-tile-gap:8px] min-[990px]:[--hero-tile-gap:13px] min-[1200px]:[--hero-tile-gap:20px]",
  "[--hero-peek:104px]",
  "[--hero-top-row-nudge:clamp(22px,2.5vw,52px)]",
  "[--hero-bottom-row-outset:clamp(10px,1.25vw,28px)]",
  "[--hero-t0-t:183px] [--hero-t1-t:120px] [--hero-t2-t:89px] [--hero-t3-t:43px]",
  "[--hero-b1-b:145px] [--hero-b2-b:96px] [--hero-b3-b:61px]",
  "[--hero-b0:175px]",
  "[--hero-l-xl:calc(var(--hero-peek)-var(--hero-t0-t))]",
  "[--hero-l1:calc(var(--hero-peek)+var(--hero-tile-gap))]",
  "[--hero-l2:calc(var(--hero-l1)+var(--hero-t1-t)+var(--hero-tile-gap))]",
  "[--hero-l3:calc(var(--hero-l2)+var(--hero-t2-t)+var(--hero-tile-gap))]",
  "[--hero-lb1:calc(var(--hero-l-xl)+var(--hero-b1-b)+var(--hero-tile-gap))]",
  "[--hero-lb2:calc(var(--hero-lb1)+var(--hero-b0)+var(--hero-tile-gap))]",
  "[--hero-lb3:calc(var(--hero-lb2)+var(--hero-b2-b)+var(--hero-tile-gap))]",
  "[--hero-r-xl:calc(var(--hero-peek)-var(--hero-t0-t))]",
  "[--hero-r1:calc(var(--hero-peek)+var(--hero-tile-gap))]",
  "[--hero-r2:calc(var(--hero-r1)+var(--hero-t1-t)+var(--hero-tile-gap))]",
  "[--hero-r3:calc(var(--hero-r2)+var(--hero-t2-t)+var(--hero-tile-gap))]",
  "[--hero-rb1:calc(var(--hero-r-xl)+var(--hero-b1-b)+var(--hero-tile-gap))]",
  "[--hero-rb2:calc(var(--hero-rb1)+var(--hero-b0)+var(--hero-tile-gap))]",
  "[--hero-rb3:calc(var(--hero-rb2)+var(--hero-b2-b)+var(--hero-tile-gap))]",
  "[--hero-inner-edge:max(calc(var(--hero-l3)+var(--hero-t3-t)),calc(var(--hero-lb3)+var(--hero-b3-b)))]",
);

// --- Desktop side strips ---

export const heroSideStripLeftClass = cn(
  "pointer-events-none absolute inset-y-0 left-0 z-0 hidden overflow-hidden",
  "w-[var(--hero-side-strip-w)]",
  "min-[990px]:block",
);

export const heroSideStripRightClass = cn(
  "pointer-events-none absolute inset-y-0 right-0 z-0 hidden overflow-hidden",
  "w-[var(--hero-side-strip-w)]",
  "min-[990px]:block",
);

export const heroSideStripListLeftClass = cn(
  "relative m-0 h-full w-full list-none p-0",
  "min-[990px]:translate-x-[min(0px,calc(var(--hero-side-strip-w)-var(--hero-inner-edge)))]",
);

export const heroSideStripListRightClass = cn(
  "relative m-0 h-full w-full list-none p-0",
  "min-[990px]:translate-x-[max(0px,calc(var(--hero-inner-edge)-var(--hero-side-strip-w)))]",
);

/** Positioning on `li`; chrome (radius, clip) lives on {@link heroFloatingSideTileShellClass} inside the tile. */
const sideTileLayoutBase = cn("pointer-events-none absolute");

/** Full tile surface inside side-strip `li` — radius + clip; moves with the image (no shadow). */
export const heroFloatingSideTileShellClass = cn(
  "hero-floating-tile-shell pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]",
);

const zMain = "z-[1]";

const heroRowTopBand = "bottom-[calc(50%+var(--hero-tile-gap)/2)]";
const heroRowBottomBand = "top-[calc(50%+var(--hero-tile-gap)/2)]";

const heroTopRowTowardCenterLeft = "min-[990px]:translate-x-[var(--hero-top-row-nudge)]";
const heroTopRowTowardCenterRight = "min-[990px]:translate-x-[calc(var(--hero-top-row-nudge)*-1)]";

const heroBottomRowTowardOuterLeft = "min-[990px]:translate-x-[calc(var(--hero-bottom-row-outset)*-1)]";
const heroBottomRowTowardOuterRight = "min-[990px]:translate-x-[var(--hero-bottom-row-outset)]";

/** Tile dimensions reference `heroFloatingRootTokens` so positions and sizes stay in sync. */
const heroTileT0 = "h-[var(--hero-t0-t)] w-[var(--hero-t0-t)]";
const heroTileT1 = "h-[var(--hero-t1-t)] w-[var(--hero-t1-t)]";
const heroTileT2 = "h-[var(--hero-t2-t)] w-[var(--hero-t2-t)]";
const heroTileT3 = "h-[var(--hero-t3-t)] w-[var(--hero-t3-t)]";
const heroTileB0 = "h-[var(--hero-b0)] w-[var(--hero-b0)]";
const heroTileB1 = "h-[var(--hero-b1-b)] w-[var(--hero-b1-b)]";
const heroTileB2 = "h-[var(--hero-b2-b)] w-[var(--hero-b2-b)]";
const heroTileB3 = "h-[var(--hero-b3-b)] w-[var(--hero-b3-b)]";

// --- Desktop left strip tiles ---

export const heroLeftXlTopClass = cn(
  sideTileLayoutBase,
  "z-0 hidden min-[990px]:block",
  "left-[var(--hero-l-xl)]",
  heroTileT0,
  heroTopRowTowardCenterLeft,
  heroRowTopBand,
);

export const heroLeftXlBottomClass = cn(
  sideTileLayoutBase,
  "z-0 hidden min-[990px]:block",
  "left-[var(--hero-l-xl)]",
  heroTileB1,
  heroBottomRowTowardOuterLeft,
  heroRowBottomBand,
);

export const heroLeftColTopClasses: readonly string[] = [
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-l1)]",
    heroTileT1,
    heroTopRowTowardCenterLeft,
    heroRowTopBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-l2)]",
    heroTileT2,
    heroTopRowTowardCenterLeft,
    heroRowTopBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-l3)]",
    heroTileT3,
    heroTopRowTowardCenterLeft,
    heroRowTopBand,
  ),
];

export const heroLeftColBottomClasses: readonly string[] = [
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-lb1)]",
    heroTileB0,
    "hidden min-[1200px]:block",
    heroBottomRowTowardOuterLeft,
    heroRowBottomBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-lb2)]",
    heroTileB2,
    heroBottomRowTowardOuterLeft,
    heroRowBottomBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "left-[var(--hero-lb3)]",
    heroTileB3,
    heroBottomRowTowardOuterLeft,
    heroRowBottomBand,
  ),
];

// --- Desktop right strip tiles ---

export const heroRightXlTopClass = cn(
  sideTileLayoutBase,
  "z-0 hidden min-[990px]:block",
  "right-[var(--hero-r-xl)]",
  heroTileT0,
  heroTopRowTowardCenterRight,
  heroRowTopBand,
);

export const heroRightXlBottomClass = cn(
  sideTileLayoutBase,
  "z-0 hidden min-[990px]:block",
  "right-[var(--hero-r-xl)]",
  heroTileB1,
  heroBottomRowTowardOuterRight,
  heroRowBottomBand,
);

export const heroRightColTopClasses: readonly string[] = [
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-r1)]",
    heroTileT1,
    heroTopRowTowardCenterRight,
    heroRowTopBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-r2)]",
    heroTileT2,
    heroTopRowTowardCenterRight,
    heroRowTopBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-r3)]",
    heroTileT3,
    heroTopRowTowardCenterRight,
    heroRowTopBand,
  ),
];

export const heroRightColBottomClasses: readonly string[] = [
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-rb1)]",
    heroTileB0,
    "hidden min-[1200px]:block",
    heroBottomRowTowardOuterRight,
    heroRowBottomBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-rb2)]",
    heroTileB2,
    heroBottomRowTowardOuterRight,
    heroRowBottomBand,
  ),
  cn(
    sideTileLayoutBase,
    zMain,
    "right-[var(--hero-rb3)]",
    heroTileB3,
    heroBottomRowTowardOuterRight,
    heroRowBottomBand,
  ),
];

// --- Mobile pyramid ---

export const heroMobilePyramidClass = cn(
  "relative hidden w-full min-w-0 flex-col items-center gap-[var(--hero-tile-gap)] max-[989px]:flex",
  "max-[989px]:max-w-none max-[989px]:shrink-0",
  "max-[989px]:[padding-inline:max(0px,calc((100vw-min(48rem,100vw))/2))]",
  "[--pyramid-base:clamp(0.9rem,calc(0.38rem+1.6vw),2rem)]",
  "[--pyramid-top-right-drop:clamp(13px,calc(var(--pyramid-base)*1.1),24px)]",
  "max-[989px]:[--pyramid-mobile-top-shift:2rem] sm:max-[989px]:[--pyramid-mobile-top-shift:2.5rem]",
  /* Pyramid block: grow spacer only < md (767px); tablet uses compact stack + shorter scrim */
  "max-[767px]:[padding-top:calc(var(--pyramid-base)*3.2)]",
  "min-[768px]:max-[989px]:[padding-top:calc(var(--pyramid-base)*1.05)]",
  "max-[767px]:pb-[max(0.875rem,calc(0.375rem+env(safe-area-inset-bottom,0px)))]",
  "min-[768px]:max-[989px]:pb-[max(0px,env(safe-area-inset-bottom,0px))]",
  /* Shorter scrim on tablet — tall after was reading as a big empty band under the tiles */
  "after:pointer-events-none after:absolute after:-inset-x-6 after:bottom-0 after:z-[4] after:hidden after:h-[min(82%,28rem)] after:content-['']",
  "min-[768px]:max-[989px]:after:h-[min(34%,9rem)]",
  "after:bg-[linear-gradient(to_top,var(--hero-background)_0%,color-mix(in_srgb,var(--hero-background)_82%,transparent)_24%,color-mix(in_srgb,var(--hero-background)_38%,transparent)_48%,transparent_100%)]",
  "max-[989px]:after:block",
);

export const heroMobileRowTop = cn(
  "m-0 flex w-full max-w-none list-none items-end gap-[var(--hero-tile-gap)] p-0",
  "max-[989px]:justify-center max-[989px]:px-3 sm:max-[989px]:px-5",
  "max-[989px]:translate-x-[var(--pyramid-mobile-top-shift,0px)]",
);

export const heroMobileRowBottom = cn(
  "m-0 flex w-full max-w-none list-none items-end justify-center gap-[var(--hero-tile-gap)] p-0",
);

const mobileTileLayoutBase = cn(
  "relative z-[1] aspect-square shrink-0",
  "max-[989px]:translate-y-[var(--mobile-item-offset-y,0)]",
);

/** Full tile surface inside mobile pyramid `li` — no drop shadow on small screens. */
export const heroFloatingMobileTileShellClass = cn(
  "hero-floating-tile-shell pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]",
  "max-[989px]:shadow-none",
);

export const heroMobileTopLeft = cn(
  mobileTileLayoutBase,
  "w-[calc(var(--pyramid-base)*4.4)]",
);

export const heroMobileTopRight = cn(
  mobileTileLayoutBase,
  "w-[calc(var(--pyramid-base)*6.2)] max-[989px]:[--mobile-item-offset-y:var(--pyramid-top-right-drop)]",
);

const mobileBottomWidths = [
  "w-[calc(var(--pyramid-base)*3.9)]",
  "w-[calc(var(--pyramid-base)*6.6)]",
  "w-[calc(var(--pyramid-base)*10.75)]",
  "w-[calc(var(--pyramid-base)*9.5)]",
  "w-[calc(var(--pyramid-base)*6.2)]",
  "w-[calc(var(--pyramid-base)*3.5)]",
] as const;

export const heroMobileBottomTileClasses: readonly string[] = mobileBottomWidths.map((widthClass) =>
  cn(mobileTileLayoutBase, widthClass),
);

/** `next/image` sizes for tiles inside the mobile pyramid (hidden from desktop layout). */
export const heroMobilePyramidImageSizes = "(max-width: 989px) 16vw, 1px";
