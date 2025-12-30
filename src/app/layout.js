import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "../components/BottomNavigation";
import InstallPWA from "../components/InstallPWA"; 
import { MusicProvider } from "../contexts/MusicContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ FINAL PRODUCTION METADATA
export const metadata = {
  title: "You Learn",
  description: "Your trusted university study companion",
  manifest: "/manifest.json",
  
  // ✅ ICONS CONFIGURATION (Correctly mapped to your folders)
  icons: {
    icon: [
      { url: '/icons/favicon/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    // ✅ Apple/Home Screen Icon (Must use 'app' folder path)
    apple: [
      { url: '/icons/app/icon-192.png' }, 
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "You Learn",
  },
  
  formatDetection: {
    telephone: false,
  },
};

// ✅ VIEWPORT CONFIGURATION
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for native app feel
  themeColor: "#6D28D9", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MusicProvider>
          {children}
          
          {/* Global Components */}
          <InstallPWA />
          <BottomNavigation />
        </MusicProvider>
      </body>
    </html>
  );
}