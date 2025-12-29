"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Target, Shield } from "lucide-react";

const POPULAR_EXAMS = [
  "GATE", "ESE (IES)", "CAT", "ISRO", "BARC", "DRDO", "SSC JE", "RRB JE", 
  "PSUs (NTPC, ONGC)", "GMAT", "GRE", "Civil Services (UPSC)", "State PSC (AE/JE)", 
  "Bank PO (SBI/IBPS)", "CGL (SSC)", "NIC Scientist", "NIELIT", "C-DAC", "TOEFL", "IELTS"
];

const YEARS = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);

export default function EditExamModal({ isOpen, onClose, currentGoals, onSave }) {
  const [activeTab, setActiveTab] = useState("primary");
  const [formData, setFormData] = useState({
    primary: { name: "", year: new Date().getFullYear() + 1, notes: "", isCustom: false },
    secondary: { name: "", year: new Date().getFullYear() + 1, notes: "", isCustom: false }
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && currentGoals) {
      const initData = (type) => {
        const goal = currentGoals[type];
        const name = goal?.name || "";
        // Check if it's a real goal or an empty state marker
        const isReal = name && name !== "Set Goal" && name !== "Set Backup";
        const isPopular = POPULAR_EXAMS.includes(name);
        return {
          name: isReal ? name : "",
          year: goal?.year || new Date().getFullYear() + 1,
          notes: goal?.notes || "",
          isCustom: isReal && !isPopular
        };
      };

      setFormData({
        primary: initData("primary"),
        secondary: initData("secondary")
      });
      setActiveTab("primary"); // Reset to primary tab on open
    }
  }, [isOpen, currentGoals]);

  const handleChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare data for saving (remove temporary isCustom flag)
    const finalData = {
        primary: { name: formData.primary.name, year: formData.primary.year, notes: formData.primary.notes },
        secondary: { name: formData.secondary.name, year: formData.secondary.year, notes: formData.secondary.notes }
    };
    onSave(finalData);
    onClose();
  };

  if (!isOpen) return null;

  const currentForm = formData[activeTab];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header & Tabs */}
        <div className="bg-slate-50 border-b border-slate-100">
            <div className="px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Design Your Future</h3>
                <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500"/></button>
            </div>
            
            {/* Tabs */}
            <div className="flex px-6 gap-4">
                <button 
                    onClick={() => setActiveTab("primary")}
                    className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${activeTab === 'primary' ? 'border-violet-600 text-violet-700 font-bold' : 'border-transparent text-slate-500 font-medium hover:text-slate-700'}`}
                >
                    <Target size={16}/> Primary Target
                </button>
                <button 
                    onClick={() => setActiveTab("secondary")}
                    className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${activeTab === 'secondary' ? 'border-blue-600 text-blue-700 font-bold' : 'border-transparent text-slate-500 font-medium hover:text-slate-700'}`}
                >
                    <Shield size={16}/> Backup Plan
                </button>
            </div>
        </div>

        {/* Form Content based on Active Tab */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                {activeTab === 'primary' ? "Main Goal Exam" : "Backup Exam"}
            </label>
            {!currentForm.isCustom ? (
              <select 
                value={currentForm.name} 
                onChange={(e) => e.target.value === "OTHER" ? handleChange(activeTab, 'isCustom', true) : handleChange(activeTab, 'name', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-slate-400"
              >
                <option value="">Select Exam...</option>
                {POPULAR_EXAMS.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                <option value="OTHER">+ Other (Type Manually)</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={currentForm.name} 
                  onChange={(e) => handleChange(activeTab, 'name', e.target.value)}
                  placeholder="Enter Exam Name..."
                  className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-violet-500"
                  autoFocus
                />
                <button type="button" onClick={() => handleChange(activeTab, 'isCustom', false)} className="px-3 text-xs font-bold text-slate-500 hover:text-slate-800">Cancel</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Year</label>
            <select 
              value={currentForm.year} 
              onChange={(e) => handleChange(activeTab, 'year', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Strategy / Motivation Notes</label>
            <textarea 
              rows={4}
              value={currentForm.notes} 
              onChange={(e) => handleChange(activeTab, 'notes', e.target.value)}
              // --- UPDATED PLACEHOLDER HERE ---
              placeholder="e.g. Targeting Rank Under 100. Focus on weak subjects first."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 resize-none placeholder:text-slate-400"
            />
          </div>

        </form>
        
        {/* Footer Action */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button onClick={handleSubmit} type="button" className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-200 active:scale-95">
                <Save size={18} /> Save All Targets
            </button>
        </div>
      </div>
    </div>
  );
}