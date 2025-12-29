import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "../components/BottomNavigation";
import InstallPWA from "../components/InstallPWA"; 
import { MusicProvider } from "../contexts/MusicContext"; 
import MusicPlayerWidget from "../components/MusicPlayerWidget"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ UPDATED METADATA (Browser Tab Name)
export const metadata = {
  title: "You Learn", // 👈 Changed Here
  description: "Your trusted university study companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "You Learn", // 👈 Changed Here (For Mobile Homescreen)
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
  themeColor: "#7c3aed", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MusicProvider>
          {children}
          <InstallPWA />
          <BottomNavigation />
        </MusicProvider>
      </body>
    </html>
  );
}