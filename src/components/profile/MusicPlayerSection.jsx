"use client";
import React from "react";
import { 
  Music, Pause, Play, SkipForward, SkipBack, Volume2, X, BarChart3, Loader2, AlertCircle 
} from "lucide-react";
import { useMusicPlayer } from "../../contexts/MusicContext"; 

export default function MusicPlayerSection({ isOpen, onToggle }) {
  const { 
    isPlaying, togglePlay, tracks, currentTrack, 
    changeTrack, nextTrack, previousTrack, 
    volume, setVolume, isLoading, error, isInitialized 
  } = useMusicPlayer();

  const safeTrack = currentTrack || { name: 'Select Track', artist: 'Ambient', color: '#6366F1' };

  return (
    <div className="relative">
      <button 
        onClick={onToggle} 
        className={`p-3 rounded-full border transition-all shadow-md active:scale-95 flex items-center gap-2 ${
          isOpen || isPlaying 
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
            : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
        }`}
        disabled={!isInitialized}
        aria-label="Music Player"
      >
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : isPlaying ? <BarChart3 size={20} className="animate-pulse" /> : <Music size={20} />}
      </button>

      {isOpen && (
        <div 
            className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:right-0 sm:bottom-full sm:mb-3"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
            <div 
                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[320px] sm:relative sm:bottom-auto sm:left-auto sm:translate-x-0 sm:w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center shrink-0 transition-colors duration-500" style={{ backgroundColor: safeTrack.color }}>
                            {isLoading ? <Loader2 size={18} className="text-white animate-spin" /> : isPlaying ? <div className="flex gap-0.5 h-3 items-end"><div className="w-0.5 h-full bg-white animate-pulse"/><div className="w-0.5 h-2 bg-white animate-pulse delay-75"/><div className="w-0.5 h-full bg-white animate-pulse delay-150"/></div> : <Music size={18} className="text-white" />}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate">{safeTrack.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{safeTrack.artist}</p>
                        </div>
                    </div>
                    <button onClick={onToggle} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
                </div>

                {error && <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2"><AlertCircle size={14} className="text-rose-500" /><span className="text-xs text-rose-600">{error}</span></div>}

                {/* Controls */}
                <div className="flex items-center justify-between gap-2 mb-4 px-2">
                    <button onClick={previousTrack} disabled={isLoading} className="text-slate-400 hover:text-indigo-600 active:scale-90"><SkipBack size={20}/></button>
                    <button onClick={togglePlay} disabled={isLoading || !isInitialized} className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50">
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
                    </button>
                    <button onClick={nextTrack} disabled={isLoading} className="text-slate-400 hover:text-indigo-600 active:scale-90"><SkipForward size={20}/></button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Volume2 size={14} className="text-slate-400" aria-hidden="true"/>
                    <label htmlFor="music-volume-slider" className="sr-only">Volume</label>
                    <input 
                        type="range" 
                        id="music-volume-slider"   
                        name="music-volume-slider" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume} 
                        onChange={(e) => setVolume(parseFloat(e.target.value))} 
                        className="w-full h-1 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
                    />
                </div>

                <div className="border-t border-slate-100 pt-2 max-h-32 overflow-y-auto space-y-1 custom-scrollbar">
                    {tracks.map(t => (
                        <button key={t.id} onClick={() => changeTrack(t.id)} className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${safeTrack.id === t.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }}></div>
                            <span className="text-xs font-medium truncate flex-1">{t.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}