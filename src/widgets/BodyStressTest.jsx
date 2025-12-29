"use client";
import React from "react";
import { Heart, Settings } from "lucide-react";

export default function BodyStressTest({ data, onEdit }) {
  const average = Math.round((data.sleepQuality + data.nutrition + data.exercise) / 3);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Heart size={18} className="text-rose-500" />
          <span>Body Stress Test</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-3 flex-1">
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">SLEEP</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-400 rounded-full" style={{width: `${data.sleepQuality}%`}}></div></div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">DIET</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-green-400 rounded-full" style={{width: `${data.nutrition}%`}}></div></div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">MOVE</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-orange-400 rounded-full" style={{width: `${data.exercise}%`}}></div></div>
         </div>
         <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">Health Score</span>
            <span className={`font-bold ${average > 70 ? 'text-green-600' : 'text-amber-500'}`}>{average}%</span>
         </div>
      </div>
    </div>
  );
}