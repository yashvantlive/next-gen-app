"use client";
import React, { useState, useEffect } from "react";
import { Target, Shield, Edit3, Sparkles, StickyNote } from "lucide-react";

export default function ExamTarget({ profile, onEdit }) {
  const goals = profile?.examGoals || {};
  
  const isGoalSet = (goal) => goal && goal.name && goal.name !== "Set Goal" && goal.name !== "Set Backup";
  const primary = isGoalSet(goals.primary) ? goals.primary : null;
  const secondary = isGoalSet(goals.secondary) ? goals.secondary : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Target className="text-violet-600"/> Target Board
         </h3>
         <button 
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-bold hover:bg-violet-100 transition-colors border border-violet-100 shadow-sm"
         >
            <Edit3 size={14}/> Manage
         </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <TargetCard 
                type="primary"
                data={primary}
                title="High Priority"
                icon={<Sparkles size={18} />}
                theme="from-violet-500 to-indigo-600"
                lightTheme="bg-violet-50/50 border-violet-100"
                emptyLabel="Set Goal"
            />

            <TargetCard 
                type="secondary"
                data={secondary}
                title="Backup Plan"
                icon={<Shield size={18} />}
                theme="from-blue-500 to-cyan-600"
                lightTheme="bg-blue-50/50 border-blue-100"
                emptyLabel="Set Backup"
            />
      </div>
    </div>
  );
}

// --- Target Card Component with FIXED Popup ---
function TargetCard({ data, title, icon, theme, lightTheme, emptyLabel }) {
    const isSet = !!data;
    const [isMobileActive, setIsMobileActive] = useState(false);

    // --- Mobile Interaction Logic ---
    useEffect(() => {
        if (!isMobileActive) return;

        const handleDismiss = () => setIsMobileActive(false);

        // Dismiss on scroll or touching anywhere else
        window.addEventListener("scroll", handleDismiss, { passive: true });
        window.addEventListener("touchstart", handleDismiss);
        window.addEventListener("click", handleDismiss);

        return () => {
            window.removeEventListener("scroll", handleDismiss);
            window.removeEventListener("touchstart", handleDismiss);
            window.removeEventListener("click", handleDismiss);
        };
    }, [isMobileActive]);

    const handleMobileClick = (e) => {
        // Only trigger on touch devices/mobile behavior
        if (window.matchMedia("(hover: none)").matches) {
            e.stopPropagation(); // Prevent immediate dismissal
            setIsMobileActive(!isMobileActive);
        }
    };

    // Container Styling
    const containerClass = `h-full rounded-2xl border transition-all flex flex-col relative overflow-visible group ${isSet ? 'bg-white border-slate-200 shadow-sm hover:shadow-md' : `border-dashed border-2 ${lightTheme} items-center justify-center text-center p-4 hover:bg-white`}`;

    if (!isSet) {
        return (
            <div className={containerClass}>
                <div className={`p-3 rounded-full bg-gradient-to-br ${theme} text-white shadow-md group-hover:scale-110 transition-transform mb-2`}>
                    {icon}
                </div>
                <h4 className="text-sm font-bold text-slate-700">{emptyLabel}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Define to track.</p>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            {/* Top Gradient Line (Rounded Top) */}
            <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme} rounded-t-2xl`}></div>
            
            <div className="p-5 flex-1 flex flex-col relative z-10">
                {/* Header Section */}
                <div className="flex items-center gap-2 mb-3">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${theme}`}>
                        {icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</span>
                </div>
                
                {/* Exam Name */}
                <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                    {data.name}
                </h4>
                
                <div className="flex items-center gap-2 mt-2">
                     <span className="text-sm font-bold text-slate-500">Target:</span>
                     <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">'{data.year}</span>
                </div>

                {/* --- SMART NOTES SECTION (FIXED UI) --- */}
                {data.notes && (
                    <div className="mt-auto pt-4 relative group/note">
                        
                        {/* 1. The Trigger Box */}
                        <div 
                            onClick={handleMobileClick}
                            className={`flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer transition-colors relative z-10 ${isMobileActive ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-indigo-50/50'}`}
                        >
                             <StickyNote size={14} className={`shrink-0 mt-0.5 transition-colors ${isMobileActive ? 'text-indigo-600' : 'text-slate-400 group-hover/note:text-indigo-500'}`} />
                             <p className="text-xs text-slate-600 italic leading-snug line-clamp-2 font-medium select-none break-words">
                                "{data.notes}"
                             </p>
                        </div>

                        {/* 2. The Popup (WHITE THEME & WRAPPED TEXT) */}
                        <div className={`
                            absolute bottom-full left-0 w-full mb-3 z-50 px-1
                            transition-all duration-300 ease-out origin-bottom transform
                            ${isMobileActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none group-hover/note:opacity-100 group-hover/note:scale-100 group-hover/note:translate-y-0 group-hover/note:pointer-events-auto'}
                        `}>
                            {/* Changed to bg-white, added border, and text wrapping */}
                            <div className="bg-white text-slate-700 p-4 rounded-xl shadow-xl border border-slate-200 relative">
                                
                                {/* Arrow pointing down (White with border) */}
                                <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
                                
                                <div className="flex gap-2 mb-2 items-center text-violet-600 border-b border-slate-100 pb-2">
                                    <Sparkles size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">My Motivation</span>
                                </div>
                                
                                {/* Added break-words and whitespace-pre-wrap to handle long/multiline text properly */}
                                <p className="text-xs leading-relaxed font-medium text-slate-600 break-words whitespace-pre-wrap">
                                    {data.notes}
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}