/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  
  runtimeCaching: [
    {
      urlPattern: /^https?.+\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|css|js)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => {
        const path = url.pathname;
        return (
          path === "/" ||
          path.startsWith("/syllabus") ||
          path.startsWith("/pyq") ||
          path.startsWith("/about") ||
          path.startsWith("/privacy") ||
          path.startsWith("/terms")
        );
      },
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "public-pages",
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => {
        const path = url.pathname;
        return (
          path.startsWith("/home") ||
          path.startsWith("/todo") ||
          path.startsWith("/resume") ||
          path.startsWith("/exams") ||
          path.startsWith("/profile")
        );
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "user-data",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com/,
      handler: "NetworkOnly",
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", 
      },
    ],
  },

  // ✅ FIX: 'unsafe-none' is required for strict Firebase Auth popup flows
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none', // 👈 Changed to unsafe-none (Most permissive)
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          }
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);