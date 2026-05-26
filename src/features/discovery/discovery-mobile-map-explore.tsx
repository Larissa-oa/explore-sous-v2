"use client";

import { X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DiscoveryMap } from "@/components/maps/discovery-map";
import { Button } from "@/components/ui/button";
import { DiscoveryVendorRowView } from "@/features/discovery/discovery-vendor-row-view";
import type { MapViewportBounds } from "@/lib/discovery/map-viewport-bounds";
import { vendorInViewportBounds } from "@/lib/discovery/map-viewport-bounds";
import type { DiscoverySearchState } from "@/lib/discovery/discovery-query";
import type { DiscoverySearchGeo, DiscoveryVendorRow } from "@/types/discovery";
import { cn } from "@/lib/utils";

export interface DiscoveryMobileMapExploreProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: DiscoveryVendorRow[];
  query: DiscoverySearchState;
  searchGeo: DiscoverySearchGeo;
}

export function DiscoveryMobileMapExplore({
  open,
  onOpenChange,
  rows,
  query,
  searchGeo,
}: DiscoveryMobileMapExploreProps) {
  const t = useTranslations("Discovery");
  const tm = useTranslations("Discovery.mobileMap");
  const [viewportBounds, setViewportBounds] = useState<MapViewportBounds | null>(null);
  const [sliceByViewport, setSliceByViewport] = useState(false);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setViewportBounds(null);
      setSliceByViewport(false);
    }
  }, [open]);

  const onUserMapInteraction = useCallback(() => {
    setSliceByViewport(true);
  }, []);

  const onViewportBoundsChange = useCallback((b: MapViewportBounds) => {
    setViewportBounds(b);
  }, []);

  const railRows = useMemo(() => {
    if (!sliceByViewport || viewportBounds == null) return rows;
    return rows.filter((v) => vendorInViewportBounds(v.lat, v.lng, viewportBounds));
  }, [rows, sliceByViewport, viewportBounds]);

  if (!open) return null;

  const locLabel = query.location?.trim() ?? "";
  const hasLoc = locLabel.length > 0;

  return (
    <div
      className="fixed inset-x-0 z-50 flex flex-col bg-background lg:hidden"
      style={{
        top: "calc(var(--site-top-bar-height) + 3.5rem)",
        height: "calc(100dvh - var(--site-top-bar-height) - 3.5rem)",
      }}
      role="dialog"
      aria-modal
      aria-label={tm("dialogAria")}
    >
      <div className="relative min-h-0 flex-1">
        <DiscoveryMap
          className="absolute inset-0 min-h-0 rounded-none"
          center={{ lat: searchGeo.centerLat, lng: searchGeo.centerLng }}
          radiusKm={searchGeo.radiusKm}
          showSearchRadius={hasLoc}
          vendors={rows}
          mapAriaLabel={t("mapTitle")}
          userPinTooltip={hasLoc ? t("mapUserPinNamed", { label: locLabel }) : t("mapUserPin")}
          userPinPopupHint={t("mapUserPinHint")}
          trackViewport
          onViewportBoundsChange={onViewportBoundsChange}
          onUserMapInteraction={onUserMapInteraction}
        />

        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          onClick={handleClose}
          className="absolute right-3 top-3 z-[1000] rounded-full border border-border bg-background/95 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
          aria-label={tm("closeAria")}
        >
          <X className="size-5" weight="bold" />
        </Button>
      </div>

      <div className="shrink-0 border-t border-border bg-background pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_20px_var(--ds-alpha-black-8)]">
        <div
          className={cn(
            "flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
          )}
        >
          {railRows.map((row) => (
            <div
              key={row.slug}
              className="w-[min(85vw,20rem)] shrink-0 overflow-hidden rounded-ds-8 border border-border bg-card shadow-sm"
            >
              <DiscoveryVendorRowView row={row} orderCta={t("orderCta")} className="px-3 py-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
