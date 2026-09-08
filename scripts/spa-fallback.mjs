import { copyFileSync } from 'node:fs';

// GitHub Pages has no server-side rewrite: a direct hit on /toys/en/catalog
// would 404. Serving the same SPA shell as 404.html lets the router take over.
copyFileSync('dist/index.html', 'dist/404.html');
console.log('dist/404.html written (SPA fallback)');
