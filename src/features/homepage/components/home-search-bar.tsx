"use client";

import { DiscoverSearchBar } from "@/features/homepage/components/discover-search-bar";
import {
  pageContentGutterXClass,
  pageSearchBandPaddingYClass,
  SITE_HOME_HERO_SEARCH_ELEMENT_ID,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";

export function HomeSearchBar({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const inner = (
    <DiscoverSearchBar
      layout={embedded ? "hero-embedded" : "hero-section"}
      surfaceId={embedded ? SITE_HOME_HERO_SEARCH_ELEMENT_ID : undefined}
    />
  );

  if (embedded) {
    return inner;
  }

  return (
    <section className={cn("bg-background", pageContentGutterXClass, pageSearchBandPaddingYClass)}>
      {inner}
    </section>
  );
}
