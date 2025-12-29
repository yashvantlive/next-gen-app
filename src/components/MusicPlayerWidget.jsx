"use client";
import React, { useState } from "react";
import { Music, Pause, Play, SkipForward, SkipBack, X, Volume2 } from "lucide-react";
import { useMusicPlayer } from "../contexts/MusicContext";

export default function MusicPlayerWidget() {
  const { 
    musicEnabled, 
    isPlaying, 
    togglePlay, 
    currentTrack, 
    tracks, 
    changeTrack, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);

  // If music is disabled in settings, don't render anything
  if (!musicEnabled) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
      
      {/* Expanded Player */}
      {isExpanded && (
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-2xl w-72 animate-in slide-in-from-bottom-10 fade-in duration-300 mb-2">
           
           {/* Header */}
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: currentTrack.color }}>
                    <Music size={20} />
                 </div>
                 <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-800 truncate w-40">{currentTrack.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{currentTrack.artist}</p>
                 </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
           </div>

           {/* Controls */}
           <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={previousTrack} className="text-slate-400 hover:text-indigo-600 transition-colors"><SkipBack size={20}/></button>
              <button 
                onClick={togglePlay} 
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1"/>}
              </button>
              <button onClick={nextTrack} className="text-slate-400 hover:text-indigo-600 transition-colors"><SkipForward size={20}/></button>
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
           </div>

           {/* Mini Playlist */}
           <div className="border-t border-slate-100 pt-2 max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
              {tracks.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => changeTrack(t.id)} 
                  className={`w-full text-left p-2 rounded-lg flex items-center gap-2 text-xs font-medium transition-colors ${currentTrack.id === t.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: t.color}}></div>
                  <span className="truncate flex-1">{t.name}</span>
                  {currentTrack.id === t.id && isPlaying && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Floating Button (Visible when collapsed) */}
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)} 
          className="group flex items-center gap-2 pl-1 pr-4 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ backgroundColor: currentTrack.color }}>
            <Music size={14} />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Music</span>
             {isPlaying && <span className="text-xs font-bold text-slate-800 max-w-[80px] truncate leading-tight">{currentTrack.name}</span>}
          </div>
        </button>
      )}
    </div>
  );
}