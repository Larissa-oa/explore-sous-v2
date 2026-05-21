"use client";

import { useEffect, useMemo, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useLocale } from "next-intl";

import { DiscoveryVendorMapPopup } from "@/components/maps/discovery-vendor-map-popup";
import { userPin, vendorPin } from "@/components/maps/map-pins";
import "@/components/maps/discovery-map-leaflet.css";
import type { MapViewportBounds } from "@/lib/discovery/map-viewport-bounds";
import { DISCOVERY_DEFAULT_CENTER } from "@/lib/discovery/default-center";
import type { DiscoveryVendorRow } from "@/types/discovery";
import { cn } from "@/lib/utils";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface DiscoveryMapProps {
  className?: string;
  center: { lat: number; lng: number };
  radiusKm: number;
  showSearchRadius: boolean;
  vendors: DiscoveryVendorRow[];
  mapAriaLabel: string;
  userPinTooltip: string;
  userPinPopupHint: string;
  /** When set, emits {@link onViewportBoundsChange} on move/zoom after the initial fit. */
  trackViewport?: boolean;
  onViewportBoundsChange?: (bounds: MapViewportBounds) => void;
  /** First pan (drag) or zoom after mount arms result cards to follow the visible map area. */
  onUserMapInteraction?: () => void;
}

