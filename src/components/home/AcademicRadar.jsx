import React from 'react';
import { Brain } from "lucide-react";

export default function AcademicRadar({ progress, percent, theme }) {
  return (
    <div className={`rounded-[2rem] p-6 border shadow-sm relative overflow-hidden transition-all duration-500 ${theme.card_bg} ${theme.card_border}`}>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className={`font-bold flex items-center gap-2 ${theme.text_main}`}>
            <Brain size={20} className={theme.radar_color}/> Syllabus Reactor
          </h3>
          <p className={`text-xs mt-1 font-medium ${theme.text_sub}`}>Completion Rate</p>
        </div>
        <span className={`text-2xl font-black tracking-tight ${theme.radar_color}`}>{percent}%</span>
      </div>

      <div className="relative pt-2 pb-8 z-10">
        <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full bg-gradient-to-r ${theme.progress_bar} rounded-full transition-all duration-1000 ease-out relative`} 
            style={{ width: `${percent}%` }}
          >
            <div className="absolute top-0 right-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
          </div>
        </div>
        <div className={`absolute bottom-0 w-full flex justify-between text-[9px] font-bold uppercase tracking-widest mt-2 ${theme.text_sub}`}>
          <span>Init</span>
          <span>Mid</span>
          <span>Final</span>
        </div>
      </div>

      <div className={`mt-2 p-4 rounded-2xl border flex items-center justify-between relative z-10 ${theme.radar_bg} ${theme.border}`}>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-wider ${theme.radar_color}`}>Topics Secured</p>
          <p className={`text-[10px] font-medium ${theme.text_sub}`}>Keep chipping away.</p>
        </div>
        <div className="text-right">
           <span className={`text-xl font-black ${theme.radar_color}`}>{progress.completed}</span>
           <span className={`text-xs font-bold ${theme.text_sub}`}>/{progress.total}</span>
        </div>
      </div>
    </div>
  );
}