"use client";
import React from "react";
import { Star, Settings } from "lucide-react";

export default function LegacyBuilder({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Star size={18} className="text-amber-400" />
          <span>Legacy Builder</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Impact Score</span>
               <span className="font-bold text-amber-500">{data.impactScore}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" style={{width: `${data.impactScore}%`}}></div>
            </div>
         </div>
         
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Community Contrib</span>
               <span className="font-bold text-slate-600">{data.community}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-400 rounded-full" style={{width: `${data.community}%`}}></div>
            </div>
         </div>

         <div className="flex justify-between items-center py-2 border-t border-slate-50 mt-auto">
            <span className="text-xs text-slate-600">Major Achievements</span>
            <span className="text-xl font-bold text-slate-800">{data.achievements}</span>
         </div>
         {data.notes && <div className="text-xs text-slate-500 italic truncate">"{data.notes}"</div>}
      </div>
    </div>
  );
}