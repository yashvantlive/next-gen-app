"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, Wrench, LogOut, Shield, Edit, Settings, Mail, 
  GraduationCap, CheckCircle2, Palette, Music, Pause, Play, SkipForward, 
  SkipBack, Volume2, X, BarChart3, Sun, Droplet, Loader2, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "../../lib/firebaseClient"; 
import { getBranchAssets } from "../../lib/branchData";
import { useMusicPlayer } from "../../contexts/MusicContext"; 
import PhysicsBackground from "./PhysicsBackground"; 

export default function ProfileHeader({ profile, authUser, isAdmin, handleLogout }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Theme Filters
  const [filters, setFilters] = useState({ hue: 0, saturation: 100, brightness: 100 });
  
  // Popup Management
  const [activePopup, setActivePopup] = useState(null);

  const togglePopup = (popupName) => {
    setActivePopup(activePopup === popupName ? null : popupName);
  };

  // ✅ Music Player - Production Ready
  const { 
    isPlaying, 
    togglePlay, 
    play,
    changeTrack, 
    currentTrack, 
    tracks, 
    volume, 
    setVolume, 
    nextTrack, 
    previousTrack,
    isLoading,
    error,
    isInitialized
  } = useMusicPlayer();

  const theme = getBranchAssets(profile?.branchId);

  // ✅ Handle Music Toggle with User Interaction
  const handleMusicToggle = async (e) => {
    e.stopPropagation();
    
    if (!isInitialized) {
      console.warn('Music player not ready');
      return;
    }

    await togglePlay();
  };

  // ✅ Handle Track Change with Auto-play
  const handleTrackChange = async (trackId) => {
    changeTrack(trackId);
    
    // Auto-play after track change if needed
    if (!isPlaying) {
      setTimeout(async () => {
        await play();
      }, 200);
    }
  };

  // Load Saved Theme
  useEffect(() => {
    const fetchSettings = async () => {
      if (!authUser?.uid) return;
      try {
        const snap = await getDoc(doc(db, "users", authUser.uid));
        if (snap.exists() && snap.data().themePreferences) {
          setFilters(snap.data().themePreferences);
        }
      } catch (e) { 
        console.error('Failed to load theme:', e); 
      }
    };
    fetchSettings();
  }, [authUser]);

  // Auto-Save Theme
  useEffect(() => {
    if (!authUser?.uid) return;
    const timeout = setTimeout(async () => {
      try { 
        await setDoc(
          doc(db, "users", authUser.uid), 
          { themePreferences: filters }, 
          { merge: true }
        ); 
      } catch (err) {
        console.error('Failed to save theme:', err);
      }
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
           <div className="flex items-center gap-3">
             <Link href="/home" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
               <ChevronLeft size={22} strokeWidth={2.5} />
             </Link>
             <h1 className="text-lg font-bold text-slate-800 tracking-tight">Profile</h1>
           </div>
           
           <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all active:scale-95 group"
              >
                <Wrench size={22} strokeWidth={2} className="group-hover:rotate-45 transition-transform duration-300 ease-out" /> 
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-3 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-1.5 z-20 animate-in fade-in zoom-in-95 origin-top-right">
                      {isAdmin && (
                        <button 
                          onClick={() => router.push("/admin")} 
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-indigo-600 rounded-xl transition-colors text-left"
                        >
                          <Shield size={16}/> Admin Panel
                        </button>
                      )}
                      <button 
                        onClick={() => router.push("/onboarding")} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-violet-600 rounded-xl transition-colors text-left"
                      >
                        <Edit size={16}/> Edit Profile
                      </button>
                      <button 
                        onClick={() => router.push("/settings")} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 rounded-xl transition-colors text-left"
                      >
                        <Settings size={16}/> Settings
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2"></div>
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut size={16}/> Log Out
                      </button>
                  </div>
                </>
              )}
           </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden relative group">
           
           {/* Physics Background */}
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

                    {/* ✅ CONTROLS - ALWAYS VISIBLE */}
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
                                <span className="text-xs font-bold text-slate-700 truncate">{currentTrack?.name}</span>
                             </div>
                          </div>
                        )}

                        {/* Color Button */}
                        <div className="relative">
                            <button 
                                onClick={() => togglePopup('color')}
                                className={`p-3 rounded-full border transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                                  activePopup === 'color' 
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
                                    : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                                }`}
                            >
                                <Palette size={20} />
                            </button>
                            
                            {activePopup === 'color' && (
                                <>
                                    {/* Mobile: Small Popup - No Blur, Background Visible */}
                                    <div className="sm:hidden fixed inset-0 z-40 flex items-end justify-center pb-24 pointer-events-none">
                                        <div 
                                          className="w-[90%] max-w-[280px] bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Compact Header */}
                                            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
                                                <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                    <Palette size={12} className="text-indigo-600" />
                                                    Theme
                                                </h3>
                                                <button 
                                                    onClick={() => togglePopup(null)}
                                                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors active:scale-95"
                                                >
                                                    <X size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>

                                            {/* Compact Content */}
                                            <div className="p-3 space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                      <span className="flex items-center gap-1"><Palette size={8}/> Hue</span>
                                                      <span className="text-indigo-600">{filters.hue}°</span>
                                                    </div>
                                                    <input 
                                                      type="range" 
                                                      min="0" 
                                                      max="360" 
                                                      value={filters.hue} 
                                                      onChange={(e) => updateFilter('hue', e.target.value)} 
                                                      className="w-full h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full cursor-pointer"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                      <span className="flex items-center gap-1"><Droplet size={8}/> Sat</span>
                                                      <span className="text-indigo-600">{filters.saturation}%</span>
                                                    </div>
                                                    <input 
                                                      type="range" 
                                                      min="0" 
                                                      max="200" 
                                                      value={filters.saturation} 
                                                      onChange={(e) => updateFilter('saturation', e.target.value)} 
                                                      className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-indigo-600"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                      <span className="flex items-center gap-1"><Sun size={8}/> Bright</span>
                                                      <span className="text-indigo-600">{filters.brightness}%</span>
                                                    </div>
                                                    <input 
                                                      type="range" 
                                                      min="50" 
                                                      max="150" 
                                                      value={filters.brightness} 
                                                      onChange={(e) => updateFilter('brightness', e.target.value)} 
                                                      className="w-full h-1.5 bg-slate-200 rounded-full cursor-pointer accent-indigo-600"
                                                    />
                                                </div>
                                            </div>

                                            {/* Compact Footer */}
                                            <div className="px-3 py-2 border-t border-slate-100">
                                                <span className="text-[9px] text-slate-500 flex items-center gap-1 justify-center">
                                                    <CheckCircle2 size={10} className="text-emerald-500" />
                                                    Auto-saved
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Popup */}
                                    <div className="hidden sm:block absolute bottom-full right-0 mb-3 w-64 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 origin-bottom-right">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <Palette size={14} className="text-indigo-600" />
                                                Theme Colors
                                            </h3>
                                            <button 
                                                onClick={() => togglePopup(null)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors active:scale-95"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 space-y-4">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                  <span className="flex items-center gap-1"><Palette size={10}/> Hue</span>
                                                  <span className="text-indigo-600">{filters.hue}°</span>
                                                </div>
                                                <input 
                                                  type="range" 
                                                  min="0" 
                                                  max="360" 
                                                  value={filters.hue} 
                                                  onChange={(e) => updateFilter('hue', e.target.value)} 
                                                  className="w-full h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                  <span className="flex items-center gap-1"><Droplet size={10}/> Sat</span>
                                                  <span className="text-indigo-600">{filters.saturation}%</span>
                                                </div>
                                                <input 
                                                  type="range" 
                                                  min="0" 
                                                  max="200" 
                                                  value={filters.saturation} 
                                                  onChange={(e) => updateFilter('saturation', e.target.value)} 
                                                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                  <span className="flex items-center gap-1"><Sun size={10}/> Bright</span>
                                                  <span className="text-indigo-600">{filters.brightness}%</span>
                                                </div>
                                                <input 
                                                  type="range" 
                                                  min="50" 
                                                  max="150" 
                                                  value={filters.brightness} 
                                                  onChange={(e) => updateFilter('brightness', e.target.value)} 
                                                  className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-4 pb-3 pt-2 border-t border-slate-100">
                                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                Auto-saving changes
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ✅ MUSIC BUTTON - Production Ready */}
                        <div className="relative">
                            <button 
                                onClick={() => togglePopup('music')} 
                                className={`p-3 rounded-full border transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                                  activePopup === 'music' || isPlaying 
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
                                    : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                                }`}
                                disabled={!isInitialized}
                            >
                                {isLoading ? (
                                  <Loader2 size={20} className="animate-spin" />
                                ) : isPlaying ? (
                                  <BarChart3 size={20} className="animate-pulse" />
                                ) : (
                                  <Music size={20} />
                                )}
                            </button>

                            {activePopup === 'music' && (
                                <>
                                    <div className="fixed inset-0 z-40 sm:hidden bg-black/10 backdrop-blur-[1px]" onClick={() => togglePopup(null)}></div>
                                    <div className={`
                                        fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[320px] 
                                        sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-72 sm:mb-3 
                                        bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 
                                        animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom
                                    `}>
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div 
                                                  className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center shrink-0 transition-colors duration-500" 
                                                  style={{ backgroundColor: currentTrack?.color || '#6366F1' }}
                                                >
                                                    {isLoading ? (
                                                      <Loader2 size={18} className="text-white animate-spin" />
                                                    ) : isPlaying ? (
                                                      <div className="flex gap-0.5 h-3 items-end">
                                                        <div className="w-0.5 h-full bg-white animate-pulse"/>
                                                        <div className="w-0.5 h-2 bg-white animate-pulse delay-75"/>
                                                        <div className="w-0.5 h-full bg-white animate-pulse delay-150"/>
                                                      </div>
                                                    ) : (
                                                      <Music size={18} className="text-white" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                  <h4 className="text-sm font-bold text-slate-800 truncate">
                                                    {currentTrack?.name || "Select Track"}
                                                  </h4>
                                                  <p className="text-[10px] text-slate-500 truncate">
                                                    {currentTrack?.artist || "Ambient"}
                                                  </p>
                                                </div>
                                            </div>
                                            <button 
                                              onClick={() => togglePopup(null)} 
                                              className="text-slate-400 hover:text-rose-500"
                                            >
                                              <X size={16}/>
                                            </button>
                                        </div>

                                        {/* Error Display */}
                                        {error && (
                                          <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={14} className="text-rose-500" />
                                            <span className="text-xs text-rose-600">{error}</span>
                                          </div>
                                        )}

                                        {/* Controls */}
                                        <div className="flex items-center justify-between gap-2 mb-4 px-2">
                                            <button 
                                              onClick={previousTrack} 
                                              className="text-slate-400 hover:text-indigo-600 active:scale-90 transition-transform disabled:opacity-30"
                                              disabled={isLoading}
                                            >
                                              <SkipBack size={20}/>
                                            </button>
                                            
                                            <button 
                                              onClick={handleMusicToggle}
                                              disabled={isLoading || !isInitialized}
                                              className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                  <Loader2 size={20} className="animate-spin" />
                                                ) : isPlaying ? (
                                                  <Pause size={20} fill="currentColor"/>
                                                ) : (
                                                  <Play size={20} fill="currentColor" className="ml-1"/>
                                                )}
                                            </button>
                                            
                                            <button 
                                              onClick={nextTrack} 
                                              className="text-slate-400 hover:text-indigo-600 active:scale-90 transition-transform disabled:opacity-30"
                                              disabled={isLoading}
                                            >
                                              <SkipForward size={20}/>
                                            </button>
                                        </div>

                                        {/* Volume */}
                                        <div className="flex items-center gap-2 mb-4 px-1">
                                            <Volume2 size={14} className="text-slate-400"/>
                                            <input 
                                              type="range" 
                                              min="0" 
                                              max="1" 
                                              step="0.01" 
                                              value={volume} 
                                              onChange={(e) => setVolume(parseFloat(e.target.value))} 
                                              className="w-full h-1 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 w-8 text-right">
                                              {Math.round(volume * 100)}%
                                            </span>
                                        </div>

                                        {/* Track List */}
                                        <div className="border-t border-slate-100 pt-2 max-h-32 sm:max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                            {tracks.map(t => (
                                                <button 
                                                  key={t.id} 
                                                  onClick={() => handleTrackChange(t.id)}
                                                  disabled={isLoading}
                                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors disabled:opacity-50 ${
                                                    currentTrack.id === t.id 
                                                      ? 'bg-indigo-50 text-indigo-700' 
                                                      : 'hover:bg-slate-50 text-slate-600'
                                                  }`}
                                                >
                                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }}></div>
                                                  <span className="text-xs font-medium truncate flex-1">{t.name}</span>
                                                  {currentTrack.id === t.id && isPlaying && (
                                                    <div className="flex gap-0.5 h-2 items-end">
                                                      <div className="w-0.5 h-full bg-indigo-500 animate-pulse"/>
                                                      <div className="w-0.5 h-1.5 bg-indigo-500 animate-pulse delay-75"/>
                                                      <div className="w-0.5 h-full bg-indigo-500 animate-pulse delay-150"/>
                                                    </div>
                                                  )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}