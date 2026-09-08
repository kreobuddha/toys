# Code rules

Personal style rules for this repo, distilled from prior production work. They apply on top of
the general conventions in [CLAUDE.md](../CLAUDE.md) and should be followed by anyone (human or
AI session) working here.

## 1. Arrow functions only, with explicit return types

No `function` declarations anywhere — components, hooks, utilities, and internal handlers
(e.g. event handlers inside a component) all use arrow-function consts, and every exported
function/hook/component annotates its return type explicitly rather than relying on inference.

**Why:** consistent call-site and definition syntax across the codebase; arrow functions don't
rebind `this`. Explicit return types make a function's contract readable at the definition site
without tracing the body, and catch a wrong `return` immediately instead of silently widening the
inferred type.

Components and pages — named const, default-exported at the bottom (not an anonymous
`export default () => {}`, so the name still shows up in React DevTools and stack traces):

```tsx
const ProductCard = ({ product }: ProductCardProps): ReactElement => {
  return <article>...</article>;
};

export default ProductCard;
```

Hooks and utilities — named export, no default export:

```ts
export const useLinks = (): Links => {
  // ...
};

export const formatPrice = (minor: number, currency: string): string => {
  // ...
};
```

Internal handlers inside a component follow the same pattern:

```tsx
const handleAdd = (): void => {
  dispatch(addItem(product));
};
```

Enforced by `func-style` and `@typescript-eslint/explicit-module-boundary-types` in
`eslint.config.js`.

## 2. SCSS, one folder per component/page, imported first

Every component and page lives in its own folder containing the component and its stylesheet,
named identically:

```
src/components/ProductCard/ProductCard.tsx
src/components/ProductCard/ProductCard.scss
src/sections/Catalog/Catalog/Catalog.tsx
src/sections/Catalog/Catalog/Catalog.scss
```

The component imports its own stylesheet directly, and that import comes **first**, before any
other import:

```tsx
import './ProductCard.scss';
import type { IProduct } from '@/api/types';
```

**Why:** colocation — a component's markup, logic, and styles live together, so nothing needs
cross-referencing to know what styles apply to what, and deleting a component means deleting one
folder rather than hunting down its rules in a shared file. The stylesheet import goes first as a
scan-order convention: it's the first thing you'd want to know about a component file (what it
looks like), before its data dependencies.

Global reset, CSS custom properties and the `.container` helper live in `src/styles/global.scss`,
imported once in `main.tsx`; SCSS variables and media mixins are in `src/styles/_variables.scss`
and `src/styles/_mixins.scss`.

Non-rendering modules are exceptions to the folder rule and stay as flat files: `src/app/`
(store, router, route paths), `src/api/`, `src/features/` (redux slices), `src/i18n/`,
`src/mocks/`, `src/styles/` and `src/main.tsx`. A page big enough to split keeps its own
`components/` folder next to it (`src/sections/Catalog/Catalog/components/CatalogFilters/`), and
a hook used by one page only lives beside that page
(`src/sections/Catalog/Catalog/useCatalogParams.ts`). Pages are grouped by section under
`src/sections/<Section>/<Page>/` (Catalog, Order, Blog, Common).

## 3. No `../../` imports — use the aliases

Anything outside the current folder is imported via an alias (configured in `vite.config.ts`'s
`resolve.alias` and `tsconfig.app.json`'s `paths`): `@/` resolves to `src/`, `@components/` to
`src/components/`, `@sections/` to `src/sections/`. Use the specific alias when one exists:

```ts
import { useAppDispatch } from '@/app/hooks';
import type { IProduct } from '@/api/types';
import ProductCard from '@components/ProductCard/ProductCard';
import Catalog from '@sections/Catalog/Catalog/Catalog';
```

Only same-folder imports stay relative, since they can't go wrong when a folder moves:

```ts
import './ProductCard.scss';
```

**Why:** once components/pages live in their own folders, a plain relative import to something in
`src/api` or `src/app` would need to climb two levels, and that depth grows with nesting. The
alias keeps every cross-folder import the same shape regardless of where the importing file
lives, and makes moving a file trivial.

## 4. `I`-prefixed interfaces for domain types

Interfaces representing data shapes — API payloads, stored state — are prefixed with `I`:
`IProduct`, `IArticle`, `ICartItem` (in `src/api/types.ts` and feature slices). Component prop
interfaces (`ProductCardProps`, `PaginationProps`, ...) are **not** prefixed — this convention is
specifically for data shapes, not React props. Union and alias types (`SortOption`,
`ArticleBlock`) are not interfaces and carry no prefix either.

```ts
export interface IProduct {
  id: number;
  title: string;
  price: number;
}
```

**Why:** makes it instantly visible whether an identifier is a data-shape type or something else
(a props interface, a union, a component) without jumping to its definition.

## 5. `clsx` for conditional classNames, never template literals

```tsx
className={clsx('header__link', isActive && 'header__link--active')}
```

not

```tsx
className={`header__link ${isActive ? 'active' : ''}`}
```

**Why:** template-literal conditional classNames are error-prone as conditions accumulate (stray
spaces, forgotten ternary branches) and don't short-circuit cleanly for falsy values the way
`clsx`'s `&&` pattern does.

## 6. SCSS + BEM, written as full selectors

Class names follow `block__element--modifier`. The block is the component name in kebab-case.
Every block and element is its own **top-level, full-text selector** — never built via
`&__element` nesting shorthand:

```scss
.product-card {
  // block
}

.product-card__title {
  // element — written out in full, not `&__title`

  &--sold-out {
    // modifier — nesting is fine one level deep under its own element
  }
}
```

Only nest for a modifier (`&--x`), a media query / mixin, or a plain unclassed native tag with no
BEM identity of its own (a bare `<p>` or `<strong>`) — never more than one level deep. Never nest
`&__element` inside `.block { }` shorthand-style.

**Why:** the shorthand form means the string `.product-card__title` never appears literally
anywhere in the file, so it's not findable with a plain text search — you'd have to mentally
concatenate the parent selector and the `&__` fragment. Full selectors keep every class name
greppable exactly as it appears in a `className` prop. The one-level-deep cap keeps specificity
low and avoids the opposite failure mode (deep nesting that reintroduces the "trace the nesting
to know the real selector" problem BEM is meant to solve).

## 7. Prettier

Config lives in `.prettierrc`: 100-char print width, single quotes, `es5` trailing commas,
`arrowParens: always`. Run `npm run format` to apply it repo-wide; `npm run format:check` only
reports.

**Why:** a fixed, non-negotiable formatting layer means style discussions never happen over
whitespace.
