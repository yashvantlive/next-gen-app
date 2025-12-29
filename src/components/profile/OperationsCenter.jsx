"use client";
import React from "react";
import { LayoutGrid, PlusCircle } from "lucide-react";

export default function OperationsCenter({ setIsStoreOpen }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <LayoutGrid className="text-indigo-600" size={24}/> Operations Center
          </h2>
          <p className="text-sm text-slate-500 mt-1">Your personal analytics dashboard.</p>
      </div>
      <button onClick={() => setIsStoreOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors border border-indigo-200">
         <PlusCircle size={16} /> Customize Widgets
      </button>
   </div>
  );
}