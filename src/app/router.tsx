import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import { LocaleRoute } from './LocaleRoute';
import { paths } from './routes';
import { Home } from '@/pages/Home/Home';
import { Catalog } from '@/pages/Catalog/Catalog';
import { Product } from '@/pages/Product/Product';
import { Cart } from '@/pages/Cart/Cart';
import { Checkout } from '@/pages/Checkout/Checkout';
import { OrderSuccess } from '@/pages/OrderSuccess/OrderSuccess';
import { SellToys } from '@/pages/SellToys/SellToys';
import { Blog } from '@/pages/Blog/Blog';
import { Article } from '@/pages/Article/Article';
import { About } from '@/pages/About/About';
import { NotFound } from '@/pages/NotFound/NotFound';

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
          { path: paths.cart, element: <Cart /> },
          { path: paths.checkout, element: <Checkout /> },
          { path: paths.orderSuccess, element: <OrderSuccess /> },
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
