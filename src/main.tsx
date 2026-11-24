// Global styles first, so component stylesheets loaded after them win on equal specificity.
import '@/styles/global.scss';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';
import { loadRuntimeConfig } from '@/app/runtimeConfig';
import '@/i18n';

// The runtime config decides what the first render shows, so it is read before it.
void loadRuntimeConfig().then(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        {/* Translations load over HTTP; nothing renders until the bundle is in. */}
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </StrictMode>
  )
);
