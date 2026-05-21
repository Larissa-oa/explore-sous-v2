import "server-only";

import {
  getDiscoverySearchSource,
  type DiscoveryPageLoadResult,
} from "@/lib/data/discovery-search";

export type { DiscoveryPageLoadIssue, DiscoveryPageLoadResult } from "@/lib/data/discovery-search";

/** Server entry for `/discover` — delegates to {@link getDiscoverySearchSource}. */
export async function loadDiscoveryPage(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<DiscoveryPageLoadResult> {
  return getDiscoverySearchSource().loadDiscoveryPage(searchParams);
}
