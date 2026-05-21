import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";

import { HERO_FLOATING_IMAGE_URLS } from "@/lib/data/hero-floating-images";
import { HOME_MAIN_CONTENT_ID } from "@/features/homepage/lib/home-section-ids";
import { heroBandBackgroundClass, SITE_HOME_HERO_ELEMENT_ID } from "@/lib/site-layout";
import {
  heroFloatingMobileTileShellClass,
  heroFloatingRootTokens,
  heroFloatingSideTileShellClass,
  heroLeftColBottomClasses,
  heroLeftColTopClasses,
  heroLeftXlBottomClass,
  heroLeftXlTopClass,
  heroMobileBottomTileClasses,
  heroMobilePyramidClass,
  heroMobilePyramidImageSizes,
  heroMobileRowBottom,
  heroMobileRowTop,
  heroMobileTopLeft,
  heroMobileTopRight,
  heroRightColBottomClasses,
  heroRightColTopClasses,
  heroRightXlBottomClass,
  heroRightXlTopClass,
  heroSideStripLeftClass,
  heroSideStripListLeftClass,
  heroSideStripListRightClass,
  heroSideStripRightClass,
} from "@/features/homepage/lib/hero-floating-layout";
import { cn } from "@/lib/utils";

import { HomeHeroFloatingMotionProvider, HomeHeroFloatingMosaic } from "./home-hero-floating-motion";
import { HomeHeroTrust } from "./home-hero-trust";
import { HomeSearchBar } from "./home-search-bar";

const URLS = HERO_FLOATING_IMAGE_URLS;

