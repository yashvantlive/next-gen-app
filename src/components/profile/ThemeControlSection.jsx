"use client";
import React from "react";
import { Palette, X, CheckCircle2, Sun, Droplet } from "lucide-react";

export default function ThemeControlSection({ 
  isOpen, 
  onToggle, 
  filters, 
  updateFilter 
}) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className={`p-3 rounded-full border transition-all shadow-md active:scale-95 flex items-center gap-2 ${
          isOpen 
            ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200' 
            : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
        }`}
        aria-label="Toggle Theme Controls"
      >
        <Palette size={20} />
      </button>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:right-0 sm:bottom-full sm:mb-3"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          {/* Mobile Popup */}
          <div className="sm:hidden absolute inset-0 flex items-end justify-center pb-24 pointer-events-none">
            <div 
              className="w-[90%] max-w-[280px] bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <PopupContent 
                filters={filters} 
                updateFilter={updateFilter} 
                onClose={onToggle} 
                prefix="mobile" 
              />
            </div>
          </div>

          {/* Desktop Popup */}
          <div 
            className="hidden sm:block w-64 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-200 origin-bottom-right"
            onClick={(e) => e.stopPropagation()}
          >
             <PopupContent 
                filters={filters} 
                updateFilter={updateFilter} 
                onClose={onToggle} 
                prefix="desktop" 
             />
          </div>
        </div>
      )}
    </div>
  );
}

const PopupContent = ({ filters, updateFilter, onClose, prefix }) => (
  <>
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Palette size={12} className="text-indigo-600" /> Theme
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={16} strokeWidth={2.5} />
        </button>
    </div>
    <div className="p-3 space-y-3">
        <FilterSlider 
            label="Hue" icon={<Palette size={8}/>} 
            value={filters.hue} max={360} 
            onChange={(val) => updateFilter('hue', val)} 
            bg="bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
            id={`${prefix}-hue`}
        />
        <FilterSlider 
            label="Sat" icon={<Droplet size={8}/>} 
            value={filters.saturation} max={200} 
            onChange={(val) => updateFilter('saturation', val)} 
            id={`${prefix}-sat`}
        />
        <FilterSlider 
            label="Bright" icon={<Sun size={8}/>} 
            value={filters.brightness} min={0} max={200} 
            onChange={(val) => updateFilter('brightness', val)} 
            id={`${prefix}-bright`}
        />
    </div>
    <div className="px-3 py-2 border-t border-slate-100">
        <span className="text-[9px] text-slate-500 flex items-center gap-1 justify-center">
            <CheckCircle2 size={10} className="text-emerald-500" /> Auto-saved
        </span>
    </div>
  </>
);

const FilterSlider = ({ label, icon, value, min=0, max, onChange, bg, id }) => (
    <div>
        <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <label htmlFor={id} className="flex items-center gap-1 cursor-pointer">{icon} {label}</label>
            <span className="text-indigo-600">{value}</span>
        </div>
        <input 
            type="range" 
            id={id}      
            name={id}    
            min={min} 
            max={max} 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className={`w-full h-1.5 rounded-full cursor-pointer ${bg || 'bg-slate-200 accent-indigo-600'}`}
        />
    </div>
);