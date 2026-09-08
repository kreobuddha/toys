# Toys

Second-hand educational toys shop: catalog, cart, Stripe checkout, toy intake form, blog.
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
- `src/api/` — RTK Query api + API types. The contract is a draft until the backend lands.
- `src/features/` — redux slices (cart).
- `src/components/` — shared UI, one folder per component. The cart is a header dropdown
  (`CartDropdown`), not a page.
- `src/sections/` — pages grouped by section: `Catalog/` (Catalog, Product), `Order/` (Checkout), `Blog/` (Blog, Article), `Common/` (Home, About, SellToys, Success, NotFound). One
  folder per page; a page's own sub-components go in `<Page>/components/`.
- `src/i18n/` — i18next setup and locale list; strings live in `public/locales/<lng>/translation.json`.
- `src/mocks/` — MSW handlers and fake data, active in dev when `VITE_USE_MOCKS=true`.
- `src/styles/` — global styles, SCSS variables and media mixins.

## Routing & i18n

All pages live under `/:locale/...` (`/en/catalog`). Build hrefs with `useLinks()`, never
hardcode paths. A missing or unknown locale prefix redirects to `/en/...`. i18next follows the
route segment. Every user-facing string goes through `useTranslation()` and a key in
`public/locales/en/translation.json`; keys are type-checked, add new ones to that file first.

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
