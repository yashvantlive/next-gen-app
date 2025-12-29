"use client";
import React from "react";
import { Smile, Settings } from "lucide-react";

export default function MoodSeismograph({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Smile size={18} className="text-yellow-500" />
          <span>Mood Seismograph</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-4">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Mood</span><span className="font-bold">{data.currentMood}/100</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-yellow-400 rounded-full" style={{width: `${data.currentMood}%`}}></div></div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Energy</span><span className="font-bold">{data.energy}%</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-orange-400 rounded-full" style={{width: `${data.energy}%`}}></div></div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Volatility</span><span className="font-bold">{data.volatility}%</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-slate-400 rounded-full" style={{width: `${data.volatility}%`}}></div></div>
         </div>
         {data.notes && <div className="text-xs text-slate-500 pt-2 italic truncate text-center">"{data.notes}"</div>}
      </div>
    </div>
  );
}