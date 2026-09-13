import { lazy } from 'react';

// Sections are code-split per route; Layout renders them inside a Suspense boundary.
export const Home = lazy(() => import('@sections/Common/Home/Home'));
export const OurStory = lazy(() => import('@sections/Common/OurStory/OurStory'));
export const SellToUs = lazy(() => import('@sections/Common/SellToUs/SellToUs'));
export const Success = lazy(() => import('@sections/Common/Success/Success'));
export const NotFound = lazy(() => import('@sections/Common/NotFound/NotFound'));
export const Shop = lazy(() => import('@sections/Shop/Shop/Shop'));
export const Product = lazy(() => import('@sections/Shop/Product/Product'));
export const Checkout = lazy(() => import('@sections/Order/Checkout/Checkout'));
export const Journal = lazy(() => import('@sections/Journal/Journal/Journal'));
export const Article = lazy(() => import('@sections/Journal/Article/Article'));
