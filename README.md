# Toys

Second-hand educational toys shop: product listing, cart, Stripe checkout, toy intake form, journal.

## Stack

- Vite + React 19 + TypeScript
- Redux Toolkit + RTK Query (`src/api`, `src/features`)
- react-router-dom v7 (`src/app/router.tsx`). All pages live under `/:locale/...` (`/en/shop`); a missing or unknown prefix redirects to `/en/...`. Build hrefs with `useLinks()` (`links.product(id)`), never hardcode paths.
- SCSS + BEM, one folder per component/page (`Name.tsx` + `Name.scss`)
- i18next + react-i18next, JSON resources in `public/locales/<lng>/`
- ESLint + Prettier

House style rules: [docs/code-rules.md](docs/code-rules.md).

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

| Script                 | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Dev server with HMR                              |
| `npm run build`        | Type-check + production build + SPA 404 fallback |
| `npm run typecheck`    | `tsc -b --noEmit`                                |
| `npm run lint`         | ESLint                                           |
| `npm run format`       | Prettier, write                                  |
| `npm run format:check` | Prettier, check only                             |

## Structure

```
src/
  app/        store, typed hooks, router (with its lazy pages), route paths
  api/        root RTK Query api + the shared base query
  types/      API payload types, one file per domain (product, article, order, ...)
  constants/  catalog attributes shared by the filter panel and the shop URL
  utils/      framework-free helpers (Dutch address parsing)
  features/   redux slices (cart)
  components/ shared UI (Layout, Header, Footer)
  sections/   pages grouped by section (Shop, Order, Journal, Common), one folder per page,
              with the section's endpoints in <Section>/api/
  i18n/       i18next setup, locale list, typed namespaces (i18next.d.ts), price formatting
  styles/     global styles, SCSS variables & mixins
```

Desktop-first: base styles target desktop, `@include tablet` / `@include mobile` narrow down.

## Backend API

The backend is [ulya-sidorina/sk-play-studio](https://github.com/ulya-sidorina/sk-play-studio): a Go
service whose REST gateway is generated from a protobuf contract. Run it locally with
`docker compose up --build`; it serves `http://localhost:8080/api/v1` and the product and article
images under `/assets/`.

Responses are used exactly as they arrive — no mapping layer — so the components read the
contract's own field and enum names. Where the app touches the API:

| File                                 | Role                                                          |
| ------------------------------------ | ------------------------------------------------------------- |
| `src/api/api.ts`                     | Root API; sections attach endpoints with `injectEndpoints`    |
| `src/api/baseQuery.ts`               | One request shape: `{ url, method, params, data }`            |
| `src/sections/<Section>/api/`        | The section's endpoints                                       |
| `src/types/`                         | Payload types, one file per domain                            |
| `src/constants/productAttributes.ts` | Age and condition enums: order, bounds in months, URL aliases |

The filter panel is built from `GET /product-facets`: categories and brands come as slug and name
with a product count, age ranges and conditions as enums with a count, and the catalog reports its
own price bounds. Values with no products behind them are left out of the panel. Category and brand
names come from the catalog; age and condition names live on the frontend, in `shopSection.json`,
because they are protobuf enums and the interface is localized.

Gaps in the contract the UI still works around, all of them raised with the backend: a product has
no link to its journal article; errors carry no machine-readable reason, so a form cannot point at
the field it broke; and the order payload has no locale, so the payment provider cannot return the
customer to a localized page.

## Localization

Strings are split by section: `translation.json` holds what the whole site shares (navigation,
footer, cart, shared components), and each section has its own file — `shopSection.json`,
`orderSection.json`, `journalSection.json`, `commonSection.json`. They are fetched on demand by
`i18next-http-backend`; a page asks for its namespace with `useTranslation('shopSection')` and
reaches a shared key as `t('translation:common.loading')`. Keys are type-checked against the
English files via `src/i18n/i18next.d.ts`. The active language follows the `/:locale` URL segment. To add a
language: add the code to `SUPPORTED_LOCALES` in `src/i18n/locales.ts` and create
`public/locales/<lng>/` with the namespace files it should serve — a section can be translated on
its own, the rest falls back to English.

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` builds with `BASE_PATH=/toys/` and publishes `dist/` to GitHub Pages
at <https://kreobuddha.github.io/toys/>. It runs on demand only: the demo used to be served by
in-browser mocks, and the app no longer carries them, so the deployed build needs a public backend
first. `postbuild` copies `index.html` to `404.html` so deep links work without server-side
rewrites.

One-time setup: the repository must be public (Pages is not available for private repositories on
the Free plan), and _Settings → Pages → Source_ must be set to **GitHub Actions**.

When the backend is reachable publicly, point `VITE_API_URL` in the workflow at it, restore the
`push` trigger, and make sure the API allows CORS from `kreobuddha.github.io`.
