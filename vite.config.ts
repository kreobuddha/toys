import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// GitHub Pages serves the project from /toys/. Set BASE_PATH at build time
// (BASE_PATH=/toys/ npm run build); local dev and other hosts keep '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@sections': fileURLToPath(new URL('./src/sections', import.meta.url)),
    },
  },
  server: { port: 5173 },
});
