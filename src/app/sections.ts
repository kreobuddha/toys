import { lazy } from 'react';

// Sections are code-split per route; Layout renders them inside a Suspense boundary.
export const Home = lazy(() => import('@sections/Common/Home/Home'));
export const About = lazy(() => import('@sections/Common/About/About'));
export const SellToys = lazy(() => import('@sections/Common/SellToys/SellToys'));
export const Success = lazy(() => import('@sections/Common/Success/Success'));
export const NotFound = lazy(() => import('@sections/Common/NotFound/NotFound'));
export const Catalog = lazy(() => import('@sections/Catalog/Catalog/Catalog'));
export const Product = lazy(() => import('@sections/Catalog/Product/Product'));
export const Checkout = lazy(() => import('@sections/Order/Checkout/Checkout'));
export const Blog = lazy(() => import('@sections/Blog/Blog/Blog'));
export const Article = lazy(() => import('@sections/Blog/Article/Article'));
