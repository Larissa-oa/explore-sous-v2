"use client";

import Image from "next/image";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ExploreMenuListingSerialized } from "@/types/explore-menu";

import {
  EXPLORE_SECTION_LABEL_CLASS,
  TRENDING_LIST_UL_CLASS,
  TRENDING_ROW_CHEVRON_CLASS,
  TRENDING_ROW_CHEVRON_MOBILE_CLASS,
  TRENDING_ROW_LINK_CLASS,
  TRENDING_ROW_LINK_MOBILE_CLASS,
  TRENDING_SEE_ALL_THUMB_CLASS,
  TRENDING_SEE_ALL_THUMB_MOBILE_CLASS,
  TRENDING_SECTION_TITLE_INSET,
  TRENDING_SECTION_TITLE_INSET_MOBILE,
  TRENDING_VENDOR_THUMB_CLASS,
  TRENDING_VENDOR_THUMB_MOBILE_CLASS,
} from "./explore-menu-constants";

const TRENDING_TITLE_MEGA_CLASS = EXPLORE_SECTION_LABEL_CLASS;
const TRENDING_TITLE_MOBILE_CLASS = "type-h6-md font-semibold text-muted-foreground";

function TrendingRowChevron({ variant }: { variant: "mega" | "mobile" }) {
  return (
    <ChevronRight
      className={variant === "mobile" ? TRENDING_ROW_CHEVRON_MOBILE_CLASS : TRENDING_ROW_CHEVRON_CLASS}
      aria-hidden
    />
  );
}

function TrendingVendorRow({
  item,
  variant,
}: {
  item: ExploreMenuListingSerialized;
  variant: "mega" | "mobile";
}) {
  const isMobile = variant === "mobile";

  return (
    <li>
      <SheetClose asChild>
        <Link
          href={item.href}
          className={cn(TRENDING_ROW_LINK_CLASS, isMobile && TRENDING_ROW_LINK_MOBILE_CLASS)}
        >
          <div className={cn(TRENDING_VENDOR_THUMB_CLASS, isMobile && TRENDING_VENDOR_THUMB_MOBILE_CLASS)}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes={isMobile ? "80px" : "56px"}
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            {item.badgeLabel ? (
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-ds-blue-600">
                {item.badgeLabel}
              </p>
            ) : null}
            <p
              className={cn(
                "font-semibold leading-snug text-foreground line-clamp-2",
                isMobile ? "text-base" : "text-sm",
              )}
            >
              {item.title}
            </p>
            <p
              className={cn(
                "mt-0.5 leading-snug text-muted-foreground line-clamp-2",
                isMobile ? "text-sm" : "text-xs sm:text-sm",
              )}
            >
              {item.subtitle}
            </p>
          </div>
          <TrendingRowChevron variant={variant} />
        </Link>
      </SheetClose>
    </li>
  );
}

function TrendingSeeAllRow({
  href,
  label,
  subtitle,
  variant,
}: {
  href: string;
  label: string;
  subtitle: string;
  variant: "mega" | "mobile";
}) {
  const isMobile = variant === "mobile";

  return (
    <li>
      <SheetClose asChild>
        <Link
          href={href}
          className={cn(TRENDING_ROW_LINK_CLASS, isMobile && TRENDING_ROW_LINK_MOBILE_CLASS)}
        >
          <div className={cn(TRENDING_SEE_ALL_THUMB_CLASS, isMobile && TRENDING_SEE_ALL_THUMB_MOBILE_CLASS)}>
            <LayoutGrid
              className={cn(
                "text-muted-foreground",
                isMobile ? "size-6 sm:size-7" : "size-5 sm:size-[1.125rem]",
              )}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("font-semibold leading-snug text-foreground", isMobile ? "text-base" : "text-sm")}>
              {label}
            </p>
            <p
              className={cn(
                "mt-0.5 leading-snug text-muted-foreground",
                isMobile ? "text-sm" : "text-xs sm:text-sm",
              )}
            >
              {subtitle}
            </p>
          </div>
          <TrendingRowChevron variant={variant} />
        </Link>
      </SheetClose>
    </li>
  );
}

export type ExploreMenuTrendingListProps = {
  menus: ExploreMenuListingSerialized[];
  /** Section heading (e.g. “Trending now”). Omit or blank to hide. */
  trendingTitle?: string;
  variant: "mega" | "mobile";
  className?: string;
  seeAllLabel?: string;
  seeAllHref?: string;
  fillHeight?: boolean;
};

export function ExploreMenuTrendingList({
  menus,
  trendingTitle,
  variant,
  className,
  seeAllLabel,
  seeAllHref,
  fillHeight,
}: ExploreMenuTrendingListProps) {
  const tExploreNav = useTranslations("SiteNavbar.explore");
  const showHeading = Boolean(trendingTitle?.trim());
  const titleClass = variant === "mega" ? TRENDING_TITLE_MEGA_CLASS : TRENDING_TITLE_MOBILE_CLASS;

  const showSeeAll =
    seeAllLabel != null && seeAllLabel !== "" && seeAllHref != null && seeAllHref !== "";

  const listScrollClass =
    variant === "mobile"
      ? "shrink-0"
      : fillHeight
        ? "min-h-0 flex-1 overflow-y-auto overscroll-contain"
        : "max-h-[min(34vh,13rem)] overflow-y-auto overscroll-contain";

  const seeAllSubtitle = tExploreNav("seeAllCardSubtitle");

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col",
        fillHeight && variant === "mega" && "min-h-0 flex-1",
        variant === "mobile" && "shrink-0",
        !fillHeight && variant === "mega" && "min-h-0",
        className,
      )}
    >
      {showHeading ? (
        <p
          className={cn(
            "mb-2 w-full shrink-0 text-left sm:mb-3",
            titleClass,
            variant === "mobile" ? TRENDING_SECTION_TITLE_INSET_MOBILE : TRENDING_SECTION_TITLE_INSET,
          )}
        >
          {trendingTitle}
        </p>
      ) : null}

      <div
        className={cn(
          "flex w-full min-w-0 flex-col rounded-none border-0 bg-transparent",
          variant === "mega" && fillHeight && "min-h-0 flex-1 overflow-hidden",
          variant === "mobile" && "shrink-0 overflow-visible",
        )}
      >
        <ul className={cn(TRENDING_LIST_UL_CLASS, listScrollClass)}>
          {menus.map((item) => (
            <TrendingVendorRow key={item.id} item={item} variant={variant} />
          ))}
          {showSeeAll ? (
            <TrendingSeeAllRow
              key="explore-see-all"
              href={seeAllHref!}
              label={seeAllLabel!}
              subtitle={seeAllSubtitle}
              variant={variant}
            />
          ) : null}
        </ul>
      </div>
    </div>
  );
}
