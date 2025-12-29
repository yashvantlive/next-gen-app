import React from 'react';
import { Activity } from "lucide-react";

export default function FocusHUD({ score, theme, streak }) {
  return (
    <div className="lg:col-span-4 w-full">
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-3xl transition-shadow duration-500">
        
        {/* Glow Effect */}
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${theme.gradient} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-700`}></div>
        
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Focus Score</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums transition-all">
                {score}
              </span>
              <span className="text-base font-bold text-slate-400">pts</span>
            </div>
          </div>
          <div className={`h-14 w-14 rounded-2xl ${theme.bg_soft} flex items-center justify-center ${theme.text} border ${theme.border} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
            <Activity size={28} />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full bg-${theme.primary}-500 animate-pulse`}></div>
            Streak: {streak} Days
          </span>
          <span className={`${theme.text} font-bold`}>System Optimal ↗</span>
        </div>
      </div>
    </div>
  );
}