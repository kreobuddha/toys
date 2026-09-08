/**
 * Starts MSW when VITE_USE_MOCKS=true. No-op (and tree-shaken) in production.
 * A registration failure must not take the whole app down: the app still
 * renders and API calls simply hit VITE_API_URL.
 */
export const enableMocks = async (): Promise<void> => {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_MOCKS !== 'true') return;
  try {
    const { worker } = await import('./browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } catch (error) {
    console.warn('[mocks] MSW failed to start, requests go to the real API', error);
  }
};
