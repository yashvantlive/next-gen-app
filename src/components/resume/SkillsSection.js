import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SkillsSection({ data, onChange, metadata }) {
  const [newSkill, setNewSkill] = useState('');

  const categories = [
    { id: 'technical', label: 'Technical Skills' },
    { id: 'professional', label: 'Professional Skills' },
    { id: 'interests', label: 'Interests' }
  ];

  // Metadata se suggestions array nikalo
  const suggestions = metadata?.skills 
    ? (Array.isArray(metadata.skills) ? metadata.skills : Object.values(metadata.skills).flat())
    : [];

  const handleAdd = (category, val) => {
    const valueToAdd = val || newSkill;
    if (!valueToAdd.trim()) return;
    
    // Comma hatao agar user ne type kiya hai
    const cleanValue = valueToAdd.replace(/,/g, '').trim();
    if(!cleanValue) return;

    const currentList = data[category] || [];
    if (!currentList.includes(cleanValue)) {
      onChange(category, [...currentList, cleanValue]);
    }
    setNewSkill('');
  };

  const handleKeyDown = (e, category) => {
    // Enter OR Comma se add karo
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd(category);
    }
  };

  const handleRemove = (category, skill) => {
    const currentList = data[category] || [];
    onChange(category, currentList.filter(s => s !== skill));
  };

  const handleToggle = (category) => {
    onChange(`show${category}`, !data[`show${category}`]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Skills & Interests</h2>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            {/* Header with Toggle */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase">{cat.label}</h3>
              <label htmlFor={`show-${cat.id}`} className="relative inline-flex items-center cursor-pointer">
                <input 
                  id={`show-${cat.id}`}
                  name={`show-${cat.id}`}
                  type="checkbox" 
                  className="sr-only peer"
                  checked={data[`show${cat.id}`] !== false} 
                  onChange={() => handleToggle(cat.id)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Content */}
            {data[`show${cat.id}`] !== false && (
              <>
                <div className="relative mb-3">
                  <input
                    id={`skill-input-${cat.id}`}
                    name={`skill-input-${cat.id}`}
                    type="text"
                    placeholder={`Type ${cat.label} and press Comma (,) or Enter...`}
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => handleKeyDown(e, cat.id)}
                    onChange={(e) => setNewSkill(e.target.value)}
                    // Note: We use a generic state here, cleaner would be per-category state but this works for single focus
                  />
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(data[cat.id] || []).map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                      {skill}
                      <button onClick={() => handleRemove(cat.id, skill)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                    </span>
                  ))}
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 8).map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleAdd(cat.id, s)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}