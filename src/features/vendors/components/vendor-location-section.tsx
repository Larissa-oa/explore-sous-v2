"use client";

import { ExternalLink, Phone } from "lucide-react";

import { VendorLeafletMap } from "@/components/maps/vendor-leaflet-map";
import { buildGoogleDirectionsUrl } from "@/lib/maps/vendor-map-urls";
import { cn } from "@/lib/utils";

/** Edge-to-edge on small viewports (inside padded shell); square corners on mobile only. */
const MAP_MOBILE_BLEED =
  "max-md:relative max-md:w-screen max-md:max-w-[100vw] max-md:shrink-0 max-md:overflow-x-clip max-md:[margin-inline:calc(50%-50vw)]";

const MAP_ROUNDING = "max-md:rounded-none md:rounded-ds-8";

export interface VendorLocationLabels {
  sectionAria: string;
  mapTitle: string;
  locationColumn: string;
  getDirections: string;
  contactColumn: string;
}

interface VendorLocationSectionProps {
  locationCardTitle: string;
  addressLine: string;
  phone: string;
  lat: number;
  lng: number;
  labels: VendorLocationLabels;
  className?: string;
}

interface LocationInfoPanelProps {
  locationCardTitle: string;
  addressLine: string;
  phone: string;
  directionsUrl: string;
  telHref: string;
  labels: VendorLocationLabels;
  variant: "mobile" | "desktop";
}

function LocationInfoPanel({
  locationCardTitle,
  addressLine,
  phone,
  directionsUrl,
  telHref,
  labels,
  variant,
}: LocationInfoPanelProps) {
  const isMobile = variant === "mobile";

  return (
    <aside
      className={cn(
        "p-5 text-card-foreground",
        isMobile
          ? "border-0 bg-transparent shadow-none"
          : "rounded-ds-12 border border-border bg-card shadow-md",
      )}
    >
      <h2 className="type-h6-sb text-foreground">{locationCardTitle}</h2>
      <p className="type-body-md mt-1 text-muted-foreground">{addressLine}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-2">
        <div>
          <p className="type-body-md-sb text-foreground">{labels.locationColumn}</p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[color] hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            {labels.getDirections}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
          </a>
        </div>
        <div>
          <p className="type-body-md-sb text-foreground">{labels.contactColumn}</p>
          <a
            href={`tel:${telHref}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[color] hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            <Phone className="size-3.5 shrink-0" aria-hidden />
            {phone}
          </a>
        </div>
      </div>
    </aside>
  );
}

export function VendorLocationSection({
  locationCardTitle,
  addressLine,
  phone,
  lat,
  lng,
  labels,
  className,
}: VendorLocationSectionProps) {
  const directionsUrl = buildGoogleDirectionsUrl(addressLine);
  const telHref = phone.replace(/\s+/g, "");

  const infoProps = {
    locationCardTitle,
    addressLine,
    phone,
    directionsUrl,
    telHref,
    labels,
  };

  return (
    <section
      aria-label={labels.sectionAria}
      className={cn("w-full min-w-0", className)}
    >
      <div className="relative flex min-h-0 w-full flex-col md:block md:h-96">
        {/* Single map: 100vw bleed + no radius on mobile; inset card on desktop */}
        <div className={MAP_MOBILE_BLEED}>
          <VendorLeafletMap
            lat={lat}
            lng={lng}
            mapAriaLabel={labels.mapTitle}
            className={cn(
              MAP_ROUNDING,
              "relative w-full shrink-0",
              /** Mobile: ~1.4× prior height (was 16/10 + min 12rem). */
              "max-md:aspect-[16/14] max-md:min-h-[16.8rem]",
              "md:absolute md:inset-0 md:h-full md:min-h-0 md:aspect-auto",
            )}
          />
        </div>

        <div className="md:hidden">
          <LocationInfoPanel {...infoProps} variant="mobile" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden justify-start p-4 md:flex lg:p-6">
          <div className="pointer-events-auto max-w-sm min-w-0">
            <LocationInfoPanel {...infoProps} variant="desktop" />
          </div>
        </div>
      </div>
    </section>
  );
}
