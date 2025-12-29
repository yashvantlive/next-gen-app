"use client";

import React, { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if already installed (Standalone Mode)
    const inStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(inStandalone);

    // 2. Detect iOS Device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isDeviceIOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isDeviceIOS);

    // 3. Listen for Install Prompt (Android & Desktop Chrome/Edge)
    const handler = (e) => {
      e.preventDefault(); // Prevent default browser banner
      setPromptInstall(e); // Save event for later
      setSupportsPWA(true); // Show our button
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 4. Show iOS Guide (if not installed & not seen recently)
    if (isDeviceIOS && !inStandalone) {
        const hasSeenPrompt = localStorage.getItem("iosPwaPromptSeen");
        if (!hasSeenPrompt) setShowIOSPrompt(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async (e) => {
    e.preventDefault();
    if (!promptInstall) return;

    // Show the native install prompt
    promptInstall.prompt();

    // Wait for the user to respond
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false); // Hide button if installed
    }
  };

  const closeIOSPrompt = () => {
      setShowIOSPrompt(false);
      localStorage.setItem("iosPwaPromptSeen", "true");
  };

  // If already installed, don't show anything
  if (isStandalone) return null;

  // If not supported and not iOS, don't render
  if (!supportsPWA && !showIOSPrompt) return null;

  return (
    // Fixed position: Higher on mobile (bottom-24) to avoid Nav, Lower on Desktop (md:bottom-6)
    <div className="fixed bottom-24 md:bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-sm px-4">
      
      {/* ANDROID / DESKTOP BUTTON */}
      {supportsPWA && (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 border border-indigo-400/50 animate-in slide-in-from-bottom-5"
        >
          <Download size={18} />
          <span>Install App</span>
        </button>
      )}

      {/* iOS INSTRUCTIONS (Safari Only) */}
      {showIOSPrompt && isIOS && (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-700 font-bold">Y</div>
                <div>
                    <p className="text-sm font-bold text-slate-900">Install YOU LEARN</p>
                    <p className="text-xs text-slate-500">Add to Home Screen</p>
                </div>
            </div>
            <button onClick={closeIOSPrompt} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
          </div>
          
          <div className="space-y-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
                1. Tap the <Share size={14} className="text-blue-500" /> Share button
            </div>
            <div className="flex items-center gap-2">
                2. Select <span className="font-bold text-slate-800">Add to Home Screen</span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-slate-200"></div>
        </div>
      )}
    </div>
  );
}