/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // ✅ CHANGE: Development me PWA enable karne ke liye ise 'false' kar diya
  
  // Advanced Caching Rules
  runtimeCaching: [
    // 1. Static Assets -> Cache First
    {
      urlPattern: /^https?.+\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|css|js)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
      },
    },
    // 2. Public Pages -> Stale While Revalidate
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
    // 3. User Data -> Network First
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
    // 4. API & Firebase -> Network Only
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
  // ❌ swcMinify: true, // REMOVED: Next.js 16 me ye automatic hota hai, isliye error aa raha tha.
  
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
};

module.exports = withPWA(nextConfig);