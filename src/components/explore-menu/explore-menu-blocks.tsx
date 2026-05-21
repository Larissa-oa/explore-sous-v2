"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { discoveryCategoryHref } from "@/lib/discovery/discovery-query";
import { HERO_TRUST_AVATAR_URLS } from "@/lib/data/hero-trust-avatars";
import { cn } from "@/lib/utils";
import type { ExploreMenuCategorySerialized } from "@/types/explore-menu";

import {
  EXPLORE_MAIN_CONTENT_HREF,
  exploreCategoryImageSizes,
  MEGA_HOW_IT_WORKS_LINK_CLASS,
  MEGA_LEFT_FOOTER_ROW_CLASS,
} from "./explore-menu-constants";

export type { ExploreMenuTrendingListProps } from "./explore-menu-trending";
export { ExploreMenuTrendingList } from "./explore-menu-trending";

const AVATAR_ALT_KEYS = ["trustAvatar1Alt", "trustAvatar2Alt", "trustAvatar3Alt"] as const;

function categoryCardClassForLayout(layout: "default" | "mega" | "mobileSheet") {
  if (layout === "mega") {
    return cn(
      "group relative block w-full max-w-full overflow-hidden rounded-ds-12 border-0 bg-muted shadow-none",
      "aspect-square min-h-0",
    );
  }
  if (layout === "mobileSheet") {
    return cn(
      "group relative block w-full overflow-hidden rounded-ds-10 border-0 bg-muted shadow-none",
      "aspect-[1.32/1] max-h-[9.45rem] min-h-[7.35rem]",
    );
  }
  return cn(
    "group relative block w-full overflow-hidden rounded-ds-12 border-0 bg-muted shadow-none",
    "aspect-[18/10] sm:aspect-[16/10]",
  );
}

export function ExploreMenuCategoryColumn({
  categories,
  className,
  layout = "default",
}: {
  categories: ExploreMenuCategorySerialized[];
  className?: string;
  layout?: "default" | "mega" | "mobileSheet";
}) {
  const t = useTranslations("HomePage.search.categories");
  const tExploreNav = useTranslations("SiteNavbar.explore");
  const cardClass = categoryCardClassForLayout(layout);
  const imageSizes = exploreCategoryImageSizes(layout);

  const tiles = categories.map((card, index) => (
    <SheetClose asChild key={card.id}>
      <Link href={discoveryCategoryHref(card.id)} className={cardClass}>
        <Image
          src={card.imageSrc}
          alt=""
          fill
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            layout === "mega" && "scale-105 object-right-bottom group-hover:scale-[1.08]",
            layout !== "mega" && "group-hover:scale-[1.03]",
          )}
          sizes={imageSizes}
          priority={index === 0}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 bg-gradient-to-t from-black/14 via-black/[0.05] to-transparent"
          aria-hidden
        />
        <div
          className={cn(
            "absolute inset-0 z-[2] flex flex-col justify-start items-start",
            layout === "mega"
              ? "px-3 pt-2.5 pb-2 sm:px-3.5 sm:pt-3"
              : layout === "mobileSheet"
                ? "px-3 pt-2.5 pb-2"
                : "p-4 pt-4 md:p-5",
          )}
        >
          <div className="flex items-center gap-1.5 md:gap-2">
            <h3
              className={cn(
                "type-h6-sb text-black",
                layout === "mega" && "text-sm font-semibold sm:text-[0.9375rem]",
                layout === "mobileSheet" && "text-base font-semibold leading-tight",
              )}
            >
              {t(card.id)}
            </h3>
            <ArrowUpRight
              className={cn(
                "shrink-0 text-black",
                layout === "mega" ? "size-4 sm:size-[1.125rem]" : layout === "mobileSheet" ? "size-5" : "size-4 sm:size-5",
              )}
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </SheetClose>
  ));

  if (layout === "mega") {
    return (
      <div className={cn("flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 sm:gap-3.5", className)}>
        <p className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          {tExploreNav("categoriesSectionLabel")}
        </p>
        <div className="grid min-h-0 w-full flex-1 grid-cols-3 content-start items-start gap-3 sm:gap-4">
          {tiles}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-2.5",
        layout === "mobileSheet" && "w-full max-w-none",
        className,
      )}
    >
      {tiles}
    </div>
  );
}

export function ExploreMenuTrustStrip({
  className,
  density = "default",
}: {
  className?: string;
  density?: "default" | "compact";
}) {
  const t = useTranslations("HomePage.hero");

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-start gap-2.5 border-0 bg-transparent p-0 text-left shadow-none sm:gap-3",
        density === "compact" && "max-w-[24rem] shrink-0",
        density === "default" && "max-w-[min(100%,28rem)]",
        className,
      )}
    >
      <div className="flex shrink-0 -space-x-2">
        {HERO_TRUST_AVATAR_URLS.map((src, i) => (
          <span
            key={src}
            className={cn(
              "relative overflow-hidden rounded-full border-2 border-ds-clay-50 bg-muted ring-1 ring-border/60",
              density === "compact" ? "size-8 sm:size-9" : "size-9 sm:size-10",
            )}
          >
            <Image
              src={src}
              alt={t(AVATAR_ALT_KEYS[i] ?? "trustAvatar1Alt")}
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5 text-left">
        <p
          className={cn(
            "font-medium leading-snug text-foreground",
            density === "compact" ? "text-xs sm:text-sm" : "text-sm",
          )}
        >
          {t("trustTitle")}
        </p>
        <p
          className={cn(
            "font-normal leading-snug text-muted-foreground",
            density === "compact" ? "text-[0.6875rem] sm:text-xs" : "text-xs sm:text-sm",
          )}
        >
          {t("trustSubtitle")}
        </p>
      </div>
    </div>
  );
}

export function ExploreMenuMegaLeftFooter({ className }: { className?: string }) {
  const t = useTranslations("SiteNavbar.explore");

  return (
    <div className={cn(MEGA_LEFT_FOOTER_ROW_CLASS, className)}>
      <ExploreMenuTrustStrip
        density="compact"
        className="min-w-0 max-w-none flex-1 basis-[min(100%,18rem)] items-center"
      />
      <SheetClose asChild>
        <Link href={EXPLORE_MAIN_CONTENT_HREF} className={MEGA_HOW_IT_WORKS_LINK_CLASS}>
          {t("howItWorks")}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </SheetClose>
    </div>
  );
}
