import React, { useState, useEffect } from 'react';
import { StickyNote, CheckCircle2, Trash2 } from "lucide-react";

export default function StickyBrain({ theme }) {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("stickyNote");
    if (saved) setNote(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("stickyNote", note);
  }, [note]);

  return (
    <div className={`rounded-[2rem] border shadow-sm transition-all duration-500 overflow-hidden h-auto ${theme.sticky_bg} ${theme.sticky_border}`}>
      <div className="p-4 sm:px-6 flex justify-between items-center cursor-default">
        <h3 className={`font-bold flex items-center gap-3 text-sm uppercase tracking-wider ${theme.text_main}`}>
          <StickyNote size={18} className={theme.radar_color}/> Scratchpad
        </h3>
        <div className={`w-2 h-2 rounded-full ${note ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
      </div>
      
      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <textarea 
          id="scratchpad-note"
          name="scratchpad-note"
          className={`w-full h-40 rounded-xl border p-4 text-sm focus:ring-2 focus:border-transparent outline-none resize-none font-medium leading-relaxed shadow-inner ${theme.card_bg} ${theme.text_main} ${theme.border} focus:ring-${theme.accent_bg}`}
          placeholder="Capture ideas, formulas, or quick thoughts here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-between items-center mt-3 px-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${theme.text_sub}`}>
            <CheckCircle2 size={10}/> Local Memory
          </span>
          {note && (
            <button onClick={() => setNote("")} className={`transition-colors p-2 rounded-lg ${theme.text_sub} hover:bg-slate-200`}>
              <Trash2 size={14}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}