import { routing } from "@/i18n/routing";

import { cn } from "@/lib/utils";

/**
 * `id` on the homepage hero root — used with `IntersectionObserver` so the navbar
 * can match `--hero-background` while the hero is on screen.
 */
export const SITE_HOME_HERO_ELEMENT_ID = "site-home-hero";

/**
 * `id` on the homepage hero discover search bar — navbar shows the same bar once this
 * element’s bottom scrolls above {@link SITE_HEADER_HEIGHT_CSS_VAR}.
 */
export const SITE_HOME_HERO_SEARCH_ELEMENT_ID = "site-home-hero-search";

/** CSS variable for sticky header height (top bar + navbar). */
export const SITE_HEADER_HEIGHT_CSS_VAR = "--site-header-height";

/** On non-home routes, show navbar discover search after this fraction of viewport scroll. */
export const NAVBAR_DISCOVER_SEARCH_SCROLL_VH = 0.1;

/** Viewport fraction scrolled before open desktop search pickers auto-close (0.15 = 15vh). */
export const SEARCH_PICKER_CLOSE_SCROLL_VH = 0.15;

/**
 * Horizontal padding for the main column — **tighter on small phones**, ramping up with breakpoints.
 */
export const pageContentGutterXClass = "px-4 sm:px-8 md:px-10 lg:px-12 xl:px-14";

/**
 * For rails that break out to full viewport width on `max-sm`, pad the track’s **start** so the first slide
 * lines up with padded copy. Match the **default** step of {@link pageContentGutterXClass} (`px-4` → `pl-4`).
 */
export const pageContainedRailBleedTrackInsetClass = "max-sm:pl-4";

/** Centered page column: **max 1800px** + {@link pageContentGutterXClass}. */
export const pageShellContentClass = cn(
  "mx-auto w-full min-w-0 max-w-[1800px]",
  pageContentGutterXClass,
);

/**
 * Locale layout `<main>` — grows in the flex column and stays at least one viewport
 * below the sticky navbar so sparse pages still require scrolling to reach the footer.
 */
export const pageMainShellClass = cn(
  "flex flex-1 flex-col min-h-[calc(100dvh-var(--site-header-height))]",
);

/**
 * Default vertical padding for stacked **page sections** (category rails, carousels, copy blocks, CTA bands).
 */
export const pageSectionPaddingYClass = "py-14 md:py-16 lg:py-20";

/**
 * Standalone search band — a bit less than {@link pageSectionPaddingYClass} so it stays proportional under the hero.
 */
export const pageSearchBandPaddingYClass = "py-10 md:py-12 lg:py-14";

export const NAVBAR_DEFAULT_SURFACE_CLASS = "bg-background";

/**
 * Hero band surface (`--hero-background` in globals.css). Used by {@link HomeHero} and the navbar on
 * home while the hero is in view.
 */
export const heroBandBackgroundClass = "bg-[var(--hero-background)]";

/** Same surface as {@link heroBandBackgroundClass} (navbar on home while hero is in view). */
export const NAVBAR_HERO_MATCH_SURFACE_CLASS = heroBandBackgroundClass;

export const NAVBAR_SURFACE_TRANSITION_CLASS =
  "transition-[background-color,box-shadow] duration-200 ease-out";

/**
 * Whether the pathname is the localized home route (`/`, `/en`, `/nl`, with optional trailing slash).
 */
export function isLocalizedHomePathname(pathname: string | null): boolean {
  if (pathname == null || pathname === "") return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return true;
  return routing.locales.some((locale) => normalized === `/${locale}`);
}

/**
 * Whether the pathname is the localized discover route (`/discover`, `/en/discover`, …).
 * Navbar discover search stays hidden here — the page has its own sticky filter bar.
 */
export function isLocalizedDiscoverPathname(pathname: string | null): boolean {
  if (pathname == null || pathname === "") return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/discover") return true;
  return routing.locales.some((locale) => normalized === `/${locale}/discover`);
}

/**
 * Navbar surface: white by default; on the home hero it matches the hero band unless
 * mobile search is open (then always white).
 */
export function navbarSurfaceBackgroundClass(input: {
  isHomeRoute: boolean;
  homeHeroInView: boolean;
  /** Text search overlay (desktop/mobile) or discover search sheet on mobile. */
  mobileSearchOpen?: boolean;
  /** Sticky discover search bar in the navbar row. */
  discoverSearchInNavbar?: boolean;
}): string {
  if (input.mobileSearchOpen) return NAVBAR_DEFAULT_SURFACE_CLASS;
  if (input.discoverSearchInNavbar) return NAVBAR_DEFAULT_SURFACE_CLASS;
  if (input.isHomeRoute && input.homeHeroInView) return NAVBAR_HERO_MATCH_SURFACE_CLASS;
  return NAVBAR_DEFAULT_SURFACE_CLASS;
}
