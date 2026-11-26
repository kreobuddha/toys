import './BackgroundShapes.scss';
import { useCallback, useMemo, useState, type CSSProperties, type ReactElement } from 'react';
import { TOYS, toySilhouetteUrl, type ToyName } from '@/constants/toys';
import { DESIGN_WIDTH, TILE_HEIGHT, placeToys } from './placeToys';

interface BackgroundShapesProps {
  /** Fall speed in px per second at the design's 1920px width; it scales with the page. */
  speed?: number;
  /** Toys per 1000×1000 design px. */
  density?: number;
  /** Arrangement seed: pages pass different ones so they do not look alike. */
  seed?: number;
  /** Toys to draw from; all of them by default. */
  toys?: readonly ToyName[];
}

const percent = (value: number, of: number): string => `${(value / of) * 100}%`;

/**
 * Pale toy silhouettes slowly falling behind a page. One tile of toys repeats down the page and
 * the whole stack slides down by one tile per loop, so the fall never ends and never jumps. The
 * parent must be positioned.
 */
const BackgroundShapes = ({
  speed = 50,
  density = 1,
  seed = 1,
  toys = TOYS,
}: BackgroundShapesProps): ReactElement => {
  const [box, setBox] = useState({ width: 0, height: 0 });

  // A callback ref rather than an effect: it follows the node itself, so the layer is measured
  // whenever it is attached, including after Suspense hides and reveals the page.
  const observe = useCallback((element: HTMLDivElement | null): (() => void) | undefined => {
    if (!element) return undefined;
    const measure = (width: number, height: number): void =>
      setBox((current) =>
        current.width === width && current.height === height ? current : { width, height }
      );
    // Measured once right away: the observer only reports on a rendered frame, which a hidden
    // tab may not get for a while.
    measure(element.clientWidth, element.clientHeight);
    const observer = new ResizeObserver(([entry]) =>
      measure(entry.contentRect.width, entry.contentRect.height)
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const toysKey = toys.join();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `toysKey` stands for `toys`
  const placements = useMemo(() => placeToys({ density, seed, toys }), [density, seed, toysKey]);

  const scale = box.width / DESIGN_WIDTH;
  const tileHeight = TILE_HEIGHT * scale;
  const tiles = tileHeight > 0 ? Math.ceil(box.height / tileHeight) + 1 : 0;

  const trackStyle = {
    '--tile': `${tileHeight}px`,
    animationDuration: `${tileHeight / Math.max(speed * scale, 0.001)}s`,
  } as CSSProperties;

  return (
    <div ref={observe} className="background-shapes" aria-hidden>
      {tiles > 0 && (
        // Keyed by the tile count, so tiles added on resize start in step with the others.
        <div key={tiles} className="background-shapes__track" style={trackStyle}>
          {Array.from({ length: tiles }, (_, tile) => (
            <div key={tile} className="background-shapes__tile">
              {placements.map(({ toy, x, y, size, angle, spin }, index) => (
                <span
                  key={index}
                  className="background-shapes__toy"
                  style={
                    {
                      left: percent(x - size / 2, DESIGN_WIDTH),
                      top: percent(y - size / 2, TILE_HEIGHT),
                      width: percent(size, DESIGN_WIDTH),
                      maskImage: `url(${toySilhouetteUrl(toy)})`,
                      '--angle': `${angle}deg`,
                      '--turn': `${spin < 0 ? -360 : 360}deg`,
                      animationDuration: `${Math.abs(spin)}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundShapes;
