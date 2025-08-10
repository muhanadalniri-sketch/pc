/** @type {import('next').NextConfig} */

// Basic runtime caching rules (no 'self' usage inside functions)
const runtimeCaching = [
  {
    urlPattern: /_next\/static\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'static-resources' },
  },
  {
    urlPattern: /\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
  {
    urlPattern: /\.(?:woff2?|eot|ttf|otf)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts',
      expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
    },
  },
];

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  // Removed 'fallbacks' to avoid current next-pwa precacheFallback error.
});

module.exports = withPWA({
  reactStrictMode: true,
  images: { unoptimized: true },
});
