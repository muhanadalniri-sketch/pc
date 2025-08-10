import withPWA from 'next-pwa';
const isProd = process.env.NODE_ENV === 'production';

const runtimeCaching = [
  {
    urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'static-resources' },
  },
  {
    urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/_next/image'),
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'next-image' },
  },
  {
    urlPattern: ({ request }) => request.destination === 'image',
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'font',
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts',
      expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
    },
  },
  {
    urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname === '/offline',
    handler: 'NetworkOnly'
  },
];

const withPWACfg = withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: '/offline'
  }
});

export default withPWACfg({
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: { unoptimized: true }, // keeps it fully offline-compatible
  webpack: (config) => {
    if (process.env.ANALYZE) {
      // nothing right now - placeholder for bundle analyzer if needed
    }
    return config;
  }
});
