/** @type {import('next').NextConfig} */

// PWA Configuration
const withPWA = require("next-pwa")({
  dest: "public", // PWA files public folder me banenge
  register: true, // Service worker register karega
  skipWaiting: true, // Naya update aate hi activate karega
  disable: process.env.NODE_ENV === "development", // Development me PWA disable rahega (caching issues se bachne ke liye)
  
  // Advanced Caching Rules (Safe for your App)
  runtimeCaching: [
    // 1. Static Assets (Images, Fonts, Scripts) -> Cache First
    {
      urlPattern: /^https?.+\.(png|jpg|jpeg|svg|webp|ico|woff|woff2|ttf|css|js)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
      },
    },
    // 2. Public Pages (Landing, Syllabus, About) -> Stale While Revalidate
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
    // 3. User Data (Home, Todo, Resume) -> Network First (Safety)
    {
      urlPattern: ({ url }) => {
        const path = url.pathname;
        return (
          path.startsWith("/home") ||
          path.startsWith("/todo") ||
          path.startsWith("/resume") ||
          path.startsWith("/exams")
        );
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "user-data",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    // 4. API & Firestore -> Network Only (Never Cache)
    {
      urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
      handler: "NetworkOnly",
    },
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com/,
      handler: "NetworkOnly",
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  // Agar future me images domains add karne ho to yaha kar sakte hain
  /* images: {
    domains: ['firebasestorage.googleapis.com'],
  }, 
  */
};

// Configuration ko PWA wrapper ke sath export karein
module.exports = withPWA(nextConfig);