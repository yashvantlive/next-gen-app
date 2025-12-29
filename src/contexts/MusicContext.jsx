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
  // ✅ Audio Instance (Singleton)
  const audioRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(BACKGROUND_TRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize Audio ONCE (Production Ready)
  useEffect(() => {
    if (typeof window === "undefined" || audioRef.current) return;

    try {
      const audio = new Audio();
      audio.preload = "metadata"; // Optimize loading
      audio.loop = true;
      audio.volume = volume;
      
      // ✅ Event Listeners for robust state management
      audio.addEventListener('canplay', () => {
        setIsLoading(false);
        setError(null);
      });
      
      audio.addEventListener('playing', () => {
        setIsPlaying(true);
        setIsLoading(false);
      });
      
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio Error:', e);
        setError('Failed to load track');
        setIsLoading(false);
        setIsPlaying(false);
      });

      audio.addEventListener('loadstart', () => {
        setIsLoading(true);
      });

      audioRef.current = audio;
      setIsInitialized(true);
      
      console.log('🎵 Music Player Initialized');
    } catch (err) {
      console.error('Failed to initialize audio:', err);
      setError('Audio initialization failed');
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, []);

  // ✅ Handle Track Changes (Production Ready)
  const loadTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    setIsLoading(true);
    setError(null);

    // Check if source needs to change
    const currentSrcPath = audio.src ? decodeURI(audio.src).split(window.location.origin)[1] : '';
    const newTrackPath = decodeURI(track.url);

    if (currentSrcPath !== newTrackPath) {
      audio.src = track.url;
      audio.load();
      console.log('🎵 Loading track:', track.name);
    }
  }, []);

  // ✅ Play/Pause Control (Spotify-level handling)
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isInitialized) {
      console.warn('Audio not initialized');
      return;
    }

    try {
      setIsLoading(true);
      
      // Ensure track is loaded
      if (!audio.src || audio.src === window.location.href) {
        loadTrack(currentTrack);
      }

      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        setError(null);
        console.log('▶️ Playing:', currentTrack.name);
      }
    } catch (error) {
      console.error('Play error:', error);
      
      // Handle specific browser errors
      if (error.name === 'NotAllowedError') {
        setError('Click to enable audio');
      } else if (error.name === 'NotSupportedError') {
        setError('Audio format not supported');
      } else {
        setError('Playback failed');
      }
      
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, currentTrack, loadTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    console.log('⏸️ Paused');
  }, []);

  // ✅ Toggle Play/Pause
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  // ✅ Change Track
  const changeTrack = useCallback((trackId) => {
    const track = BACKGROUND_TRACKS.find(t => t.id === trackId);
    if (!track) return;

    const wasPlaying = isPlaying;
    
    // Pause current track
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentTrack(track);
    loadTrack(track);

    // Resume if was playing
    if (wasPlaying) {
      setTimeout(() => play(), 100);
    }

    console.log('🔄 Track changed to:', track.name);
  }, [isPlaying, loadTrack, play]);

  // ✅ Next Track
  const nextTrack = useCallback(() => {
    const idx = BACKGROUND_TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % BACKGROUND_TRACKS.length;
    changeTrack(BACKGROUND_TRACKS[nextIdx].id);
  }, [currentTrack, changeTrack]);

  // ✅ Previous Track
  const previousTrack = useCallback(() => {
    const idx = BACKGROUND_TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIdx = idx === 0 ? BACKGROUND_TRACKS.length - 1 : idx - 1;
    changeTrack(BACKGROUND_TRACKS[prevIdx].id);
  }, [currentTrack, changeTrack]);

  // ✅ Volume Control
  const updateVolume = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, parseFloat(newVolume)));
    setVolume(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  // ✅ Load track when currentTrack changes
  useEffect(() => {
    if (isInitialized && currentTrack) {
      loadTrack(currentTrack);
    }
  }, [currentTrack, isInitialized, loadTrack]);

  // ✅ Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <MusicContext.Provider value={{
      // State
      isPlaying,
      currentTrack,
      volume,
      tracks: BACKGROUND_TRACKS,
      isLoading,
      error,
      isInitialized,
      
      // Actions
      togglePlay,
      play,
      pause,
      changeTrack,
      nextTrack,
      previousTrack,
      setVolume: updateVolume,
    }}>
      {children}
    </MusicContext.Provider>
  );
};