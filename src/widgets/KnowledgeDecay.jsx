"use client";
import React from "react";
import { Brain, Settings } from "lucide-react";

export default function KnowledgeDecay({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Brain size={18} className="text-purple-500" />
          <span>Knowledge Decay</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-4 flex-1">
         {[1, 2, 3].map(i => {
            const val = data[`subject${i}`] || 0;
            const color = val < 50 ? 'bg-red-400' : val < 80 ? 'bg-amber-400' : 'bg-green-400';
            return (
               <div key={i}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                     <span>Subject {i}</span>
                     <span>{val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${color}`} style={{width: `${val}%`}}></div>
                  </div>
               </div>
            )
         })}
         {data.notes && <div className="text-xs text-slate-500 pt-2 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
}