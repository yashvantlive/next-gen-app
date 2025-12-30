"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ChevronLeft, Wrench, LogOut, Shield, Edit, Settings, Mail, 
  GraduationCap, CheckCircle2, Home, Sparkles 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "../../lib/firebaseClient"; 
import { getBranchAssets } from "../../lib/branchData";
import { getSafeTheme } from "../../lib/themeUtils"; 
import { useMusicPlayer } from "../../contexts/MusicContext"; 
import PhysicsBackground from "./PhysicsBackground";
import ThemeControlSection from "./ThemeControlSection";
import MusicPlayerSection from "./MusicPlayerSection";

export default function ProfileHeader({ profile, authUser, isAdmin, handleLogout }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ✅ Toggle State for Home/Y Icon Animation
  const [showHomeIcon, setShowHomeIcon] = useState(false);

  // ✅ Default filters
  const [filters, setFilters] = useState({ hue: 0, saturation: 0, brightness: 0 });
  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  const { isPlaying, togglePlay, currentTrack, isLoading } = useMusicPlayer();

  // ⚡ PERFORMANCE FIX: Memoize Theme Calculation
  const theme = useMemo(() => {
    const branchTheme = getBranchAssets(profile?.branchId);
    const defaultTheme = getSafeTheme('focused'); 
    return branchTheme || defaultTheme;
  }, [profile?.branchId]);

  // Safe Logout
  const handleSafeLogout = async () => {
    try {
      if (isPlaying) await togglePlay(); 
    } catch (e) { console.warn("Music stop failed:", e); }
    handleLogout(); 
  };

  // ✅ Auto-Switch Icon Animation (Y <-> Home)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHomeIcon(prev => !prev);
    }, 4000); // Switch every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // ✅ Load Saved Theme from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      if (!authUser?.uid) return;
      try {
        const snap = await getDoc(doc(db, "users", authUser.uid));
        if (snap.exists() && snap.data().themePreferences) {
          setFilters(snap.data().themePreferences);
        }
      } catch (e) { console.error('Failed to load theme:', e); }
    };
    fetchSettings();
  }, [authUser]);

  // ✅ Auto-Save Theme to Firestore (Debounced)
  useEffect(() => {
    if (!authUser?.uid) return;
    const timeout = setTimeout(async () => {
      try { 
        await setDoc(
          doc(db, "users", authUser.uid), 
          { themePreferences: filters }, 
          { merge: true }
        ); 
      } catch (err) { console.error('Failed to save theme:', err); }
    }, 1000); 
    return () => clearTimeout(timeout);
  }, [filters, authUser]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: Number(value) }));
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
           
           {/* ✅ LEFT SIDE: Animated Branding & Home Link */}
           <div className="flex items-center gap-3">
             <Link href="/home" className="relative w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 overflow-hidden group cursor-pointer">
                {/* Y Logo State */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${showHomeIcon ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                   <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center shadow-inner">
                      <span className="text-white font-bold text-xs">Y</span>
                   </div>
                </div>
                {/* Home Icon State */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${showHomeIcon ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-50'}`}>
                   <Home size={20} className="text-slate-600" />
                </div>
             </Link>
             
             <div className="flex flex-col justify-center">
                <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">YOU LEARN</h1>
                <span className="text-[10px] font-bold text-violet-600 flex items-center gap-1 mt-0.5">
                  MY SPACE <Sparkles size={10} className="text-amber-400 animate-pulse fill-amber-400"/>
                </span>
             </div>
           </div>
           
           {/* ✅ RIGHT SIDE: Wrench Menu (Existing) */}
           <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all active:scale-95 group"
                aria-label="Menu"
              >
                <Wrench size={22} strokeWidth={2} className="group-hover:rotate-45 transition-transform duration-300 ease-out" /> 
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-1.5 z-20 animate-in fade-in zoom-in-95 origin-top-right">
                      {isAdmin && (
                        <button onClick={() => router.push("/admin")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors text-left"><Shield size={16}/> Admin Panel</button>
                      )}
                      <button onClick={() => router.push("/onboarding")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-violet-600 rounded-xl transition-colors text-left"><Edit size={16}/> Edit Profile</button>
                      <button onClick={() => router.push("/settings")} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 rounded-xl transition-colors text-left"><Settings size={16}/> Settings</button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button onClick={handleSafeLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-left"><LogOut size={16}/> Log Out</button>
                  </div>
                </>
              )}
           </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden relative group">
           
           <PhysicsBackground theme={theme} filters={filters} touchEnabled={true} />
           
           <div className="px-6 sm:px-10 pb-8 bg-white relative rounded-b-[2.5rem]">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 relative">
                 
                 {/* Avatar */}
                 <div className="relative z-20 shrink-0 -mt-16 sm:-mt-20">
                    <div className="p-2 bg-white rounded-full shadow-2xl shadow-slate-300/50 ring-1 ring-slate-100 relative">
                        <img 
                          src={profile?.photoURL || authUser?.photoURL || "https://ui-avatars.com/api/?name=User"} 
                          alt="Profile" 
                          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-slate-50 bg-slate-100" 
                        />
                        <div className="absolute bottom-4 right-4 z-30">
                            <span className="relative flex h-5 w-5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white"></span>
                            </span>
                        </div>
                    </div>
                 </div>
                 
                 <div className="flex-1 w-full pt-2 sm:pt-4 sm:pb-2 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
                    
                    {/* User Info */}
                    <div className="flex flex-col sm:items-start items-center gap-1.5 text-center sm:text-left">
                        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">
                              {profile?.displayName || "Scholar"}
                            </h2>
                            {isAdmin && <Shield size={20} className="text-violet-600 fill-violet-100" strokeWidth={2.5} />}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 mb-2 justify-center sm:justify-start">
                            <Mail size={14} className="text-slate-300"/>
                            <span>{authUser?.email}</span>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-wider shadow-sm cursor-default">
                              <GraduationCap size={12} className="text-slate-400"/> Student
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-emerald-50/50 text-emerald-700 border border-emerald-100 uppercase tracking-wider shadow-sm cursor-default">
                              <CheckCircle2 size={12} className="text-emerald-500 animate-pulse" strokeWidth={3} /> Verified
                            </div>
                        </div>
                    </div>

                    {/* ✅ CONTROLS SECTION */}
                    <div className="flex items-center gap-3 relative pb-1">
                        
                        {/* Now Playing Badge */}
                        {(isPlaying || activePopup === 'music') && (
                          <div 
                            onClick={() => togglePopup('music')}
                            className="hidden md:flex cursor-pointer items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors animate-in fade-in slide-in-from-right-4"
                          >
                             <div className="flex gap-0.5 h-3 items-end">
                                <div className={`w-0.5 h-full bg-indigo-500 ${isPlaying ? 'animate-music-bar-1' : 'h-1'}`}></div>
                                <div className={`w-0.5 h-2 bg-indigo-500 ${isPlaying ? 'animate-music-bar-2' : 'h-1'}`}></div>
                                <div className={`w-0.5 h-full bg-indigo-500 ${isPlaying ? 'animate-music-bar-3' : 'h-1'}`}></div>
                             </div>
                             <div className="flex flex-col leading-none max-w-[100px]">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  {isLoading ? 'Loading...' : 'Now Playing'}
                                </span>
                                <span className="text-xs font-bold text-slate-700 truncate">
                                  {currentTrack?.name || 'Select Track'}
                                </span>
                             </div>
                          </div>
                        )}

                        {/* ✅ THEME CONTROL COMPONENT */}
                        <ThemeControlSection 
                          isOpen={activePopup === 'color'} 
                          onToggle={() => togglePopup('color')}
                          filters={filters}
                          updateFilter={updateFilter}
                        />

                        {/* ✅ MUSIC PLAYER COMPONENT */}
                        <MusicPlayerSection 
                          isOpen={activePopup === 'music'} 
                          onToggle={() => togglePopup('music')}
                        />
                    </div>

                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}