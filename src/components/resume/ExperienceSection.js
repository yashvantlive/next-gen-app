import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function ExperienceSection({ data, onAdd, onUpdate, onDelete }) {
  
  const handleBulletChange = (expIndex, bulletIndex, val) => {
    const item = data[expIndex];
    const bullets = item.description ? item.description.split('\n') : [];
    bullets[bulletIndex] = val;
    onUpdate(item.id, { ...item, description: bullets.join('\n') });
  };

  const addBullet = (expIndex) => {
    const item = data[expIndex];
    const bullets = item.description ? item.description.split('\n') : [];
    bullets.push('');
    onUpdate(item.id, { ...item, description: bullets.join('\n') });
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const item = data[expIndex];
    const bullets = item.description ? item.description.split('\n') : [];
    bullets.splice(bulletIndex, 1);
    onUpdate(item.id, { ...item, description: bullets.join('\n') });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Experience (Optional)</h2>
          <p className="text-sm text-gray-500">Add internships, jobs, or work experience</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition-all shadow-sm"
        >
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {data.map((exp, index) => (
        <div key={exp.id} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4 group hover:border-blue-200 transition-colors">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role / Position</label>
              <input 
                type="text" 
                value={exp.role || ''} 
                onChange={(e) => onUpdate(exp.id, { ...exp, role: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company / Organization</label>
              <input 
                type="text" 
                value={exp.company || ''} 
                onChange={(e) => onUpdate(exp.id, { ...exp, company: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Tech Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Duration</label>
            <input 
              type="text" 
              value={exp.duration || ''} 
              onChange={(e) => onUpdate(exp.id, { ...exp, duration: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. June 2023 - Present"
            />
          </div>

          {/* Changed: Experience description now matches Projects bullet style */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Key Responsibilities</label>
               <button 
                 onClick={() => addBullet(index)}
                 className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
               >
                 <Plus size={12} /> Add Bullet
               </button>
            </div>
            
            <div className="space-y-2">
              {(exp.description ? exp.description.split('\n') : []).map((bullet, bIndex) => (
                <div key={bIndex} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                   <input 
                     type="text"
                     value={bullet}
                     onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                     className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                     placeholder="• Achievements, tasks, or impact..."
                   />
                   <button 
                     onClick={() => removeBullet(index, bIndex)}
                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     <X size={16} />
                   </button>
                </div>
              ))}
              {(!exp.description || exp.description.length === 0) && (
                 <button 
                   onClick={() => addBullet(index)}
                   className="w-full py-3 border-2 border-dashed border-gray-100 rounded-lg text-xs font-bold text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                 >
                   <Plus size={14} /> Add your first responsibility bullet
                 </button>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button 
                onClick={() => onDelete(exp.id)}
                className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
                <Trash2 size={14} /> Remove Position
            </button>
          </div>

        </div>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-10 bg-white border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-400 text-sm mb-4">No experience added yet.</p>
            <button 
                onClick={onAdd}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg text-sm hover:bg-gray-800 transition-all"
            >
                Add Experience
            </button>
        </div>
      )}
    </div>
  );
}