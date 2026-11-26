// Toy drawings in `public/toys/`: each toy has a colour drawing in `color/` and a one-colour
// silhouette in `silhouette/` under the same name.

export const TOYS = [
  'abc-blocks',
  'balance-board',
  'blocks',
  'cups',
  'domino',
  'drum',
  'elephant',
  'house-and-car',
  'lacing',
  'puzzle-piece',
  'pyramid',
  'rattle',
  'shape-puzzle',
  'soft-book',
  'sorter',
  'teapot',
  'teether',
  'top',
] as const;

export type ToyName = (typeof TOYS)[number];

export const toyColorUrl = (toy: ToyName): string => `/toys/color/${toy}.svg`;

export const toySilhouetteUrl = (toy: ToyName): string => `/toys/silhouette/${toy}.svg`;
