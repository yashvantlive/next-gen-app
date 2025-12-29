"use client";
import React from "react";
import { Target, Settings } from "lucide-react";

export default function TrajectoryLock({ data, onEdit }) {
  const cgpaProgress = (data.currentCGPA / 10) * 100;
  const attendanceColor = data.attendance < 75 ? "bg-rose-500" : "bg-emerald-500";
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Target size={18} className="text-violet-600" />
          <span>Trajectory Lock</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>CGPA: {data.currentCGPA} / {data.targetCGPA}</span>
            <span>Target</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${cgpaProgress}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Attendance</span>
            <span className={data.attendance < 75 ? "text-rose-600 font-bold" : "text-emerald-600"}>{data.attendance}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${attendanceColor}`} style={{ width: `${data.attendance}%` }}></div>
          </div>
        </div>
        
        {data.notes && <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
}