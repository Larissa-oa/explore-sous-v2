"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { CrosshairIcon, MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react";

import {
  SEARCH_DROPDOWN_LIST,
  SearchDropdownRow,
} from "@/components/search/search-picker-wrap";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// —— Recent locations (localStorage) —————————————————————————————————————————

interface LocationRecent {
  value: string;
  title: string;
  subtitle?: string;
}

const RECENTS_KEY = "explore-sous:location-recents";
const GPS_HINT_KEY = "explore-sous:location-gps-hint";

function recentFromValue(value: string): LocationRecent {
  const trimmed = value.trim();
  const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { value: trimmed, title: parts.at(-1)!, subtitle: parts.slice(0, -1).join(", ") };
  }
  return { value: trimmed, title: trimmed };
}

function loadRecents(): LocationRecent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown;
    if (!Array.isArray(list)) return [];
    return list
      .filter((r): r is LocationRecent => r != null && typeof r === "object" && typeof (r as LocationRecent).value === "string")
      .map((r) => ({ ...r, title: r.title || r.value }));
  } catch {
    return [];
  }
}

function saveRecent(value: string): LocationRecent[] {
  const entry = recentFromValue(value);
  const next = [entry, ...loadRecents().filter((r) => r.value !== entry.value)].slice(0, 8);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

function loadGpsHint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(GPS_HINT_KEY)?.trim() || null;
  } catch {
    return null;
  }
}

function saveGpsHint(label: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GPS_HINT_KEY, label.trim());
  } catch {
    // ignore
  }
}

// —— Geolocation label (PDOK) ———————————————————————————————————————————————

async function geolocationLabel(fallback: string): Promise<string> {
  const coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    if (!navigator?.geolocation) reject(new Error("unavailable"));
    else {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        reject,
        { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
      );
    }
  });

  const pdok = async <T,>(url: URL) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) throw new Error("pdok");
    return res.json() as Promise<T>;
  };

  const labelFromDoc = (doc: { postcode?: string; woonplaatsnaam?: string; weergavenaam?: string }) => {
    const city = doc.woonplaatsnaam?.trim();
    const pc = doc.postcode?.trim();
    if (pc && city) {
      const c = pc.replace(/\s/g, "").toUpperCase();
      const fmt = c.length === 6 ? `${c.slice(0, 4)} ${c.slice(4)}` : pc;
      return `${fmt}, ${city}`;
    }
    const m = (doc.weergavenaam ?? "").match(/,\s*(\d{4})\s*([A-Za-z]{2})\s+(.+)$/);
    return m ? `${m[1]} ${m[2].toUpperCase()}, ${m[3].trim()}` : null;
  };

  try {
    const rev = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse");
    rev.searchParams.set("lat", String(coords.lat));
    rev.searchParams.set("lon", String(coords.lng));
    rev.searchParams.set("rows", "1");
    const id = (await pdok<{ response?: { docs?: { id?: string }[] } }>(rev)).response?.docs?.[0]?.id;

    if (id) {
      const lookup = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup");
      lookup.searchParams.set("id", id);
      const doc = (await pdok<{ response?: { docs?: { postcode?: string; woonplaatsnaam?: string; weergavenaam?: string }[] } }>(
        lookup,
      )).response?.docs?.[0];
      const label = doc ? labelFromDoc(doc) : null;
      if (label) return label;
    }

    const free = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
    free.searchParams.set("q", `${coords.lat},${coords.lng}`);
    free.searchParams.set("fq", "type:postcode");
    free.searchParams.set("rows", "1");
    const near = (await pdok<{ response?: { docs?: { postcode?: string; woonplaatsnaam?: string }[] } }>(free))
      .response?.docs?.[0];
    const nearLabel = near ? labelFromDoc(near) : null;
    if (nearLabel) return nearLabel;
  } catch {
    // use fallback
  }

  return fallback;
}

// —— Picker ———————————————————————————————————————————————————————————————————

export interface LocationPickerLabels {
  placeholder: string;
  useCurrentLocation: string;
  locating: string;
  locationFallback: string;
  recent: string;
}

export interface LocationPickerProps {
  value: string | null;
  onChange: (value: string) => void;
  labels: LocationPickerLabels;
  className?: string;
}

const iconTile = "flex size-8 shrink-0 items-center justify-center rounded-ds-8";

export function LocationPicker({ value, onChange, labels, className }: LocationPickerProps) {
  const [query, setQuery] = useState(value ?? "");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsHint, setGpsHint] = useState<string | null>(null);
  const [recents, setRecents] = useState<LocationRecent[]>([]);
  const inputId = useId();

  useEffect(() => {
    setQuery(value ?? "");
    setRecents(loadRecents());
    setGpsHint(loadGpsHint());
  }, [value]);

  const commit = useCallback(
    (next: string) => {
      const trimmed = next.trim();
      if (!trimmed) return;
      setRecents(saveRecent(trimmed));
      setQuery(trimmed);
      onChange(trimmed);
    },
    [onChange],
  );

  const pickCurrentLocation = useCallback(async () => {
    if (gpsLoading) return;
    setGpsLoading(true);
    try {
      const label = await geolocationLabel(labels.locationFallback);
      saveGpsHint(label);
      setGpsHint(label);
      commit(label);
    } catch {
      saveGpsHint(labels.locationFallback);
      setGpsHint(labels.locationFallback);
      commit(labels.locationFallback);
    } finally {
      setGpsLoading(false);
    }
  }, [commit, gpsLoading, labels.locationFallback]);

  return (
    <div className={cn(SEARCH_DROPDOWN_LIST, "flex flex-col gap-1", className)}>
      <div className="px-2 pb-1">
        <div className="relative">
          <label htmlFor={inputId} className="sr-only">
            {labels.placeholder}
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            weight="bold"
            aria-hidden
          />
          <Input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit(query);
              }
            }}
            placeholder={labels.placeholder}
            disabled={gpsLoading}
            autoComplete="street-address"
            className={cn(
              "h-11 w-full rounded-ds-8 border border-input bg-background py-0 pl-9 pr-3 text-sm shadow-sm",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            )}
          />
        </div>
      </div>

      <SearchDropdownRow
        disabled={gpsLoading}
        title={labels.useCurrentLocation}
        subtitle={gpsLoading ? labels.locating : gpsHint ?? undefined}
        onClick={() => void pickCurrentLocation()}
        icon={
          <span className={cn(iconTile, "bg-ds-blue-600/12 text-ds-blue-600")}>
            <CrosshairIcon className="size-5" weight="fill" aria-hidden />
          </span>
        }
      />

      {recents.length > 0 ? (
        <div className="pt-1">
          <p className="type-body-sm-sb px-4 pb-1 text-muted-foreground">{labels.recent}</p>
          <ul className="flex flex-col gap-1">
            {recents.map((item) => (
              <li key={item.value}>
                <SearchDropdownRow
                  title={item.title}
                  subtitle={item.subtitle}
                  onClick={() => commit(item.value)}
                  icon={
                    <span className={cn(iconTile, "bg-[var(--ds-alpha-black-8)] text-ds-clay-600")}>
                      <MapPinIcon className="size-5" weight="fill" aria-hidden />
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
