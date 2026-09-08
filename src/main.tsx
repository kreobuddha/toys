import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';
import { enableMocks } from '@/mocks';
import '@/i18n';
import '@/styles/global.scss';

void enableMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        {/* Translations load over HTTP; nothing renders until the bundle is in. */}
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </StrictMode>
  );
});
