/* eslint-disable react-refresh/only-export-components -- the lazy route components are
   declared next to the route table they belong to; none of them is exported. */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import Layout from '@components/Layout/Layout';
import LocaleRoute from './LocaleRoute';
import PrelaunchGate from './PrelaunchGate';
import { LEGAL_PAGES, paths, type IRouteHandle } from './routes';

// Pages are code-split per route; Layout renders them inside a Suspense boundary.
const Home = lazy(() => import('@sections/Common/Home/Home'));
const OurStory = lazy(() => import('@sections/Common/OurStory/OurStory'));
const SellToUs = lazy(() => import('@sections/Common/SellToUs/SellToUs'));
const Success = lazy(() => import('@sections/Common/Success/Success'));
const PaymentError = lazy(() => import('@sections/Common/PaymentError/PaymentError'));
const NotFound = lazy(() => import('@sections/Common/NotFound/NotFound'));
const Shop = lazy(() => import('@sections/Shop/Shop/Shop'));
const Product = lazy(() => import('@sections/Shop/Product/Product'));
const Checkout = lazy(() => import('@sections/Order/Checkout/Checkout'));
const Journal = lazy(() => import('@sections/Journal/Journal/Journal'));
const Article = lazy(() => import('@sections/Journal/Article/Article'));
const Legal = lazy(() => import('@sections/Legal/Legal/Legal'));

/** Route handle for a page with the falling toys behind it; the seed sets its arrangement. */
const background = (seed: number): IRouteHandle => ({ backgroundSeed: seed });

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
            { index: true, element: <Home />, handle: background(1) },
            { path: paths.shop, element: <Shop />, handle: background(2) },
            {
              path: paths.product(),
              handle: background(3),
              element: (
                <PrelaunchGate>
                  <Product />
                </PrelaunchGate>
              ),
            },
            {
              path: paths.checkout,
              handle: background(4),
              element: (
                <PrelaunchGate>
                  <Checkout />
                </PrelaunchGate>
              ),
            },
            { path: paths.success, element: <Success /> },
            { path: paths.paymentError, element: <PaymentError /> },
            { path: paths.sellToUs, element: <SellToUs /> },
            { path: paths.ourStory, element: <OurStory /> },
            { path: paths.journal, element: <Journal /> },
            { path: paths.article(), element: <Article /> },
            ...LEGAL_PAGES.map((page) => ({
              path: paths[page],
              element: <Legal page={page} />,
              handle: background(5),
            })),
            { path: '*', element: <NotFound /> },
          ],
        },
      ],
    },
  ],
  // Vite's base ('/' or '/toys/') becomes the router prefix.
  { basename: import.meta.env.BASE_URL }
);
