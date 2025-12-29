"use client";
import React from 'react';
import Link from 'next/link';
import { User, Sparkles } from 'lucide-react';

export default function NavigationBar({ profile, user, currentMood, onMoodChange, theme }) {
  
  const handleMoodClick = (mood) => {
    if (onMoodChange) {
      onMoodChange(mood);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo (Fixed Purple) */}
        <Link href="/home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600 text-white font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
            Y
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">YOU LEARN</span>
        </Link>

        {/* RIGHT: Profile & Mood Actions */}
        <div className="flex items-center gap-6">
          
          {/* Mood Toggles */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-full border border-slate-200">
            {['focus', 'chill', 'hustle', 'exam', 'tired'].map((m) => (
              <button
                key={m}
                onClick={() => handleMoodClick(m)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                  currentMood === m 
                    ? 'bg-white text-slate-900 shadow-sm scale-105' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* --- PROFILE SECTION --- */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 relative">
            
            {/* Aesthetic Text (Student OS removed) */}
            <div className="hidden md:flex flex-col items-end mr-1 cursor-default">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                My Space <Sparkles size={10} className="text-amber-400"/>
              </span>
            </div>

            {/* Profile Avatar -> Direct Link to /profile */}
            <Link href="/profile" className="relative focus:outline-none group">
                {user?.photoURL ? (
                    <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform object-cover ring-2 ring-slate-50"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-600 text-white font-bold shadow-md hover:scale-105 transition-transform">
                        {profile?.displayName?.[0] || <User size={18}/>}
                    </div>
                )}
                {/* Online Dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}