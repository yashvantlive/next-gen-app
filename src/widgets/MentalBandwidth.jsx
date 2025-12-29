"use client";
import React from "react";
import { Cpu, Settings } from "lucide-react";

export default function MentalBandwidth({ data, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Cpu size={18} className="text-amber-500" />
          <span>Mental Bandwidth</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex gap-1 h-8 rounded-md overflow-hidden bg-slate-100">
          <div className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${data.academicLoad}%` }}>
            {data.academicLoad > 15 && "ACAD"}
          </div>
          <div className="bg-indigo-500 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${data.projectLoad}%` }}>
            {data.projectLoad > 15 && "PROJ"}
          </div>
          <div className="bg-slate-200 h-full flex-1"></div>
        </div>

        <div className="flex justify-between items-center">
           <span className="text-xs text-slate-500 font-medium uppercase">Stress Level</span>
           <span className={`text-sm font-bold ${data.stressLevel > 70 ? 'text-rose-500' : 'text-slate-700'}`}>{data.stressLevel}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div className={`h-full rounded-full transition-all ${data.stressLevel > 70 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${data.stressLevel}%` }}></div>
        </div>

        {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 italic truncate mt-auto">{data.notes}</div>}
      </div>
    </div>
  );
}