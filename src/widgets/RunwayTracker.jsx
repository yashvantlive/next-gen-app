"use client";
import React from "react";
import { DollarSign, Settings } from "lucide-react";

export default function RunwayTracker({ data, onEdit }) {
  const progress = Math.min(100, (data.currentBalance / data.savingsGoal) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <DollarSign size={18} className="text-emerald-600" />
          <span>Runway Tracker</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="text-center py-2">
          <span className="text-3xl font-bold text-slate-800">₹{data.currentBalance}</span>
          <p className="text-xs text-slate-500 mt-1">Current Balance</p>
        </div>

        <div className="space-y-1">
           <div className="flex justify-between text-xs text-slate-500">
             <span>Savings Goal</span>
             <span>{Math.round(progress)}%</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
           </div>
           <div className="flex justify-between text-[10px] text-slate-400 mt-1">
             <span>₹0</span>
             <span>₹{data.savingsGoal}</span>
           </div>
        </div>
        
        {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 italic truncate mt-auto">{data.notes}</div>}
      </div>
    </div>
  );
}