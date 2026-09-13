import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import LocaleRoute from './LocaleRoute';
import { paths } from './routes';
import {
  Article,
  Checkout,
  Home,
  Journal,
  NotFound,
  OurStory,
  Product,
  SellToUs,
  Shop,
  Success,
} from './sections';

export const router = createBrowserRouter(
  [
    { path: '/', element: <Navigate to={`/${DEFAULT_LOCALE}`} replace /> },
    {
      path: '/:locale',
      element: <LocaleRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { index: true, element: <Home /> },
            { path: paths.shop, element: <Shop /> },
            { path: paths.product(), element: <Product /> },
            { path: paths.checkout, element: <Checkout /> },
            { path: paths.orderSuccess, element: <Success /> },
            { path: paths.sellToUs, element: <SellToUs /> },
            { path: paths.ourStory, element: <OurStory /> },
            { path: paths.journal, element: <Journal /> },
            { path: paths.article(), element: <Article /> },
            { path: '*', element: <NotFound /> },
          ],
        },
      ],
    },
  ],
  // Vite's base ('/' or '/toys/') becomes the router prefix.
  { basename: import.meta.env.BASE_URL }
);
