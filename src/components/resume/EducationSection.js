import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function EducationSection({ data, onAdd, onUpdate, onDelete }) {
  const handleChange = (id, field, value) => {
    const item = data.find(i => i.id === id);
    onUpdate(id, { ...item, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
        <button onClick={onAdd} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <Plus size={16} /> Add Education
        </button>
      </div>

      <div className="space-y-6">
        {data.map((edu) => (
          <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
            <button 
              onClick={() => onDelete(edu.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">College / School Name</label>
                <input
                  type="text"
                  value={edu.institution || ''} 
                  onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                  placeholder="Ex: IIT Bombay / DPS School"
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">University / Board</label>
                <input
                  type="text"
                  value={edu.university || ''}
                  onChange={(e) => handleChange(edu.id, 'university', e.target.value)}
                  placeholder="Ex: Mumbai University / CBSE"
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Degree / Class</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                  placeholder="Ex: B.Tech in CSE / Class XII"
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Passing Year</label>
                  <input
                    type="text"
                    value={edu.year || ''}
                    onChange={(e) => handleChange(edu.id, 'year', e.target.value)}
                    placeholder="Ex: 2024"
                    className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CGPA / Percentage</label>
                  <input
                    type="text"
                    value={edu.cgpa || ''}
                    onChange={(e) => handleChange(edu.id, 'cgpa', e.target.value)}
                    placeholder="Ex: 9.5 / 85%"
                    className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}