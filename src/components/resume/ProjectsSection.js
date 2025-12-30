import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function ProjectsSection({ data, onAdd, onUpdate, onDelete }) {
  
  const handleChange = (id, field, value) => {
    const item = data.find(i => i.id === id);
    onUpdate(id, { ...item, [field]: value });
  };

  const handleTechStack = (id, value) => {
    const item = data.find(i => i.id === id);
    const stack = value.split(',').map(s => s.trim());
    onUpdate(id, { ...item, techStack: stack });
  };

  // --- BULLET POINTS LOGIC (Simplified: Single Text Block) ---

  const addPoint = (projectId) => {
    const project = data.find(p => p.id === projectId);
    const currentPoints = project.points || [];
    const newPoint = { id: Date.now(), text: '' }; // No Heading, just Text
    onUpdate(projectId, { ...project, points: [...currentPoints, newPoint] });
  };

  const updatePoint = (projectId, pointId, val) => {
    const project = data.find(p => p.id === projectId);
    const updatedPoints = (project.points || []).map(p => 
      p.id === pointId ? { ...p, text: val } : p
    );
    onUpdate(projectId, { ...project, points: updatedPoints });
  };

  const deletePoint = (projectId, pointId) => {
    const project = data.find(p => p.id === projectId);
    const updatedPoints = (project.points || []).filter(p => p.id !== pointId);
    onUpdate(projectId, { ...project, points: updatedPoints });
  };

  // Default: Give 2 empty points if none exist
  const ensurePoints = (project) => {
    if (!project.points || project.points.length === 0) {
        const initialPoints = [
            { id: Date.now(), text: '' },
            { id: Date.now() + 1, text: '' },
        ];
        onUpdate(project.id, { ...project, points: initialPoints });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Projects</h2>
        <button onClick={onAdd} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="space-y-8">
        {data.map((proj) => {
            const points = proj.points || [];

            return (
              <div key={proj.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 relative group transition-all hover:shadow-md">
                
                {/* Delete Project */}
                <button 
                  onClick={() => onDelete(proj.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>

                {/* Project Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                  <div>
                    <label htmlFor={`project-title-${proj.id}`} className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Title</label>
                    <input
                      id={`project-title-${proj.id}`}
                      name={`project-title-${proj.id}`}
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleChange(proj.id, 'title', e.target.value)}
                      placeholder="e.g. E-Commerce App"
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`project-link-${proj.id}`} className="block text-xs font-bold text-gray-500 uppercase mb-1">Link / GitHub</label>
                    <input
                      id={`project-link-${proj.id}`}
                      name={`project-link-${proj.id}`}
                      type="text"
                      value={proj.link}
                      onChange={(e) => handleChange(proj.id, 'link', e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm text-blue-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor={`project-tech-${proj.id}`} className="block text-xs font-bold text-gray-500 uppercase mb-1">Tech Stack</label>
                    <input
                      id={`project-tech-${proj.id}`}
                      name={`project-tech-${proj.id}`}
                      type="text"
                      value={proj.techStack ? proj.techStack.join(', ') : ''}
                      onChange={(e) => handleTechStack(proj.id, e.target.value)}
                      placeholder="React, Node.js, MongoDB..."
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Bullet Points (Single Column) */}
                <div className="mt-4">
                    <div className="flex justify-between items-end mb-2">
                        <label htmlFor={points.length ? `project-point-${proj.id}-${points[0].id}` : undefined} className="block text-xs font-bold text-gray-500 uppercase">Key Features / Details</label>
                        <button 
                            onClick={() => addPoint(proj.id)}
                            className="text-xs flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                        >
                            <Plus size={14} /> Add Bullet
                        </button>
                    </div>

                    <div className="space-y-2">
                        {points.length === 0 && (
                             <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                                No details added. <button onClick={() => ensurePoints(proj)} className="text-blue-500 underline">Add default points</button>
                             </div>
                        )}

                        {points.map((pt) => (
                            <div key={pt.id} className="relative group/point">
                                <textarea
                                    id={`project-point-${proj.id}-${pt.id}`}
                                    name={`project-point-${proj.id}-${pt.id}`}
                                    placeholder="• Describe a key feature or result..."
                                    value={pt.text || ''}
                                    onChange={(e) => updatePoint(proj.id, pt.id, e.target.value)}
                                    rows={1}
                                    className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 resize-none overflow-hidden bg-white"
                                    style={{ minHeight: '38px' }}
                                    onInput={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = e.target.scrollHeight + "px";
                                    }}
                                />
                                {/* Delete Point */}
                                <button 
                                    onClick={() => deletePoint(proj.id, pt.id)}
                                    className="absolute top-2 right-2 bg-white text-gray-300 hover:text-red-500 border border-gray-100 rounded-full p-1 opacity-0 group-hover/point:opacity-100 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

              </div>
            );
        })}
      </div>
    </div>
  );
}