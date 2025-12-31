"use client";
import React from "react";
import Link from "next/link";
import { Target, Trophy, ArrowRight, BookOpen, BarChart3, ChevronRight, Zap, Sparkles } from "lucide-react";
import { useExamProgress } from "../../hooks/useExamProgress";

export default function ExamEntryCard({ userId }) {
  const { activeExams, loading } = useExamProgress(userId);

  return (
    // --- ADVANCED UI: Light Theme, subtle gradient border/glow ---
    <div className="relative rounded-[18px] p-[1px] bg-gradient-to-br from-violet-200 via-indigo-200 to-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl h-full w-full overflow-hidden relative">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm relative overflow-hidden">
                    <Sparkles size={20} className="absolute opacity-50 animate-pulse"/>
                    <Trophy size={24} className="relative z-10"/>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800">Exam Prep Hub</h3>
                    <p className="text-sm font-medium text-slate-500">Resume your active exam progress.</p>
                </div>
            </div>
            
            {/* Entry Button */}
            <Link 
            href="/exams?from=profile" 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 shrink-0"
            >
                Enter Exam Mode <ArrowRight size={16} />
            </Link>
        </div>

        {/* Dynamic List */}
        <div className="divide-y divide-slate-50/80 relative z-10">
            {loading ? (
            <div className="p-8 flex justify-center">
                <div className="flex items-center gap-2 text-indigo-600 font-bold animate-pulse">
                    <Zap size={18} /> Loading progress...
                </div>
            </div>
            ) : activeExams.length > 0 ? (
                activeExams.map((exam) => (
                    <div key={exam.id} className="p-4 sm:px-6 hover:bg-indigo-50/30 transition-colors flex items-center justify-between group/item cursor-pointer">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Color Indicator */}
                            <div className={`w-1.5 h-12 rounded-full ${exam.color} shadow-sm`}></div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-black text-slate-700 text-base">{exam.name}</h4>
                                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                        <Zap size={10} fill="currentColor"/> Active
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm"><BookOpen size={12} className="text-indigo-400"/> {exam.covered} Topics Solved</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/exams?from=profile" className="p-2 text-slate-300 group-hover/item:text-indigo-600 group-hover/item:bg-white group-hover/item:shadow-sm rounded-full transition-all shrink-0">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                ))
            ) : (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                    <div className="p-3 bg-slate-50 rounded-full text-slate-300 mb-1"><Target size={24}/></div>
                    <p className="text-slate-500 font-medium">No active progress yet.</p>
                    <Link href="/exams?from=profile" className="px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm">START FIRST EXAM</Link>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}