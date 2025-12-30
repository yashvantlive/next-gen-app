"use client";
import React from "react";
import { X, Save } from "lucide-react";
import { WIDGETS_CONFIG } from "../../lib/widgetsConfig";

export default function EditWidgetModal({ editConfig, setEditConfig, handleSaveWidget }) {
  if (!editConfig) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col h-[70vh] animate-in zoom-in-95 duration-300 relative">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
             <h3 className="font-bold text-slate-800">Update {WIDGETS_CONFIG.find(w => w.id === editConfig.widgetId)?.name}</h3>
             <button onClick={() => setEditConfig(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <form id="widget-form" onSubmit={handleSaveWidget} className="space-y-6">
               {editConfig.schema && editConfig.schema.map((field, idx) => {
                 let defaultVal = editConfig.data[field.key];
                 if(field.key.includes('.')) {
                     const [parent, child] = field.key.split('.');
                     defaultVal = editConfig.data.relationships?.[parent]?.[child] || 0;
                 }
                 return (
                   <div key={idx}>
                      <label htmlFor={`widget-${field.key.replace(/\./g, '-')}`} className="block text-xs font-bold text-slate-500 uppercase mb-2">{field.label}</label>
                      {field.type === 'slider' ? (
                        <div className="flex items-center gap-4">
                           <input id={`widget-${field.key.replace(/\./g, '-')}`} type="range" name={field.key} min={field.min || 0} max={field.max || 100} defaultValue={defaultVal} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"/>
                           <span className="text-sm font-mono text-slate-700 w-10 text-right font-bold">{defaultVal}</span>
                        </div>
                      ) : (
                        <input id={`widget-${field.key.replace(/\./g, '-')}`} type={field.type} name={field.key} step={field.step || 1} defaultValue={defaultVal} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all"/>
                      )}
                   </div>
                 );
               })}
               <div>
                  <label htmlFor="notes" className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes & Goals</label>
                  <textarea id="notes" name="notes" rows={4} defaultValue={editConfig.data.notes} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 resize-none transition-all" placeholder="Add specific details or targets..."/>
               </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl shrink-0">
             <button type="button" onClick={() => setEditConfig(null)} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
             <button type="submit" form="widget-form" className="px-6 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2"><Save size={18} /> Save Changes</button>
          </div>
       </div>
    </div>
  );
}