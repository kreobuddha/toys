/**
 * Blocks switched on in code rather than by the runtime config: they wait on content, not on
 * an environment. `import.meta.env.DEV` is true under `npm run dev` and false in the build the
 * Docker image serves, so these stay visible while we work and hidden in production.
 */
export const FEATURES = {
  /** Home page reviews: hidden until there are enough of them to show. */
  reviews: import.meta.env.DEV,
} as const;
