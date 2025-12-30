"use client";
import React from 'react';
import Link from 'next/link';
import { 
  User, Sparkles, 
  Zap, Coffee, TrendingUp, BookOpen, BatteryWarning // ✅ Icons Import kiye
} from 'lucide-react';

export default function NavigationBar({ profile, user, currentMood, onMoodChange, theme }) {
  
  const handleMoodClick = (mood) => {
    if (onMoodChange) {
      onMoodChange(mood);
    }
  };

  // ✅ Mood ke liye Icons ka Map
  const moodIcons = {
    focus: <Zap size={18} strokeWidth={2.5} />,
    chill: <Coffee size={18} strokeWidth={2.5} />,
    hustle: <TrendingUp size={18} strokeWidth={2.5} />,
    exam: <BookOpen size={18} strokeWidth={2.5} />,
    tired: <BatteryWarning size={18} strokeWidth={2.5} />
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo (Fixed Purple) */}
        <Link href="/home" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-600 text-white font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
            Y
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">YOU LEARN</span>
          <span className="font-bold text-lg tracking-tight text-slate-900 sm:hidden">YL</span>
        </Link>

        {/* RIGHT: Profile & Mood Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* ✅ Mood Toggles (Updated for Mobile Icons / Desktop Text) */}
          <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
            {['focus', 'chill', 'hustle', 'exam', 'tired'].map((m) => (
              <button
                key={m}
                onClick={() => handleMoodClick(m)}
                className={`
                  relative flex items-center justify-center rounded-full transition-all duration-300
                  ${currentMood === m 
                    ? 'bg-white text-slate-900 shadow-sm scale-105' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                  }
                  /* Mobile Sizes (Icon) vs Desktop Sizes (Text) */
                  w-8 h-8 md:w-auto md:h-auto md:px-3 md:py-1.5
                `}
                title={m.toUpperCase()} // Hover par naam dikhega
              >
                {/* 📱 Mobile/iPad: Show Icon */}
                <span className="md:hidden">
                  {moodIcons[m]}
                </span>

                {/* 💻 Desktop: Show Text (Same as before) */}
                <span className="hidden md:block text-[10px] font-bold uppercase tracking-wider">
                  {m}
                </span>
              </button>
            ))}
          </div>

          {/* --- PROFILE SECTION --- */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 relative">
            
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
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform object-cover ring-2 ring-slate-50"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-violet-600 text-white font-bold shadow-md hover:scale-105 transition-transform">
                        {profile?.displayName?.[0] || <User size={18}/>}
                    </div>
                )}
                {/* Online Dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}