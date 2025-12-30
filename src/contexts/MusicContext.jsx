"use client";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { BACKGROUND_TRACKS } from "../lib/backgroundMusic"; 

const MusicContext = createContext();

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusicPlayer must be used within MusicProvider");
  return context;
};

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(BACKGROUND_TRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize Audio ONCE (Production Safe)
  useEffect(() => {
    if (typeof window === "undefined" || audioRef.current) return;

    try {
      const audio = new Audio();
      // 🚀 Fix 1: 'metadata' prevents aggressive loading errors on first render
      audio.preload = "metadata"; 
      audio.loop = true;
      audio.volume = volume;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setError(null);
      };

      const handlePlaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleWaiting = () => {
        setIsLoading(true);
      };

      // 🚀 Fix 2: Silent Error Handler (Logs only in Development)
      const handleError = (e) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Music Player Error (Dev Only):", e);
        }
        setIsLoading(false);
        setIsPlaying(false);
        // In production, we fail silently to keep console clean
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('error', handleError);

      audioRef.current = audio;
      setIsInitialized(true);

    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to initialize audio:", err);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  // ✅ Safe Play Function (Promise Handled)
  const safePlay = async () => {
    if (!audioRef.current) return;
    try {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise.catch((err) => {
          // 🚀 Fix 3: Catch Autoplay Policy errors silently
          if (process.env.NODE_ENV === "development") {
            console.warn("Autoplay prevented (harmless):", err);
          }
          setIsPlaying(false);
        });
      }
    } catch (err) {
      // Ignore sync errors
    }
  };

  // ✅ Load Track Handler
  const loadTrack = useCallback(async (track) => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const wasPlaying = isPlaying;
      
      audioRef.current.src = track.url;
      audioRef.current.load();
      
      setCurrentTrack(track);

      if (wasPlaying) {
        await safePlay();
      }
    } catch (err) {
      // Silent fail in production
      setIsLoading(false);
    }
  }, [isPlaying]);

  // ✅ Play/Pause Toggle
  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      if (audioRef.current.paused) {
        await safePlay();
      } else {
        audioRef.current.pause();
      }
    } catch (err) {
      // Silent safety
      setIsPlaying(false);
    }
  }, []);

  // ✅ Public Play Method
  const play = useCallback(async () => {
    await safePlay();
  }, []);

  // ✅ Change Track
  const changeTrack = useCallback((trackId) => {
    const track = BACKGROUND_TRACKS.find(t => t.id === trackId);
    if (track) {
        loadTrack(track);
    }
  }, [loadTrack]);

  // ✅ Controls
  const nextTrack = useCallback(() => {
    const idx = BACKGROUND_TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % BACKGROUND_TRACKS.length;
    changeTrack(BACKGROUND_TRACKS[nextIdx].id);
  }, [currentTrack, changeTrack]);

  const previousTrack = useCallback(() => {
    const idx = BACKGROUND_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = idx === 0 ? BACKGROUND_TRACKS.length - 1 : idx - 1;
    changeTrack(BACKGROUND_TRACKS[prevIdx].id);
  }, [currentTrack, changeTrack]);

  // ✅ Volume
  const updateVolume = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, parseFloat(newVolume)));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  // ✅ Initial Setup (Source only, No Autoplay)
  useEffect(() => {
    if (isInitialized && currentTrack && audioRef.current && !audioRef.current.src) {
      audioRef.current.src = currentTrack.url;
    }
  }, [isInitialized, currentTrack]);

  return (
    <MusicContext.Provider value={{
      isPlaying,
      currentTrack,
      volume,
      isLoading,
      error,
      isInitialized,
      togglePlay,
      play,
      changeTrack,
      nextTrack,
      previousTrack,
      setVolume: updateVolume,
      tracks: BACKGROUND_TRACKS
    }}>
      {children}
    </MusicContext.Provider>
  );
};