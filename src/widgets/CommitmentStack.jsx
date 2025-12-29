"use client";
import React from "react";
import { Rocket, Settings } from "lucide-react";

export default function CommitmentStack({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Rocket size={18} className="text-orange-500" />
          <span>Commitment Stack</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
         <div className="flex gap-2">
            <div className="flex-1 bg-red-50 rounded-lg p-2 text-center border border-red-100">
               <span className="block text-xl font-bold text-red-600">{data.urgentTasks}</span>
               <span className="text-[10px] uppercase font-bold text-red-400">Urgent</span>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
               <span className="block text-xl font-bold text-blue-600">{data.upcomingTasks}</span>
               <span className="text-[10px] uppercase font-bold text-blue-400">Upcoming</span>
            </div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Task Clearance Rate</span>
               <span className="font-bold text-slate-700">{data.clearanceRate}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-600 rounded-full" style={{width: `${data.clearanceRate}%`}}></div>
            </div>
         </div>
         {data.notes && <div className="text-xs text-slate-500 pt-1 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
}