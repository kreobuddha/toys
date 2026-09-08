# Toys

Second-hand educational toys shop: catalog, cart, Stripe checkout, toy intake form, blog.

## Stack

- Vite + React 19 + TypeScript
- Redux Toolkit + RTK Query (`src/api`, `src/features`)
- react-router-dom v7 (`src/app/router.tsx`). All pages live under `/:locale/...` (`/en/catalog`); a missing or unknown prefix redirects to `/en/...`. Build hrefs with `useLinks()` (`links.product(id)`), never hardcode paths.
- SCSS + CSS Modules, one folder per component/page (`Name.tsx` + `Name.module.scss`)
- ESLint + Prettier

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

| Script                 | What it does                  |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Dev server with HMR           |
| `npm run build`        | Type-check + production build |
| `npm run typecheck`    | `tsc -b --noEmit`             |
| `npm run lint`         | ESLint                        |
| `npm run format`       | Prettier, write               |
| `npm run format:check` | Prettier, check only          |

## Structure

```
src/
  app/        store, typed hooks, router, route paths
  api/        RTK Query api + API types (draft contract, adjust to real backend)
  features/   redux slices (cart)
  components/ shared UI (Layout, Header, Footer)
  pages/      one folder per route
  i18n/       messages; English only for now, all strings go through useT()
  styles/     global styles, SCSS variables & mixins
```

Desktop-first: base styles target desktop, `@include tablet` / `@include mobile` narrow down.
