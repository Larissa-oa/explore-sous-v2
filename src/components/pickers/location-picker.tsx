"use client";

import { useCallback, useEffect, useState } from "react";
import { CrosshairIcon, XIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function formatNlPostcode(raw: string): string {
  const compact = raw.replace(/\s/g, "").toUpperCase();
  if (compact.length === 6) return `${compact.slice(0, 4)} ${compact.slice(4)}`;
  return raw.trim();
}

function labelFromPdokDoc(doc: {
  postcode?: string;
  woonplaatsnaam?: string;
  weergavenaam?: string;
}): string | null {
  const city = doc.woonplaatsnaam?.trim();
  const pc = doc.postcode?.trim();
  if (pc && city) return `${formatNlPostcode(pc)}, ${city}`;
  const name = doc.weergavenaam ?? "";
  const m = name.match(/,\s*(\d{4})\s*([A-Za-z]{2})\s+(.+)$/);
  if (m) return `${m[1]} ${m[2].toUpperCase()}, ${m[3].trim()}`;
  return null;
}

export type LocationPickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  onClearApplied?: () => void;
  onClose: () => void;
  locale: string;
  title: string;
  clearLabel: string;
  placeholder: string;
  useCurrentLocationLabel: string;
  locatingLabel: string;
  locationFallbackLabel: string;
  closeLabel: string;
  className?: string;
  density?: "default" | "compact";
};

async function fetchPdokJson<T>(url: URL): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`PDOK ${response.status}`);
  return response.json() as Promise<T>;
}

async function readCurrentLocationAddress(_locale: string, fallback: string): Promise<string> {
  const coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    );
  });

  try {
    const reverseUrl = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse");
    reverseUrl.searchParams.set("lat", String(coords.lat));
    reverseUrl.searchParams.set("lon", String(coords.lng));
    reverseUrl.searchParams.set("rows", "1");
    const reverse = await fetchPdokJson<{ response?: { docs?: { id?: string }[] } }>(reverseUrl);
    const id = reverse.response?.docs?.[0]?.id;

    if (id) {
      const lookupUrl = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup");
      lookupUrl.searchParams.set("id", id);
      const lookup = await fetchPdokJson<{
        response?: { docs?: { postcode?: string; woonplaatsnaam?: string; weergavenaam?: string }[] };
      }>(lookupUrl);
      const label = labelFromPdokDoc(lookup.response?.docs?.[0] ?? {});
      if (label) return label;
    }

    const postcodeUrl = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
    postcodeUrl.searchParams.set("q", `${coords.lat},${coords.lng}`);
    postcodeUrl.searchParams.set("fq", "type:postcode");
    postcodeUrl.searchParams.set("rows", "1");
    const near = await fetchPdokJson<{ response?: { docs?: { postcode?: string; woonplaatsnaam?: string }[] } }>(postcodeUrl);
    const nearLabel = labelFromPdokDoc(near.response?.docs?.[0] ?? {});
    if (nearLabel) return nearLabel;
  } catch {
    // PDOK API unavailable or returned an error — fall through to the fallback label
  }

  return fallback;
}

export function LocationPicker({
  value,
  onChange,
  onClearApplied,
  onClose,
  locale,
  title,
  clearLabel,
  closeLabel,
  placeholder,
  useCurrentLocationLabel,
  locatingLabel,
  locationFallbackLabel,
  className,
  density = "default",
}: LocationPickerProps) {
  const compact = density === "compact";
  const [query, setQuery] = useState(value ?? "");
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  const emitManual = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      onChange(trimmed.length > 0 ? trimmed : null);
    },
    [onChange],
  );

  const handleClear = () => {
    setQuery("");
    onChange(null);
    onClearApplied?.();
  };

  const useCurrentLocation = async () => {
    if (gpsLoading) return;
    setGpsLoading(true);
    try {
      const label = await readCurrentLocationAddress(locale, locationFallbackLabel);
      setQuery(label);
      onChange(label);
    } catch {
      setQuery(locationFallbackLabel);
      onChange(locationFallbackLabel);
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "flex items-start justify-between gap-3 border-b-[0.5px] border-border",
          compact ? "p-3" : "p-4",
        )}
      >
        <h2
          className={cn(
            "font-semibold text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={cn(
              "font-medium text-ds-blue-600 transition-colors hover:text-ds-blue-900",
              compact ? "text-xs" : "text-sm",
            )}
            onClick={handleClear}
          >
            {clearLabel}
          </button>
          <button
            type="button"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-search-inner text-foreground transition-colors hover:bg-interactive-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              compact ? "size-8" : "size-9",
            )}
            aria-label={closeLabel}
            onClick={onClose}
          >
            <XIcon className={compact ? "size-3.5" : "size-4"} weight="bold" aria-hidden />
          </button>
        </div>
      </div>

      <div className={cn("flex flex-col", compact ? "gap-2 p-3" : "gap-3 p-4")}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            emitManual(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              emitManual(query);
            }
          }}
          placeholder={placeholder}
          disabled={gpsLoading}
          className={cn(
            "w-full rounded-ds-8 border border-input bg-background px-3 text-sm leading-normal text-foreground shadow-sm transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
            compact ? "h-9" : "h-11",
          )}
          autoComplete="street-address"
          aria-label={placeholder}
        />

        <button
          type="button"
          disabled={gpsLoading}
          className={cn(
            "flex w-full items-center gap-3 rounded-search-inner text-left text-sm font-semibold text-foreground transition-colors hover:bg-interactive-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
            compact ? "gap-2 p-1.5" : "gap-3 p-2",
          )}
          onClick={() => void useCurrentLocation()}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-ds-full bg-ds-blue-600/12 text-ds-blue-600",
              compact ? "size-8" : "size-10",
            )}
          >
            <CrosshairIcon className={compact ? "size-4" : "size-5"} weight="bold" aria-hidden />
          </span>
          <span>{gpsLoading ? locatingLabel : useCurrentLocationLabel}</span>
        </button>
      </div>
    </div>
  );
}
