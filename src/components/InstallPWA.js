"use client";
import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return; // Don't show if already installed

    // Check if user already dismissed it
    const hasSeenPopup = localStorage.getItem("pwa-popup-seen");
    if (hasSeenPopup) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show popup automatically when prompt is available
      setShowPopup(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPopup(false);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    // Remember that user dismissed it
    localStorage.setItem("pwa-popup-seen", "true");
  };

  if (!isMounted || !showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4 pb-20 sm:pb-4">
      {/* Backdrop (Optional: remove 'bg-black/20' if you want it completely transparent) */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={handleDismiss} 
        style={{ pointerEvents: 'auto' }}
      />

      {/* Popup Card */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl p-5 w-full max-w-sm border border-slate-100 transform transition-all animate-in slide-in-from-bottom-10 pointer-events-auto"
      >
        <button 
          onClick={handleDismiss} 
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-1">
            <Download size={24} strokeWidth={2.5} />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-800">Install App</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Install <strong>YOU LEARN</strong> for a better fullscreen experience and faster access.
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-200 mt-2"
          >
            Install Now
          </button>
          
          <button 
            onClick={handleDismiss}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}