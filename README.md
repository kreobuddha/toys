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

An article arrives as a list of typed blocks (`oneof`): heading, text, image, gallery, quote, list,
video, products, callout and divider, each with a width and an optional anchor. `ArticleBlocks`
renders them and skips a type this version does not know, so the backend can add one without
breaking the page. A products block hydrates through the catalog's product-ids filter.

Gaps in the contract the UI still works around, both raised with the backend: the order payload has
no locale, so the payment provider cannot return the customer to a localized page, and `CreateOrder`
has no way to confirm the price the customer was shown.

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

## Docker

The shop ships as one container: nginx serves the built files and proxies the API, so the browser
talks to a single origin and needs no CORS.

```bash
docker compose up --build        # http://localhost:8081
```

Compose points the container at a backend running on the host (`http://host.docker.internal:8080`).
On a server the two containers sit on the same network and `API_URL` becomes the backend's service
name:

```yaml
services:
  api:
    image: ghcr.io/ulya-sidorina/the-keepers-toys/backend:latest
    environment:
      PUBLIC_BASE_URL: https://shop.example.com # so image URLs point at the public origin
  web:
    image: ghcr.io/kreobuddha/toys-web:latest
    ports: ['80:80']
    environment:
      API_URL: http://api:8080
```

| Variable  | Default           | What it does                               |
| --------- | ----------------- | ------------------------------------------ |
| `API_URL` | `http://api:8080` | Backend the container proxies `/api/` to   |
| `PORT`    | `80`              | Port nginx listens on inside the container |

Both are read when the container starts, not when the image is built: nginx renders
`docker/nginx.conf.template` with `envsubst`, so the same image runs against any backend. The
bundle itself calls `/api/v1`, a relative path, and `/assets/products/` and `/assets/articles/`
are proxied through so the backend's images load from the same origin.

## Publishing the image

`.github/workflows/docker.yaml` builds the image and pushes it to
`ghcr.io/kreobuddha/the-keepers-toys/frontend`, tagged with the version from `package.json` and
with `latest`, then tags the commit `v<version>`. It runs on demand: _Actions → Docker image → Run
workflow_, after the release pull request is merged.

The backend publishes the same way, so a server runs the two images side by side.
