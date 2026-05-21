# Explore SOUS

Consumer-facing discovery and vendor detail app for the SOUS platform. Built with **Next.js 16 App Router**, **React 19**, **Tailwind 4**, and **next-intl** (Dutch + English).

## Getting started

```bash
npm install
npm run dev        # starts on http://localhost:3000 (Turbopack by default)
npm run build      # production build
npm run lint       # ESLint check
```

## Key routes

| URL | What it does |
|-----|--------------|
| `/` or `/nl` | Homepage — hero, search bar, vendor rails |
| `/discover` | Discovery page — filterable vendor list + map |
| `/vendors/[slug]` | Vendor detail page |

Default locale is `nl`. All routes are locale-prefixed (`/nl/...`, `/en/...`).

## Folder structure

```
src/
├── app/            # Next.js App Router (routes only — no business logic here)
│   └── [locale]/   # Locale-prefixed routes: /, /discover, /vendors/[slug]
├── features/       # Vertical feature slices
│   ├── homepage/   # Home page composition and components
│   ├── discovery/  # Discovery page view, header, filters
│   ├── search/     # Navbar search (desktop + mobile)
│   └── vendors/    # Vendor detail page
├── components/     # Shared presentational components
│   ├── ui/         # shadcn/Radix primitives
│   ├── carousel/   # ListingRail and slide presets
│   ├── maps/       # Leaflet map components
│   └── pickers/    # CalendarPicker, LocationPicker
├── lib/
│   ├── data/       # Server data access + mock JSON files
│   ├── discovery/  # Discovery query parsing, filtering, geo helpers
│   └── search/     # Text matching and navbar suggestion logic
├── types/          # Shared TypeScript interfaces
├── hooks/          # Shared client hooks
├── i18n/           # next-intl routing and request config
└── messages/       # Translation files (en.json, nl.json)
```

## Mock data

All data is currently served from mock JSON files under `src/lib/data/mock/`:

- **`home-catalog.json`** — the single source of truth for vendors and products
- **`popular-searches.json`** — navbar popular search chips
- **`search-categories.json`** — category ids used in discovery filters

Data is loaded server-side via functions in `src/lib/data/`. These modules are marked `import "server-only"` so they can never accidentally run in the browser.

## Backend integration swap points

When the real API is ready, update these locations:

| File | What to swap |
|------|-------------|
| `src/lib/data/discovery-search.ts` | Replace `mockDiscoverySearchSource` with a real implementation of `DiscoverySearchSource` |
| `src/lib/data/home.ts` | Replace mock JSON import with an API call; add Zod schema validation |
| `src/lib/data/vendor-page.ts` | Replace static data with API fetch by slug |
| `src/components/pickers/location-picker.tsx` | Route PDOK geocoding through a backend proxy (`/api/geocode`) |

## Design system

UI tokens and typography utilities are defined in `src/app/globals.css`. Reference design is at [explore-sous.framer.website](https://explore-sous.framer.website/). Use `cn()` from `src/lib/utils.ts` for conditional class merging.
