import './BackgroundShapes.scss';
import type { ReactElement } from 'react';

type Shape = 'arch' | 'car' | 'cube' | 'elephant' | 'puzzle-piece' | 'teapot' | 'triangle';

interface IPlacement {
  shape: Shape;
  /** Left edge and top edge in the design's px, measured from the page's top under the header. */
  x: number;
  y: number;
}

interface ILayout {
  /** Page height in the design from the header to the footer; tops scale against it. */
  height: number;
  shapes: IPlacement[];
}

export type BackgroundShapesLayout = 'home' | 'shop' | 'product' | 'empty';

const DESIGN_WIDTH = 1920;

/** Natural widths of the files in `public/home/shapes/`, in the design's px. */
const WIDTHS: Record<Shape, number> = {
  arch: 683,
  car: 706,
  cube: 454,
  elephant: 1039,
  'puzzle-piece': 623,
  teapot: 1086,
  triangle: 442,
};

const LAYOUTS: Record<BackgroundShapesLayout, ILayout> = {
  home: {
    height: 4395,
    shapes: [
      { shape: 'car', x: 1053, y: 1222 },
      { shape: 'teapot', x: 52, y: 1706 },
      { shape: 'triangle', x: 1478, y: 1844 },
      { shape: 'elephant', x: 753, y: 2592 },
      { shape: 'arch', x: 133, y: 3186 },
      { shape: 'cube', x: 1248, y: 3752 },
      { shape: 'puzzle-piece', x: -162, y: 3979 },
    ],
  },
  shop: {
    height: 2621,
    shapes: [
      { shape: 'arch', x: 133, y: -187 },
      { shape: 'cube', x: 1248, y: 379 },
      { shape: 'puzzle-piece', x: -162, y: 606 },
      { shape: 'car', x: 1053, y: 1222 },
      { shape: 'teapot', x: 52, y: 1706 },
      { shape: 'triangle', x: 1478, y: 1844 },
    ],
  },
  product: {
    height: 3017,
    shapes: [
      { shape: 'arch', x: 20, y: 10 },
      { shape: 'cube', x: 1490, y: 650 },
      { shape: 'puzzle-piece', x: -300, y: 1120 },
    ],
  },
  empty: {
    height: 1162,
    shapes: [
      { shape: 'arch', x: -165, y: -147 },
      { shape: 'cube', x: 1580, y: 590 },
    ],
  },
};

const percent = (value: number, of: number): string => `${(value / of) * 100}%`;

interface BackgroundShapesProps {
  layout: BackgroundShapesLayout;
}

/**
 * The pale falling toy shapes behind a page. Placed in the design's coordinates and scaled with
 * the page, so they keep their composition at any width. The parent must be positioned.
 */
const BackgroundShapes = ({ layout }: BackgroundShapesProps): ReactElement => {
  const { height, shapes } = LAYOUTS[layout];

  return (
    <div className="background-shapes" aria-hidden>
      {shapes.map(({ shape, x, y }) => (
        <img
          key={`${shape}-${y}`}
          src={`/home/shapes/${shape}.svg`}
          alt=""
          className="background-shapes__shape"
          style={{
            left: percent(x, DESIGN_WIDTH),
            top: percent(y, height),
            width: percent(WIDTHS[shape], DESIGN_WIDTH),
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundShapes;
