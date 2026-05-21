"use client";

import { useEffect, useRef } from "react";

import "@/components/maps/discovery-map-leaflet.css";
import { vendorPin } from "@/components/maps/map-pins";
import { cn } from "@/lib/utils";

export interface VendorLeafletMapProps {
  lat: number;
  lng: number;
  mapAriaLabel: string;
  className?: string;
}

/** Single-location map — same tiles and pin styling as the discovery map. */
export function VendorLeafletMap({ lat, lng, mapAriaLabel, className }: VendorLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el == null) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let map: import("leaflet").Map | null = null;

    void (async () => {
      await import("leaflet/dist/leaflet.css");
      const L = (await import("leaflet")).default;
      if (cancelled || containerRef.current !== el) return;

      const mapInstance = L.map(el, {
        scrollWheelZoom: false,
        attributionControl: true,
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
      }).addTo(mapInstance);

      L.marker([lat, lng], {
        icon: L.divIcon({
          className: "leaflet-discovery-pin leaflet-discovery-pin--vendor",
          html: vendorPin.html,
          iconSize: vendorPin.iconSize,
          iconAnchor: vendorPin.iconAnchor,
        }),
      }).addTo(mapInstance);

      mapInstance.setView([lat, lng], 15);

      if (cancelled) {
        mapInstance.remove();
        map = null;
        return;
      }

      ro = new ResizeObserver(() => {
        mapInstance.invalidateSize();
      });
      ro.observe(el);
    })();

    return () => {
      cancelled = true;
      ro?.disconnect();
      ro = null;
      map?.remove();
      map = null;
    };
  }, [lat, lng]);

  return (
    <div
      className={cn(
        "relative isolate z-0 w-full min-h-[12rem] overflow-hidden bg-[#f5f5f4]",
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