export function DiscoveryMap({
  className,
  center,
  radiusKm,
  showSearchRadius,
  vendors,
  mapAriaLabel,
  userPinTooltip,
  userPinPopupHint,
  trackViewport = false,
  onViewportBoundsChange,
  onUserMapInteraction,
}: DiscoveryMapProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportCbRef = useRef(onViewportBoundsChange);
  viewportCbRef.current = onViewportBoundsChange;
  const userInteractCbRef = useRef(onUserMapInteraction);
  userInteractCbRef.current = onUserMapInteraction;

  const vendorsKey = useMemo(
    () =>
      vendors
        .map(
          (v) =>
            `${v.slug}:${v.lat}:${v.lng}:${v.priceLevel}:${v.imageUrl}:${v.name}:${v.cuisines.join(",")}:${v.addressLine}`,
        )
        .join("|"),
    [vendors],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (el == null) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let map: import("leaflet").Map | null = null;
    let mapZoomArmTimer: number | undefined;
    const popupRoots: Root[] = [];

    const schedulePopupRootUnmounts = () => {
      const roots = popupRoots.splice(0, popupRoots.length);
      if (roots.length === 0) return;
      queueMicrotask(() => {
        for (const root of roots) {
          try {
            root.unmount();
          } catch {
            /* root may already be gone during fast remounts */
          }
        }
      });
    };

    void (async () => {
      await import("leaflet/dist/leaflet.css");
      const L = (await import("leaflet")).default;
      if (cancelled || containerRef.current !== el) return;

      let cLat = center.lat;
      let cLng = center.lng;
      if (!Number.isFinite(cLat) || !Number.isFinite(cLng)) {
        cLat = DISCOVERY_DEFAULT_CENTER.lat;
        cLng = DISCOVERY_DEFAULT_CENTER.lng;
      }

      const createVendorPinIcon = () =>
        L.divIcon({
          className: "leaflet-discovery-pin leaflet-discovery-pin--vendor",
          html: vendorPin.html,
          iconSize: vendorPin.iconSize,
          iconAnchor: vendorPin.iconAnchor,
        });

      const createUserPinIcon = () =>
        L.divIcon({
          className: "leaflet-discovery-pin leaflet-discovery-pin--user",
          html: userPin.html,
          iconSize: userPin.iconSize,
          iconAnchor: userPin.iconAnchor,
        });

      const mapInstance = L.map(el, {
        scrollWheelZoom: false,
        attributionControl: true,
        fadeAnimation: false,
        zoomAnimation: false,
      });
      if (cancelled) {
        mapInstance.remove();
        return;
      }
      map = mapInstance;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 3,
      }).addTo(mapInstance);

      const layers = L.featureGroup().addTo(mapInstance);

      const userMarker = L.marker([cLat, cLng], {
        icon: createUserPinIcon(),
        zIndexOffset: 500,
      });
      userMarker.bindTooltip(userPinTooltip, {
        direction: "top",
        offset: [0, -28],
        className: "leaflet-discovery-tt",
      });
      userMarker.bindPopup(
        `<div style="font-size:12px;line-height:1.4;max-width:220px;color:#44403c;"><strong style="color:#1c1917;">${escapeHtml(userPinTooltip)}</strong><br/><span style="color:#78716c;">${escapeHtml(userPinPopupHint)}</span></div>`,
      );
      layers.addLayer(userMarker);

      if (showSearchRadius && radiusKm > 0) {
        L.circle([cLat, cLng], {
          radius: radiusKm * 1000,
          color: "#a8a29e",
          weight: 1,
          opacity: 0.55,
          fillColor: "#a8a29e",
          fillOpacity: 0.08,
        }).addTo(layers);
      }

      const vendorHref = (slug: string) => `/${locale}/vendors/${encodeURIComponent(slug)}`;

      for (const v of vendors) {
        if (!Number.isFinite(v.lat) || !Number.isFinite(v.lng)) continue;

        const marker = L.marker([v.lat, v.lng], { icon: createVendorPinIcon() });
        const popupEl = document.createElement("div");
        let popupRoot: Root | null = null;

        marker.bindPopup(popupEl, {
          className: "leaflet-discovery-popup",
          maxWidth: 280,
          minWidth: 260,
          closeButton: true,
        });

        marker.on("popupopen", () => {
          if (popupRoot != null) return;
          popupRoot = createRoot(popupEl);
          popupRoots.push(popupRoot);
          popupRoot.render(
            <DiscoveryVendorMapPopup vendor={v} href={vendorHref(v.slug)} />,
          );
        });

        layers.addLayer(marker);
      }

      /** `FeatureGroup` + `Circle.getBounds()` need a laid-out map; 0×0 panes throw `layerPointToLatLng`. */
      let boundsApplied = false;
      let viewportListenersAttached = false;

      const maybeAttachViewportListeners = () => {
        if (!trackViewport || viewportListenersAttached || !boundsApplied || cancelled) return;
        viewportListenersAttached = true;
        const emit = () => {
          if (cancelled) return;
          const cb = viewportCbRef.current;
          if (cb == null) return;
          try {
            const b = mapInstance.getBounds();
            cb({
              south: b.getSouth(),
              west: b.getWest(),
              north: b.getNorth(),
              east: b.getEast(),
            });
          } catch {
            /* map may be invalid during teardown */
          }
        };

        const notifyUserExplore = () => {
          if (cancelled) return;
          emit();
          userInteractCbRef.current?.();
        };

        mapInstance.on("moveend", emit);

        let zoomArmed = false;
        mapZoomArmTimer = window.setTimeout(() => {
          zoomArmed = true;
        }, 800);

        mapInstance.on("dragend", notifyUserExplore);
        mapInstance.on("zoomend", () => {
          if (zoomArmed) notifyUserExplore();
        });

        emit();
      };

      const tryApplyBounds = () => {
        if (cancelled || boundsApplied) return;
        try {
          mapInstance.invalidateSize();
          const { x, y } = mapInstance.getSize();
          if (!x || !y) return;

          const b = layers.getBounds();
          if (b.isValid()) {
            mapInstance.fitBounds(b, { padding: [36, 36], maxZoom: 14 });
          } else {
            mapInstance.setView([cLat, cLng], 12);
          }
          boundsApplied = true;
          maybeAttachViewportListeners();
        } catch {
          try {
            mapInstance.setView([cLat, cLng], 12);
          } catch {
            /* map may already be torn down */
          }
          boundsApplied = true;
          maybeAttachViewportListeners();
        }
      };

      tryApplyBounds();
      requestAnimationFrame(() => {
        tryApplyBounds();
      });

      mapInstance.whenReady(() => {
        if (cancelled) return;
        tryApplyBounds();
      });

      if (cancelled) {
        mapInstance.remove();
        map = null;
        return;
      }

      ro = new ResizeObserver(() => {
        mapInstance.invalidateSize();
        tryApplyBounds();
      });
      ro.observe(el);
    })();

    return () => {
      cancelled = true;
      if (mapZoomArmTimer != null) window.clearTimeout(mapZoomArmTimer);
      schedulePopupRootUnmounts();
      ro?.disconnect();
      ro = null;
      map?.remove();
      map = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `vendorsKey` already tracks vendor list changes
  }, [
    center.lat,
    center.lng,
    locale,
    radiusKm,
    showSearchRadius,
    trackViewport,
    userPinPopupHint,
    userPinTooltip,
    vendorsKey,
  ]);

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full min-h-[12rem] overflow-hidden rounded-none bg-[#f5f5f4]",
        className,
      )}
    >
      <div
        ref={containerRef}
        className="discovery-map-root absolute inset-0 z-0"
        role="region"
        aria-label={mapAriaLabel}
      />
    </div>
  );
}
