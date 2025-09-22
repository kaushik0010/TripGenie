import type { NextConfig } from "next";
import nextPWA from "@ducanh2912/next-pwa";

const withPWA = nextPWA({
  dest: "public",                    
  register: true,                    
  skipWaiting: true,                 
  disable: process.env.NODE_ENV === "development", 
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-maps-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/trips"),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-trips-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
        networkTimeoutSeconds: 10,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
} as any);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA(nextConfig);
