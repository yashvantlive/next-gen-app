"use client";
import React from "react";
import { Briefcase, Settings } from "lucide-react";

export default function EmployabilityIndex({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Briefcase size={18} className="text-blue-600" />
          <span>Employability Index</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-4 flex-1">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Skill Readiness</span>
               <span className="font-bold text-blue-600">{data.skillScore}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.skillScore}%` }}></div>
            </div>
         </div>
         
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Market Alignment</span>
               <span className="font-bold text-slate-600">{data.marketDemand}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-400 rounded-full" style={{ width: `${data.marketDemand}%` }}></div>
            </div>
         </div>

         <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">Portfolio Projects</span>
            <span className="text-lg font-bold text-slate-800">{data.projectCount}</span>
         </div>
         {data.notes && <div className="text-xs text-slate-500 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
}