import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { routes } from './routes';
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
  {
    element: <Layout />,
    children: [
      { path: routes.home, element: <Home /> },
      { path: routes.catalog, element: <Catalog /> },
      { path: routes.product(), element: <Product /> },
      { path: routes.cart, element: <Cart /> },
      { path: routes.checkout, element: <Checkout /> },
      { path: routes.orderSuccess, element: <OrderSuccess /> },
      { path: routes.sellToys, element: <SellToys /> },
      { path: routes.blog, element: <Blog /> },
      { path: routes.article(), element: <Article /> },
      { path: routes.about, element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