const heroExploreSkipLinkClass = cn(
  "absolute bottom-10 left-1/2 z-[4] inline-flex w-max -translate-x-1/2 items-center gap-2 text-sm text-foreground/65 no-underline transition-colors",
  "hover:text-foreground max-[989px]:hidden",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

type HeroImageTileKind = "side" | "mobile";

function HeroImageTile({
  src,
  alt,
  className,
  sizes,
  tileKind = "side",
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  tileKind?: HeroImageTileKind;
}) {
  const shellClass = tileKind === "side" ? heroFloatingSideTileShellClass : heroFloatingMobileTileShellClass;

  return (
    <li className={className}>
      <div className={shellClass}>
        <span className="pointer-events-none absolute inset-0 block">
          <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
        </span>
      </div>
    </li>
  );
}

export async function HomeHero() {
  const t = await getTranslations("HomePage.hero");
  const alt = t("imageAlt");

  const leftMain = URLS.slice(0, 6);
  const rightMain = URLS.slice(6, 12);
  const xlLeft = [URLS[12], URLS[13]] as const;
  const xlRight = [URLS[14], URLS[15]] as const;
  const mobileTop = [URLS[14], URLS[15]] as const;
  const mobileBottom = URLS.slice(6, 12);

  const sideSizes =
    "(max-width: 989px) 20vw, (max-width: 1199px) 22vw, (max-width: 1600px) 260px, 320px";
  const xlSizes = "(max-width: 989px) 1px, (max-width: 1199px) 180px, 280px";

  return (
    <section
      id={SITE_HOME_HERO_ELEMENT_ID}
      className={cn(
        "relative z-[9] w-screen max-w-[100vw] shrink-0 overflow-x-clip",
        "[margin-inline:calc(50%-50vw)]",
        heroBandBackgroundClass,
        "pb-28 pt-14 md:pb-32 md:pt-20",
        "max-[989px]:pb-[max(0.25rem,env(safe-area-inset-bottom,0px))] max-[989px]:pt-12",
        "max-[767px]:flex max-[767px]:min-h-[min(72svh,40rem)] max-[767px]:flex-col",
        "min-[768px]:max-[989px]:min-h-0",
        heroFloatingRootTokens,
      )}
    >
      <div
        className={cn(
          "w-full max-w-none px-0",
          "max-[767px]:flex max-[767px]:min-h-0 max-[767px]:flex-1 max-[767px]:flex-col",
        )}
      >
        <HomeHeroFloatingMotionProvider>
          <div
            className={cn(
              "relative flex min-h-0 items-center justify-center",
              "min-[990px]:max-h-[85vh] min-[990px]:min-h-[min(32rem,85vh)]",
              "max-[989px]:flex max-[989px]:flex-col max-[989px]:items-stretch max-[989px]:justify-start max-[989px]:overflow-x-clip max-[989px]:pt-2",
              "max-[767px]:flex-1",
            )}
          >
            <HomeHeroFloatingMosaic>
              <div className={heroSideStripLeftClass} aria-hidden>
                <ul className={heroSideStripListLeftClass} role="presentation">
                  <HeroImageTile src={xlLeft[0]} alt={alt} className={heroLeftXlTopClass} sizes={xlSizes} />
                  {leftMain.slice(0, 3).map((src, i) => (
                    <HeroImageTile
                      key={src}
                      src={src}
                      alt={alt}
                      className={heroLeftColTopClasses[i] ?? ""}
                      sizes={sideSizes}
                    />
                  ))}
                  <HeroImageTile
                    key={xlLeft[1]}
                    src={xlLeft[1]}
                    alt={alt}
                    className={heroLeftColBottomClasses[0] ?? ""}
                    sizes={sideSizes}
                  />
                  {leftMain.slice(4, 6).map((src, i) => (
                    <HeroImageTile
                      key={src}
                      src={src}
                      alt={alt}
                      className={heroLeftColBottomClasses[i + 1] ?? ""}
                      sizes={sideSizes}
                    />
                  ))}
                  <HeroImageTile
                    key={leftMain[3]}
                    src={leftMain[3]}
                    alt={alt}
                    className={heroLeftXlBottomClass}
                    sizes={xlSizes}
                  />
                </ul>
              </div>
            </HomeHeroFloatingMosaic>

            <div
              className={cn(
                "relative z-[4] mx-auto w-full max-w-3xl px-4 text-center sm:px-5",
                "max-[989px]:flex max-[989px]:max-w-full max-[989px]:shrink-0 max-[989px]:flex-col max-[989px]:px-4 max-[989px]:py-0",
                "min-[990px]:mx-0 min-[990px]:max-w-[min(88rem,calc(100vw-3rem))] min-[990px]:px-8 lg:px-10 xl:px-12",
              )}
            >
              <div className="mx-auto w-full max-w-3xl text-center">
                <h1
                  className={cn(
                    "m-0 text-balance font-semibold leading-[1.06] tracking-[-0.04em] text-ds-blue-900",
                    "max-[767px]:text-[clamp(1.625rem,7vw,2.25rem)]",
                    "min-[768px]:text-[56px]",
                  )}
                >
                  <span className="block">{t("titleLine1")}</span>
                  <span className="block">{t("titleLine2")}</span>
                </h1>
                <p
                  className={cn(
                    "mx-auto mt-5 max-w-[36ch] text-pretty text-[18px] font-medium leading-[1.5] text-muted-foreground",
                    "max-[767px]:mt-4",
                  )}
                >
                  {t("subtitle")}
                </p>
              </div>

              <div className="relative z-20 mt-8 w-full md:mt-10">
                <HomeSearchBar embedded />
              </div>

              <HomeHeroTrust />
            </div>

            <div
              className="hidden max-[767px]:block max-[767px]:min-h-0 max-[767px]:basis-0 max-[767px]:grow"
              aria-hidden
            />

            <HomeHeroFloatingMosaic>
              <div className={heroMobilePyramidClass} aria-hidden role="presentation">
                <ul className={heroMobileRowTop} role="presentation">
                  <HeroImageTile
                    src={mobileTop[0]}
                    alt={alt}
                    className={heroMobileTopLeft}
                    sizes={heroMobilePyramidImageSizes}
                    tileKind="mobile"
                  />
                  <HeroImageTile
                    src={mobileTop[1]}
                    alt={alt}
                    className={heroMobileTopRight}
                    sizes={heroMobilePyramidImageSizes}
                    tileKind="mobile"
                  />
                </ul>
                <ul className={heroMobileRowBottom} role="presentation">
                  {mobileBottom.map((src, i) => (
                    <HeroImageTile
                      key={src}
                      src={src}
                      alt={alt}
                      className={heroMobileBottomTileClasses[i] ?? ""}
                      sizes={heroMobilePyramidImageSizes}
                      tileKind="mobile"
                    />
                  ))}
                </ul>
              </div>
            </HomeHeroFloatingMosaic>

            <HomeHeroFloatingMosaic>
              <div className={heroSideStripRightClass} aria-hidden>
                <ul className={heroSideStripListRightClass} role="presentation">
                  <HeroImageTile src={xlRight[0]} alt={alt} className={heroRightXlTopClass} sizes={xlSizes} />
                  {rightMain.slice(0, 3).map((src, i) => (
                    <HeroImageTile
                      key={src}
                      src={src}
                      alt={alt}
                      className={heroRightColTopClasses[i] ?? ""}
                      sizes={sideSizes}
                    />
                  ))}
                  <HeroImageTile
                    key={xlRight[1]}
                    src={xlRight[1]}
                    alt={alt}
                    className={heroRightColBottomClasses[0] ?? ""}
                    sizes={sideSizes}
                  />
                  {rightMain.slice(4, 6).map((src, i) => (
                    <HeroImageTile
                      key={src}
                      src={src}
                      alt={alt}
                      className={heroRightColBottomClasses[i + 1] ?? ""}
                      sizes={sideSizes}
                    />
                  ))}
                  <HeroImageTile
                    key={rightMain[3]}
                    src={rightMain[3]}
                    alt={alt}
                    className={heroRightXlBottomClass}
                    sizes={xlSizes}
                  />
                </ul>
              </div>
            </HomeHeroFloatingMosaic>
          </div>
        </HomeHeroFloatingMotionProvider>
      </div>

      <a href={`#${HOME_MAIN_CONTENT_ID}`} className={heroExploreSkipLinkClass}>
        <span>{t("exploreSous")}</span>
        <ChevronDown className="size-4 shrink-0" aria-hidden strokeWidth={2} />
      </a>
    </section>
  );
}
