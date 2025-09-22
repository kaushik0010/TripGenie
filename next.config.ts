import type { NextConfig } from "next";
import withPWA from "next-pwa"

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-maps-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
        plugins: [
          {
            cacheableResponse: {
              statuses: [0, 200], 
            },
          },
        ],
      },
    },
    {
      urlPattern: ({ url }: {url: URL}) => url.pathname.startsWith('/api/trips'),
      handler: 'NetworkFirst', 
      options: {
        cacheName: 'api-trips-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 7, 
        },
        networkTimeoutSeconds: 10, 
        plugins: [
          {
            cacheableResponse: {
              statuses: [0, 200], 
            },
          },
        ],
      },
    },
  ],
});

export default withPWAConfig(nextConfig);
