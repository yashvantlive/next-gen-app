"use client";
import React from "react";
import { Activity, Settings } from "lucide-react";

export default function NetworkHealth({ data, onEdit }) {
  const rels = data.relationships || {
    family: { current: 0, goal: 0 },
    mentor: { current: 0, goal: 0 },
    friends: { current: 0, goal: 0 }
  };

  const RelationshipBar = ({ label, current, goal }) => {
    let barColor = "bg-rose-500"; 
    if (current >= 40 && current < 70) barColor = "bg-amber-500"; 
    if (current >= 70) barColor = "bg-emerald-500";

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-600 uppercase">{label}</span>
          <span className="text-xs font-bold text-slate-500">{current}%</span>
        </div>
        <div className="relative h-4">
          <div className="absolute inset-0 bg-slate-100 rounded-full border border-slate-200"></div>
          <div className={`absolute inset-y-0 left-0 rounded-full ${barColor} opacity-90 transition-all duration-500`} style={{ width: `${current}%` }}></div>
          <div className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-800 rounded-full z-10" style={{ left: `${goal}%` }} title={`Goal: ${goal}%`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Activity size={18} className="text-rose-500" />
          <span>Network Health</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-5 flex-1">
        <RelationshipBar label="Family" current={rels.family?.current || 0} goal={rels.family?.goal || 0} />
        <RelationshipBar label="Mentor" current={rels.mentor?.current || 0} goal={rels.mentor?.goal || 0} />
        <RelationshipBar label="Friends" current={rels.friends?.current || 0} goal={rels.friends?.goal || 0} />
      </div>
        
      {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 mt-4 italic truncate">"{data.notes}"</div>}
    </div>
  );
}