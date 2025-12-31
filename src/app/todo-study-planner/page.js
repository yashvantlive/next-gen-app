"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Check, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Layout, 
  Calendar, 
  Clock, 
  CloudOff, 
  BookOpen, 
  Heart,
  Shield,
  Sparkles,
  ChevronLeft
} from "lucide-react";

export default function TodoLandingPage() {
  // --- EXISTING LOGIC (DO NOT TOUCH) ---
  const defaultTasks = [
    { id: 1, text: "Check syllabus Module 1", completed: true, category: 'academics' },
    { id: 2, text: "Solve 2022 PYQ Physics", completed: false, category: 'academics' }
  ];

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== "undefined" ? localStorage.getItem("demo_tasks") : null);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(defaultTasks);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      (typeof window !== "undefined" && localStorage.setItem("demo_tasks", JSON.stringify(tasks)));
    }
  }, [tasks, isLoaded]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false, category: 'life' }]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  // -------------------------------------

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      
      {/* --- 1. HEADER (EXACT MATCH WITH HOME) --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-violet-200 group-hover:scale-105 transition-transform">
              Y
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">YOU LEARN</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-violet-700 font-medium transition-colors"
            >
              <ChevronLeft size={18} /> Back Home
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              Login to Sync
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        
        {/* --- 2. HERO SECTION --- */}
        <section className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-6 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles size={12} /> Calm Productivity
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 mb-6 leading-tight">
            A daily plan that <br/>
            <span className="text-violet-600">doesn’t overwhelm you.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-xl mx-auto mb-8">
            Small tasks. Clear priorities. Linked to your engineering syllabus. <br className="hidden sm:block"/>
            <span className="text-slate-400 text-base">Try the demo below (it saves automatically!).</span>
          </p>
        </section>

        {/* --- 3. DEMO APP CONTAINER --- */}
        <section className="max-w-md mx-auto px-4 mb-12">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            
            {/* App Header */}
            <div className="bg-white border-b border-slate-50 p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Focus</div>
                  <h2 className="text-xl font-bold text-slate-800">My Tasks</h2>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-bold text-violet-600">{progress}%</span>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Done</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Motivation Popup */}
              {progress >= 70 && (
                <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500 shrink-0">
                    <Heart size={14} fill="currentColor" />
                  </div>
                  <p className="text-xs text-violet-800 font-bold">"You are crushing it! Keep going!" 🚀</p>
                </div>
              )}
            </div>
            
            {/* Task List Area */}
            <div className="p-6 min-h-[300px] bg-slate-50/50">
              <div className="space-y-3 mb-6">
                {tasks.length === 0 ? (
                   <div className="text-center py-12 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-2">
                          <Check size={20}/>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No tasks yet.</p>
                      <p className="text-slate-300 text-xs">Add a small step below.</p>
                   </div>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="group bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-violet-300 hover:shadow-md transition-all cursor-pointer" onClick={() => toggleTask(task.id)}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.completed ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300 group-hover:border-violet-400"}`}>
                          {task.completed && <Check size={12} strokeWidth={3}/>}
                        </div>
                        <span className={`text-sm font-medium truncate transition-colors ${task.completed ? "line-through text-slate-400" : "text-slate-700 group-hover:text-slate-900"}`}>
                          {task.text}
                        </span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="text-slate-300 hover:text-rose-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <form onSubmit={addTask} className="flex gap-2 relative z-10">
                <input id="study-task-input" name="study-task-input"
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What needs to be done?" 
                  className="flex-1 min-w-0 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm shadow-sm transition-all"
                />
                <button type="submit" className="shrink-0 w-11 h-11 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-transform active:scale-95">
                  <Plus size={20}/>
                </button>
              </form>
            </div>
            
            {/* Footer Mock */}
            <div className="bg-white border-t border-slate-100 p-4">
               <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked to Syllabus</p>
                  <CloudOff size={12} className="text-slate-300"/>
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="shrink-0 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-500 flex items-center gap-2">
                     <BookOpen size={12} className="text-slate-400"/> Physics: Module 1
                  </div>
                  <div className="shrink-0 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-500 flex items-center gap-2">
                     <BookOpen size={12} className="text-slate-400"/> Math: Calculus
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* --- 4. NEW ADDITIVE SECTIONS (Soft Trust) --- */}
        <section className="max-w-md mx-auto px-4 space-y-4 mb-20">
            {/* Progress Reflection */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                    <Clock size={18} />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-slate-800">You’re building consistency.</h3>
                    <p className="text-xs text-slate-500">Small wins compound over time.</p>
                 </div>
              </div>
            </div>

            {/* Soft Trust */}
           <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 p-6 text-center relative overflow-hidden">
              <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm text-violet-500 mb-3">
                     <Shield size={14} fill="currentColor"/>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Studying every day is hard.</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-xs mx-auto">
                     YOU LEARN is here to make it quieter. No ads. No noise. Just your plan.
                  </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
           </div>
        </section>

        {/* --- 5. VALUE PROPS (Styled like Home) --- */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <Layout className="text-violet-500 mb-3" size={24}/>
              <h3 className="font-bold text-slate-900 mb-2">Syllabus Linked</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Tasks connect directly to your engineering modules. No manual entry needed.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="text-violet-500 mb-3" size={24}/>
              <h3 className="font-bold text-slate-900 mb-2">No Guilt</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Missed a day? The planner adjusts automatically without shaming you.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <Clock className="text-violet-500 mb-3" size={24}/>
              <h3 className="font-bold text-slate-900 mb-2">Quick Capture</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Capture tasks in seconds. Keep your brain free for actual studying.</p>
            </div>
          </div>
        </section>

        {/* --- 6. FINAL PUSH (EXACT HOME PAGE STYLE) --- */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <div className="relative bg-white rounded-3xl p-10 sm:p-14 shadow-2xl shadow-violet-200 border border-slate-100 overflow-hidden">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Start when you’re ready. <br/>We’ll be here.
              </h2>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                The planner is free. Use it to check a single syllabus topic, or organize your whole semester. It's up to you.
              </p>
              
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-slate-200"
              >
                Start Planning <ArrowRight size={18} />
              </Link>
              
              <p className="text-xs font-semibold text-violet-600 mt-4 tracking-wide">
                TAKES 30 SECONDS • NO EMAIL REQUIRED TO EXPLORE
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> Free forever</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> No credit card</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> Works offline</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- 7. FOOTER (EXACT MATCH WITH HOME) --- */}
      <footer className="bg-white border-t border-slate-200 py-12 pb-32">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          
          {/* LEFT: Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">Y</div>
              <span className="font-bold text-slate-900">YOU LEARN</span>
            </div>
            <div className="text-slate-400 text-xs">
              © {new Date().getFullYear()} YOU LEARN
            </div>
          </div>
          
          {/* RIGHT: Links */}
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link href="/about" className="hover:text-violet-700 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-violet-700 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-violet-700 transition-colors">Privacy</Link>
          </div>
          
        </div>
      </footer>

    </div>
  );
}