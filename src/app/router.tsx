import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@components/Layout/Layout';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import LocaleRoute from './LocaleRoute';
import { paths } from './routes';
import {
  About,
  Article,
  Blog,
  Catalog,
  Checkout,
  Home,
  NotFound,
  Success,
  Product,
  SellToys,
} from './sections';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={`/${DEFAULT_LOCALE}`} replace /> },
  {
    path: '/:locale',
    element: <LocaleRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: paths.catalog, element: <Catalog /> },
          { path: paths.product(), element: <Product /> },
          { path: paths.checkout, element: <Checkout /> },
          { path: paths.orderSuccess, element: <Success /> },
          { path: paths.sellToys, element: <SellToys /> },
          { path: paths.blog, element: <Blog /> },
          { path: paths.article(), element: <Article /> },
          { path: paths.about, element: <About /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);
