/**
 * Settings read when the app starts rather than when it is built. In Docker, nginx renders
 * `/config.json` from the container's environment; in development `public/config.json` serves.
 */
export interface IRuntimeConfig {
  /** The shop is not open yet: the catalog shows the launch announcement instead. */
  prelaunch: boolean;
}

let config: IRuntimeConfig = { prelaunch: false };

/** Loads the config once before the first render; a missing file keeps the defaults. */
export const loadRuntimeConfig = async (): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' });
    if (!response.ok) return;
    const body = (await response.json()) as Partial<IRuntimeConfig>;
    config = { prelaunch: body.prelaunch === true };
  } catch {
    // Unreachable or malformed: the shop runs with the defaults.
  }
};

export const getRuntimeConfig = (): IRuntimeConfig => config;
