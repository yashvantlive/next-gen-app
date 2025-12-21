"use client";
import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, db } from "@/lib/firebaseClient";
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { Clock, Tag, Calendar, ChevronLeft, ChevronRight, Plus, RefreshCw, Trash2, Check, Lightbulb, X, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TodoPage() {
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }

      const p = await getUserProfile(u.uid);
      if (!p) {
        router.push("/onboarding");
        return;
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // ---- Todo state ----
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  // Modal / form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [aspect, setAspect] = useState("academics");
  const [effort, setEffort] = useState(15); // minutes
  const [priority, setPriority] = useState('low'); // 'low' | 'high'
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split("T")[0]);
  
  // Currently selected date filter (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Keep a ref to unsubscribe
  const unsubRef = useRef(null);

  useEffect(() => {
    // subscribe to auth and load profile/user
    const unsub = onAuthChange(async (u) => {
      if (!u) {
        setUser(null);
        setProfile(null);
        setTodos([]);
        return;
      }
      setUser(u);
      try {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } catch (err) {
        console.error('Profile load error:', err);
      }
    });

    unsubRef.current = unsub;
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoadingTodos(true);
    // Realtime listener so newly added tasks show up immediately
    const colRef = collection(doc(db, 'todo', user.uid), 'items');
    const q = query(colRef, orderBy('dueDate'));

    const unsub = onSnapshot(q, (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by priority (high first), then lower effort first, then dueDate, then createdAt
      sortTodos(data);
      setTodos(data);
      setLoadingTodos(false);
    }, (err) => {
      console.error('Realtime todos error:', err);
      setLoadingTodos(false);
    });

    return () => unsub();
  }, [user]);

  async function loadTodos() {
    setLoadingTodos(true);
    try {
      const userTodosCol = collection(doc(db, 'todo', user.uid), 'items');
      const q = query(userTodosCol, orderBy('dueDate'));
      const snap = await getDocs(q);
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      sortTodos(data);
      setTodos(data);
    } catch (err) {
      console.error('Error loading todos:', err);
    } finally {
      setLoadingTodos(false);
    }
  }

  async function handleAddTask() {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      const userTodosCol = collection(doc(db, 'todo', user.uid), 'items');
      const [y, m, d] = dueDate.split('-').map(Number);
      const dueDateObj = new Date(y, m - 1, d, 23, 59, 59, 999);

      const task = {
        uid: user.uid,
        title: title.trim(),
        aspect,
        effort: Number(effort),
        priority,
        dueDate: Timestamp.fromDate(dueDateObj),
        status: 'active',
        createdAt: Timestamp.now(),
        completedAt: null
      };

      await addDoc(userTodosCol, task);
      setTitle('');
      setAspect('academics');
      setEffort(15);
      setPriority('low');
      setDueDate(new Date().toISOString().split('T')[0]);
      setIsAddOpen(false);
      // No need to manually loadTodos because onSnapshot handles it
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Could not save task.');
    }
  }

  const [animatingTaskId, setAnimatingTaskId] = useState(null);

  async function toggleTask(id) {
    const t = todos.find(x => x.id === id);
    if (!t) return;

    const newStatus = t.status === 'active' ? 'done' : 'active';
    const updateData = {
      status: newStatus,
      completedAt: newStatus === 'done' ? Timestamp.now() : null
    };

    setAnimatingTaskId(id);
    setTodos(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, status: newStatus, completedAt: updateData.completedAt } : item);
      sortTodos(updated);
      return updated;
    });

    try {
      const taskRef = doc(db, 'todo', user.uid, 'items', id);
      await updateDoc(taskRef, updateData);
    } catch (err) {
      console.error('Error toggling task:', err);
    }

    setTimeout(() => setAnimatingTaskId(null), 350);
  }

  async function removeTask(id) {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteDoc(doc(db, 'todo', user.uid, 'items', id));
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  function changeSelectedDate(offset) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  }

  function formatDateDisplay(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' });
  }

  function sortTodos(data) {
    data.sort((a, b) => {
      const sa = a.status === 'done' ? 1 : 0;
      const sb = b.status === 'done' ? 1 : 0;
      if (sa !== sb) return sa - sb;

      const pa = a.priority === 'high' ? 1 : 0;
      const pb = b.priority === 'high' ? 1 : 0;
      if (pa !== pb) return pb - pa; 

      const ea = Number(a.effort || 0);
      const eb = Number(b.effort || 0);
      if (ea !== eb) return ea - eb; 

      const da = a.dueDate?.toDate ? a.dueDate.toDate().getTime() : (a.dueDate?.seconds ? a.dueDate.seconds * 1000 : 0);
      const dbt = b.dueDate?.toDate ? b.dueDate.toDate().getTime() : (b.dueDate?.seconds ? b.dueDate.seconds * 1000 : 0);
      if (da !== dbt) return da - dbt;

      const ca = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const cb = b.createdAt?.toDate ? b.createdAt?.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return ca - cb;
    });
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading workspace...</div>;

  const filteredTodos = todos.filter(t => {
    if (!t.dueDate) return false;
    const d = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate.seconds * 1000);
    const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return s === selectedDate;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Board</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your day, one task at a time.</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button
              onClick={loadTodos}
              className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
              title="Refresh Tasks"
            >
              <RefreshCw size={18} />
            </button>
            <button
              className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all shadow-md shadow-violet-200 hover:shadow-lg flex items-center gap-2"
              onClick={() => { setDueDate(selectedDate); setEffort(15); setPriority('low'); setIsAddOpen(true); }}
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* --- CONTROLS BAR --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          
          {/* Date Navigator */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <button 
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => changeSelectedDate(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 text-center px-2 min-w-[140px] relative group">
               {/* Hidden Date Input Overlay */}
               <input 
                 type="date" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 value={selectedDate} 
                 onChange={e => setSelectedDate(e.target.value)} 
               />
               <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-violet-600 transition-colors">
                  <Calendar size={16} />
                  {formatDateDisplay(selectedDate)}
               </div>
            </div>

            <button 
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => changeSelectedDate(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* AI Suggestion Card */}
          <div className="flex-1 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-sm shrink-0">
                <Lightbulb size={16} />
             </div>
             <div>
                <p className="text-xs font-bold text-violet-900 uppercase tracking-wide">AI Insight</p>
                <p className="text-sm text-slate-700 font-medium">Focus on high-priority items first to keep your streak.</p>
             </div>
          </div>
        </div>

        {/* --- TASK LIST SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-bold text-slate-800">Tasks</h3>
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{filteredTodos.length} items</span>
          </div>

          {loadingTodos ? (
             // Skeleton Loader
             <div className="space-y-3">
               {[1,2,3].map(i => (
                 <div key={i} className="h-20 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
               ))}
             </div>
          ) : filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                 <Filter size={24} />
               </div>
               <p className="text-slate-500 font-medium">No tasks for this day.</p>
               <button 
                 onClick={() => setIsAddOpen(true)}
                 className="mt-2 text-sm text-violet-600 hover:underline font-medium"
               >
                 Create a new task
               </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map(task => (
                <div 
                  key={task.id} 
                  className={`
                    group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ease-in-out
                    ${task.status === 'done' 
                      ? 'bg-slate-50 border-slate-100 opacity-60' 
                      : 'bg-white border-slate-200 hover:border-violet-200 hover:shadow-md'
                    }
                    ${animatingTaskId === task.id ? 'translate-y-2 opacity-0' : ''}
                  `}
                >
                  {/* Custom Checkbox */}
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`
                      shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${task.status === 'done' 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 bg-transparent hover:border-violet-500'
                      }
                    `}
                  >
                    {task.status === 'done' && <Check size={14} strokeWidth={3} />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-semibold truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {/* Tags */}
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Clock size={12} /> {task.effort}m
                      </span>
                      
                      <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                        {task.aspect}
                      </span>

                      {task.priority === 'high' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          <Tag size={12} /> High Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Button (Visible on Hover/Focus) */}
                  <button 
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    onClick={() => removeTask(task.id)}
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- ADD TASK MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-900">Add New Task</h3>
               <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Task Title</label>
                <input 
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                  placeholder="e.g. Complete Physics Chapter 3"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              {/* Grid Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 appearance-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                        value={aspect} 
                        onChange={e => setAspect(e.target.value)}
                      >
                        <option value="academics">Academics</option>
                        <option value="skill">Skill Development</option>
                        <option value="health">Health & Fitness</option>
                        <option value="life">Life & Chores</option>
                        <option value="growth">Personal Growth</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-3 text-slate-400 rotate-90 pointer-events-none" size={16} />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Priority</label>
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all ${priority === 'low' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => setPriority('low')}
                      >
                        Low
                      </button>
                      <button 
                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all ${priority === 'high' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600'}`}
                        onClick={() => setPriority('high')}
                      >
                        High
                      </button>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Est. Effort</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 appearance-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                        value={effort} 
                        onChange={e => setEffort(Number(e.target.value))}
                      >
                        <option value={15}>15 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>1 Hour</option>
                        <option value={90}>1.5 Hours</option>
                        <option value={120}>2 Hours</option>
                      </select>
                      <Clock className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16} />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Due Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                      value={dueDate} 
                      onChange={e => setDueDate(e.target.value)} 
                    />
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTask}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}