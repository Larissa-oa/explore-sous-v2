/**
 * Serialized center-nav items built on the server and rendered by `SiteNavbarCenterNav`.
 * Keeps this module free of `"use client"` so the server layout can import types safely.
 */
export type SiteNavbarCenterNavEntry =
  | {
      id: string;
      label: string;
      megaMenu: true;
      sheetTitle: string;
      sheetDescription?: string;
      /** Legacy text links; Explore uses {@link ExploreMenuPanelData} from the server instead. */
      items?: { href: string; label: string }[];
    }
  | {
      id: string;
      label: string;
      /** No navigation until a route exists. */
      placeholder: true;
    }
  | {
      id: string;
      label: string;
      externalHref: string;
    };

export type SiteNavbarMegaMenuEntry = Extract<SiteNavbarCenterNavEntry, { megaMenu: true }>;
