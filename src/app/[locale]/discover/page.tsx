import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import {
  DiscoveryPageView,
  type DiscoveryPageIssue,
} from "@/features/discovery/discovery-page-view";
import { serializeDiscoverySearchParams } from "@/lib/data/discovery";
import { loadDiscoveryPage } from "@/lib/data/load-discovery-page";
import {
  formatDiscoveryFilterHeading,
  hasDiscoveryFilterHeading,
  parseDiscoverySearchParams,
} from "@/lib/discovery/discovery-query";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "Discovery" });
  const query = parseDiscoverySearchParams(sp);
  const text = query?.q?.trim() ?? "";

  if (query != null && text.length > 0) {
    return {
      title: t("searchResults.metaTitle", { query: text }),
      description: t("metaDescription"),
    };
  }

  if (query != null && hasDiscoveryFilterHeading(query)) {
    const tHeader = await getTranslations({ locale, namespace: "Discovery.header" });
    const heading = formatDiscoveryFilterHeading(query, {
      trendingNow: tHeader("promoTrending"),
      newOnSous: tHeader("promoNew"),
    });
    return {
      title: `${heading} · ${t("metaTitle")}`,
      description: t("metaDescription"),
    };
  }

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DiscoverPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const data = await loadDiscoveryPage(sp);
  const issue: DiscoveryPageIssue = data.ok ? "ok" : "bad_params";
  const viewKey = data.ok ? serializeDiscoverySearchParams(data.query).toString() : data.issue;

  return (
    <DiscoveryPageView
      key={viewKey}
      rows={data.ok ? data.rows : []}
      issue={issue}
      query={data.ok ? data.query : null}
      searchGeo={data.ok ? data.searchGeo : undefined}
      filterMeta={data.ok ? data.filterMeta : undefined}
    />
  );
}
