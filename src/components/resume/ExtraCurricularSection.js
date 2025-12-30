import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ExtraCurricularSection({ data, onChange }) {
  // data is array of objects { id, heading, description }
  
  const handleAdd = () => {
    if ((data || []).length >= 3) return; // Limit to 3 rows
    const newItem = { id: Date.now(), heading: '', description: '' };
    onChange([...(data || []), newItem]);
  };

  const handleUpdate = (id, field, value) => {
    const updated = data.map(item => item.id === id ? { ...item, [field]: value } : item);
    onChange(updated);
  };

  const handleDelete = (id) => {
    onChange(data.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Extra Curricular / Achievements</h2>
        {(data || []).length < 3 && (
          <button onClick={handleAdd} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={16} /> Add Row
          </button>
        )}
      </div>

      <div className="space-y-4">
        {(data || []).map((item) => (
          <div key={item.id} className="flex gap-4 items-start p-3 bg-gray-50 rounded-lg border border-gray-100 group">
            {/* Small Rectangle (Heading) */}
            <div className="w-1/3">
              <input
                id={`extracurricular-heading-${item.id}`}
                name={`extracurricular-heading-${item.id}`}
                value={item.heading}
                onChange={(e) => handleUpdate(item.id, 'heading', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Large Rectangle (Description) */}
            <div className="w-2/3 relative">
              <textarea                id={`extracurricular-description-${item.id}`}
                name={`extracurricular-description-${item.id}`}                placeholder="Short description..."
                value={item.description}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 p-1 rounded-full shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        {(data || []).length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg text-gray-400 text-sm">
            No activities added. Click "Add Row".
          </div>
        )}
      </div>
    </div>
  );
}