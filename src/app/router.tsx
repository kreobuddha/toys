/* eslint-disable react-refresh/only-export-components -- the lazy route components are
   declared next to the route table they belong to; none of them is exported. */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import Layout from '@components/Layout/Layout';
import LocaleRoute from './LocaleRoute';
import { paths } from './routes';

// Pages are code-split per route; Layout renders them inside a Suspense boundary.
const Home = lazy(() => import('@sections/Common/Home/Home'));
const OurStory = lazy(() => import('@sections/Common/OurStory/OurStory'));
const SellToUs = lazy(() => import('@sections/Common/SellToUs/SellToUs'));
const Success = lazy(() => import('@sections/Common/Success/Success'));
const NotFound = lazy(() => import('@sections/Common/NotFound/NotFound'));
const Shop = lazy(() => import('@sections/Shop/Shop/Shop'));
const Product = lazy(() => import('@sections/Shop/Product/Product'));
const Checkout = lazy(() => import('@sections/Order/Checkout/Checkout'));
const Journal = lazy(() => import('@sections/Journal/Journal/Journal'));
const Article = lazy(() => import('@sections/Journal/Article/Article'));

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
