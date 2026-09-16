# Toys

Second-hand educational toys shop: product listing, cart, Stripe checkout, toy intake form, journal.
See [README.md](README.md) for setup and scripts.

## Communication

- Discuss requirements, plans, trade-offs and results with Rustam in Russian.
- Keep code, identifiers, filenames, comments, commit messages and documentation in English.
- Do not switch the conversation to English because the codebase is in English.
- If a request is ambiguous in a way that materially changes the result, ask one focused
  question in Russian. Otherwise state the assumption and proceed.

## Git

- **Never commit or push on your own initiative.** Leave changes in the working tree so Rustam
  can review the diff; commit only when he explicitly asks.
- Feature work goes in a branch off `master`; PRs are opened only on request.

## Stack & structure

- Vite, React 19, TypeScript, Redux Toolkit + RTK Query, react-router-dom v7, SCSS, clsx.
- No tests for now (deliberate: speed over coverage while the scope is being built).
- `src/app/` — store, typed hooks, router, route paths (`routes.ts`) and `useLinks()`.
- `src/api/` — root RTK Query api and the shared base query. Endpoints live per section in
  `src/sections/<Section>/api/`; payload types in `src/types/`, one file per domain. Backend
  responses are used as they arrive: no `transformResponse`, ask the backend instead. The backend
  is `ulya-sidorina/sk-play-studio`, run locally on `http://localhost:8080/api/v1`.
- `src/features/` — redux slices (cart).
- `src/components/` — shared UI, one folder per component. The cart is a header dropdown
  (`CartDropdown`), not a page.
- `src/sections/` — pages grouped by section: `Shop/` (Shop, Product), `Order/` (Checkout), `Journal/` (Journal, Article), `Common/` (Home, OurStory, SellToUs, Success, NotFound). One
  folder per page; a page's own sub-components go in `<Page>/components/`.
- `src/i18n/` — i18next setup and locale list; strings live in `public/locales/<lng>/`, split into
  `translation.json` (shared) and one file per section (`shopSection.json`, ...).
- `src/styles/` — global styles, SCSS variables and media mixins.

## Routing & i18n

All pages live under `/:locale/...` (`/en/shop`). Build hrefs with `useLinks()`, never
hardcode paths. A missing or unknown locale prefix redirects to `/en/...`. i18next follows the
route segment. Every user-facing string goes through `useTranslation()` and a key in the section's file under
`public/locales/en/`; keys are type-checked, add new ones to that file first.

## Code style

Follow [docs/code-rules.md](docs/code-rules.md): arrow functions with explicit return types,
components default-exported at the bottom, SCSS + BEM full selectors imported first, `@/`, `@components/`
and `@sections/` aliases,
`I`-prefixed data interfaces, `clsx`, Prettier.

## Verification

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```
