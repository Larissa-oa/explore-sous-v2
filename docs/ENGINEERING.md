# Engineering conventions — Explore SOUS

This document is the source of truth for code organisation, naming, and patterns in this repo. The Cursor rules in `.cursor/rules/` reference it.

---

## Stack

| Tool | Version | Notes |
|------|---------|-------|
| Next.js | 16 | App Router only — no Pages Router |
| React | 19 | Function components, hooks, Server Components |
| TypeScript | 5 (strict) | All new code must be TypeScript |
| Tailwind | 4 | Design tokens in `src/app/globals.css` |
| next-intl | — | Locales: `nl` (default), `en` |
| shadcn/ui | — | Primitives in `src/components/ui/` |

---

## Folder layout (`src/`)

```
app/            Next.js App Router segments (routes only, no logic)
  [locale]/     All public routes under locale prefix
features/       Vertical feature slices — one folder per product area
  homepage/     Home page composition + section components
  discovery/    Discovery list, header filters, map integration
  search/       Navbar search typeahead (desktop + mobile)
  vendors/      Vendor detail page
components/     Shared presentational UI (no feature-specific logic)
  ui/           shadcn/Radix primitives — treat as owned source
  carousel/     ListingRail + slide presets
  maps/         Leaflet-based map components
  pickers/      CalendarPicker, LocationPicker
  search/       Shared search picker wrapper
lib/            Pure logic — no JSX
  data/         Server data access + mock JSON (all server-only)
  discovery/    Query parsing, eligibility rules, geo helpers
  search/       Text matching, suggestion ranking
  dates.ts      Date parsing and formatting utilities
  utils.ts      cn() and general helpers
  site-layout.ts Page shell CSS classes and layout constants
types/          Shared TypeScript interfaces — no runtime code
hooks/          Shared client hooks (use-md-layout.ts)
i18n/           next-intl routing, request config, navigation helpers
messages/       Translation JSON files (en.json, nl.json)
assets/         Static assets (fonts, logos, category images)
```

### Dependency rule

```
app → features / components / lib / types
features → components / lib / types
components → lib / types
lib → types
```

`features` may import from other `features` only for shared UI constants or icons — avoid tight cross-feature coupling.

---

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| React component files | PascalCase `.tsx` | `VendorInfoCard.tsx` |
| Non-component TS modules | kebab-case `.ts` | `discovery-query.ts` |
| Hook files | kebab-case, `use-` prefix | `use-md-layout.ts` |
| Hook exports | camelCase, `use` prefix | `useMdLayout()` |
| Folders | kebab-case | `listing-cards/` |
| Component exports | PascalCase | `VendorInfoCard` |
| Server data functions | `get*` or `load*` | `getHomeCatalog()`, `loadDiscoveryPage()` |
| URL segments | kebab-case | `/discover`, `/vendors/ron-gastrobar` |
| Dynamic segments | `[param]` | `[slug]`, `[locale]` |
| Type/interface names | PascalCase | `DiscoverySearchState` |
| Props interfaces | PascalCase + `Props` suffix | `VendorInfoCardProps` |
| i18n key format | dotted namespaces | `Discovery.header.promoTrending` |

### Exports

- **Route files** (`page.tsx`, `layout.tsx`): default export.
- **All other components and hooks**: named exports.
- **Barrel `index.ts`** files: only where the public API of a feature needs one (e.g. `features/search/index.ts`).

---

## Server vs client split

### Server Components (default)

No `"use client"` directive. Can be `async`, can call data functions, cannot use browser APIs or client hooks.

```tsx
// Server Component — fetch data, no "use client"
export default async function DiscoverPage({ searchParams }) {
  const data = await loadDiscoveryPage(await searchParams);
  return <DiscoveryPageView {...data} />;
}
```

### Client Components

Add `"use client"` at the top. Use for interactivity, local state, effects, and browser APIs. Keep client bundles small — push data loading to the server.

```tsx
"use client";
import { useState } from "react";
```

### Server-only modules

Data access modules that must never run in the browser are marked with `import "server-only"`. This is enforced at build time.

---

## Data fetching

All data for page renders is fetched in async Server Components (`page.tsx` or server feature views). No `useEffect` for initial data loading.

Mock data lives in `src/lib/data/mock/`. The central catalog is `home-catalog.json`. The interface for discovery data is `DiscoverySearchSource` in `src/lib/data/discovery-search.ts` — swap `mockDiscoverySearchSource` for a real implementation when the backend is ready.

When switching to real API data, add **Zod** schema validation at the fetch boundary so malformed responses surface as clear errors instead of silent runtime failures.

---

## Styling

- Use Tailwind utility classes; avoid inline styles.
- Semantic tokens first (`bg-background`, `text-foreground`, `border-border`), then palette tokens (`bg-ds-blue-600`) only when needed.
- Typography: `type-h*-sb` / `type-body-*` utility classes from `globals.css`.
- Border radius: `rounded-ds-*` tokens.
- Merge conditional classes with `cn()` from `src/lib/utils.ts`.
- Dark mode: not implemented — light tokens only.

---

## Routing

- All routes are locale-prefixed via next-intl middleware (`src/proxy.ts`).
- Use `Link`, `useRouter`, `usePathname` from `src/i18n/navigation` (not `next/navigation` directly).
- Locale-aware `redirect` is also in `src/i18n/navigation`.

---

## i18n

- Translations in `src/messages/en.json` and `src/messages/nl.json`.
- Server: `getTranslations({ locale, namespace })` from `next-intl/server`.
- Client: `useTranslations(namespace)` from `next-intl`.
- Always `setRequestLocale(locale)` in server `page.tsx` and `layout.tsx`.

---

## Error and loading states

- Add `loading.tsx` (streaming fallback) to routes that do significant data fetching.
- Add `error.tsx` (must be `"use client"`) to routes that call external APIs, so network failures show a recovery UI instead of a blank screen.
