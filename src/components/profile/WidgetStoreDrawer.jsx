"use client";
import React from "react";
import { X, Check } from "lucide-react";
import { WIDGETS_CONFIG } from "../../lib/widgetsConfig";

export default function WidgetStoreDrawer({ isStoreOpen, setIsStoreOpen, selectedWidgetIds, toggleWidgetSelection }) {
  if (!isStoreOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
       <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsStoreOpen(false)}></div>
       <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <h3 className="font-bold text-slate-800 text-lg">Widget Library</h3>
             <button onClick={() => setIsStoreOpen(false)}><X size={20} className="text-slate-500"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {WIDGETS_CONFIG.map(def => {
               const isSelected = selectedWidgetIds.includes(def.id);
               return (
                 <button key={def.id} onClick={() => toggleWidgetSelection(def.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isSelected ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"}`}>
                    <div className={`p-3 rounded-lg ${isSelected ? "bg-white" : "bg-slate-100"}`}><def.icon size={20} className={def.color || "text-slate-600"} /></div>
                    <div className="flex-1">
                       <h4 className="font-bold text-sm text-slate-800">{def.name}</h4>
                       <p className="text-xs text-slate-500 line-clamp-1">{def.description}</p>
                    </div>
                    {isSelected && <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center"><Check size={12} className="text-white"/></div>}
                 </button>
               );
             })}
          </div>
       </div>
    </div>
  );
}