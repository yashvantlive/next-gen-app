import React from 'react';
import Link from 'next/link';
import { CheckSquare, Plus, Check, BookOpen, Calendar } from "lucide-react";

export default function TodayTasks({ tasks, total, done, percent, theme, onToggle }) {
  return (
    <div className={`rounded-[2rem] border shadow-sm overflow-hidden flex flex-col min-h-[400px] transition-all duration-500 ${theme.card_bg} ${theme.card_border}`}>
      <div className={`px-6 py-5 border-b flex justify-between items-center backdrop-blur-md ${theme.border}`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${theme.text_main}`}>
            <CheckSquare className={theme.radar_color} size={20}/> Today's Plan
          </h3>
          <p className={`text-xs mt-1 font-medium ${theme.text_sub}`}>
            {done} of {total} tasks completed
          </p>
        </div>
        <Link href="/todo">
          <button className={`p-2.5 rounded-xl transition-all shadow-sm ${theme.soft_button}`}>
            <Plus size={20}/>
          </button>
        </Link>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-slate-100">
        <div className={`h-full bg-gradient-to-r ${theme.progress_bar} transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
      </div>

      {/* Task List */}
      <div className={`flex-1 p-4 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-slate-200 ${theme.card_bg}`}>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => onToggle(task)}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${task.status === 'done' ? 'opacity-60 bg-slate-50' : 'hover:shadow-md'} ${theme.card_border}`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-300 ${task.status === 'done' ? `${theme.radar_bg} border-transparent ${theme.radar_color}` : `border-slate-300 ${theme.border}`}`}>
                  {task.status === 'done' && <Check size={14} strokeWidth={4}/>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate transition-colors ${task.status === 'done' ? 'text-slate-500 line-through decoration-slate-400' : theme.text_main}`}>{task.title}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-bold uppercase tracking-wider">{task.aspect}</span>
                    {task.linkedFrom === 'syllabus' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${theme.radar_bg} ${theme.radar_color} ${theme.border}`}><BookOpen size={10}/> ACADEMIC</span>
                    )}
                  </div>
                </div>
                
                <div className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  {task.effort}m
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2 border border-slate-100">
              <Calendar size={32} className="text-slate-300"/>
            </div>
            <div>
              <p className="text-slate-600 font-bold">No directives pending.</p>
              <p className="text-xs text-slate-400 mt-1">System is waiting for input.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}