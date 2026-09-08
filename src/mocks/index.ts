/**
 * Starts MSW when VITE_USE_MOCKS=true. This also applies to production builds
 * so the prototype on GitHub Pages runs without a backend; flip the flag off
 * once the real API is deployed. A registration failure must not take the
 * whole app down: the app still renders and API calls simply hit VITE_API_URL.
 */
export const enableMocks = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;
  try {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
  } catch (error) {
    console.warn('[mocks] MSW failed to start, requests go to the real API', error);
  }
};
