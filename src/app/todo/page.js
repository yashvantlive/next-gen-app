"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { onAuthChange, getUserProfile, db } from "../../lib/firebaseClient";
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  query, where, writeBatch, onSnapshot, getDocs, Timestamp, setDoc, limit 
} from "firebase/firestore";
import { 
  Clock, Tag, Calendar, ChevronLeft, ChevronRight, Plus, 
  RefreshCw, Trash2, Check, Lightbulb, X, Heart, 
  BookOpen, ChevronDown, ChevronUp, Target, Brain, ArrowUpRight, Star, Share2, User,
  GraduationCap, Youtube, FileText, Search // Added Icons
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 

// ✅ Import Share Component
import ShareButton from '../../components/ShareButton';

// --- 🛠️ UTILITY: Full Form Mapper ---
const FULL_FORMS = {
  "ME": "Mechanical Engineering",
  "CSE": "Computer Science & Eng.",
  "ECE": "Electronics & Comm. Eng.",
  "EEE": "Electrical & Electronics Eng.",
  "CE": "Civil Engineering",
  "IT": "Information Technology",
  "AKU": "Aryabhatta Knowledge University"
};

const getFullForm = (short) => FULL_FORMS[short] || short;

// --- 🛠️ UTILITY: Deterministic ID Generators ---
const generateId = (str) => {
  if (!str) return "unknown";
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// --- 🛠️ UTILITY: Local Date String ---
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TodoPage() {
  const router = useRouter();
  const hydratedRef = useRef(false);

  // --- 📦 STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Core Data
  const [todos, setTodos] = useState([]);
  const [syllabus, setSyllabus] = useState([]); 
  const [progressMap, setProgressMap] = useState({}); 
  const [reviews, setReviews] = useState([]); 
  
  // UI State
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false); 
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false); 
  
  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    confirmText: "Confirm", 
    cancelText: "Cancel", 
    onConfirm: null 
  });
  
  // Form State
  const [newTask, setNewTask] = useState({
    title: "",
    aspect: "academics",
    effort: 15,
    priority: "low",
    subjectId: null,
    topicId: null,
    time: "09:00"
  });

  const [reviewForm, setReviewForm] = useState({ rating: 5, message: "" });
  
  // Date Filter (Initialized with Local Date)
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  // --- 🔄 STEP 1: AUTHENTICATION & PROFILE LOAD ---
  useEffect(() => {
    hydratedRef.current = true;
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push("/auth/login"); return; }
      setUser(u);

      try {
        const p = await getUserProfile(u.uid);
        if (!p?.branchId || !p?.semester) { 
          router.push("/onboarding"); 
          return; 
        }
        setProfile(p);
      } catch (err) {
        console.error("CRITICAL: User Profile Load Failed", err);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // --- 🔄 STEP 2: SYLLABUS & REVIEWS FETCHING ---
  useEffect(() => {
    if (!profile?.universityId || !profile?.branchId) return;

    const fetchData = async () => {
      try {
        // 1. Fetch Syllabus
        const qSyllabus = query(
          collection(db, 'syllabi'),
          where("universityId", "==", profile.universityId),
          where("branchId", "==", profile.branchId),
          where("semester", "==", Number(profile.semester))
        );
        const snapSyllabus = await getDocs(qSyllabus);
        
        if (!snapSyllabus.empty) {
          const parsedSubjects = [];
          snapSyllabus.docs.forEach(doc => {
            const data = doc.data();
            // Get resources attached to this syllabus document
            const resources = data.topicResources || [];

            if (Array.isArray(data.subjects)) {
               data.subjects.forEach(subj => parsedSubjects.push(parseSubjectData(subj, doc.id, resources)));
            } else if (data.subjectName) {
               parsedSubjects.push(parseSubjectData(data, doc.id, resources));
            }
          });
          parsedSubjects.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
          setSyllabus(parsedSubjects);
        }

        // 2. Fetch Reviews
        const qReviews = query(
          collection(db, 'testimonials'), 
          where("approved", "==", true), 
          limit(10)
        );
        const snapReviews = await getDocs(qReviews);
        const fetchedReviews = snapReviews.docs.map(d => ({ id: d.id, ...d.data() }));
        setReviews(fetchedReviews);

      } catch (err) {
        console.error("Data Load Error:", err);
      }
    };

    fetchData();
  }, [profile]);

  // Helper: Parser logic (Updated to include resources)
  const parseSubjectData = (rawSubj, docId, resources = []) => {
    const rawContent = rawSubj.content || (Array.isArray(rawSubj.units) ? rawSubj.units.join('\n') : "");
    const topics = rawContent.split(/[\n]/).flatMap(line => line.split(/[,]/)) 
      .map(t => t.replace(/(Module|Unit)\s*\d+[:\.]?/gi, '').replace(/[()]/g, '').trim())
      .filter(t => t.length > 2)
      .map(t => ({ topicId: generateId(t), topicName: t }));

    return {
      subjectId: rawSubj.subjectId || generateId(rawSubj.subjectName),
      subjectName: rawSubj.subjectName,
      topics: topics,
      resources: resources // Pass resources array
    };
  };

  // --- 🔄 STEP 3: REALTIME SYNC ---
  useEffect(() => {
    if (!user) return;

    const todoQ = query(collection(db, 'todos'), where("userId", "==", user.uid));
    const unsubTodos = onSnapshot(todoQ, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTodos(data);
    }, (err) => { if (err.code !== 'permission-denied') console.error("Todo Sync Error", err); });

    const progressRef = collection(db, 'academic_progress', user.uid, 'subjects');
    const unsubProgress = onSnapshot(progressRef, (snap) => {
      const map = {};
      snap.docs.forEach(doc => { map[doc.id] = doc.data(); });
      setProgressMap(map);
    }, (err) => { if (err.code !== 'permission-denied') console.error("Progress Sync Error", err); });

    return () => { unsubTodos(); unsubProgress(); };
  }, [user]);

  // --- ⚡ ACTIONS ---

  const openAddTask = (prefillData = {}) => {
    setNewTask({
      title: prefillData.title || "",
      aspect: prefillData.aspect || "academics",
      effort: 15,
      priority: "low",
      subjectId: prefillData.subjectId || null,
      topicId: prefillData.topicId || null,
      time: "09:00"
    });
    setIsAddOpen(true);
  };

  const saveTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const [hours, minutes] = newTask.time ? newTask.time.split(':').map(Number) : [9, 0];
      const due = new Date(y, m - 1, d);
      due.setHours(hours, minutes, 0, 0);

      const payload = {
        userId: user.uid,
        title: newTask.title,
        aspect: newTask.aspect,
        effort: Number(newTask.effort),
        priority: newTask.priority,
        subjectId: newTask.subjectId,
        topicId: newTask.topicId,
        dueDate: Timestamp.fromDate(due),
        status: 'active',
        createdAt: Timestamp.now(),
        linkedFrom: newTask.topicId ? 'syllabus' : 'manual'
      };

      await addDoc(collection(db, 'todos'), payload);
      setIsAddOpen(false);
    } catch (err) { console.error("Save Failed:", err); }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'active' ? 'done' : 'active';
    const isCompleted = newStatus === 'done';
    const batch = writeBatch(db);

    const todoRef = doc(db, 'todos', task.id);
    batch.update(todoRef, { status: newStatus, completedAt: isCompleted ? Timestamp.now() : null });

    if (task.subjectId && task.topicId) {
      const progressRef = doc(db, 'academic_progress', user.uid, 'subjects', task.subjectId);
      batch.set(progressRef, { topics: { [task.topicId]: isCompleted }, lastUpdated: Timestamp.now() }, { merge: true });
    }
    await batch.commit();
  };

  const handleAddTopicClick = (subjectId, subjectName, topicId, topicName, isDone) => {
    if (isDone) {
      setConfirmation({
        isOpen: true,
        title: "Topic Already Completed",
        message: "This topic is already marked as completed. Do you still want to add it as a task for practice?",
        confirmText: "Add Anyway", cancelText: "Cancel",
        onConfirm: () => { setConfirmation({ isOpen: false }); openAddTask({ title: topicName, aspect: subjectName, subjectId, topicId }); }
      });
      return;
    }
    openAddTask({ title: topicName, aspect: subjectName, subjectId, topicId });
  };

  const handleDirectTick = (subjectId, topicId, currentStatus) => {
    if (!currentStatus) { 
      setConfirmation({
        isOpen: true, title: "Mark Completed Without Task?",
        message: "You're marking this topic as completed without adding it to your daily tasks. This won't be tracked in your daily progress.",
        confirmText: "Mark as Completed", cancelText: "Cancel",
        onConfirm: () => { setConfirmation({ isOpen: false }); executeDirectToggle(subjectId, topicId, !currentStatus); }
      });
      return;
    }
    if (currentStatus) { 
      setConfirmation({
        isOpen: true, title: "Reduce Progress?",
        message: "Unchecking this will reduce your overall academic progress. Are you sure?",
        confirmText: "Yes, Uncheck", cancelText: "Cancel",
        onConfirm: () => { setConfirmation({ isOpen: false }); executeDirectToggle(subjectId, topicId, !currentStatus); }
      });
      return;
    }
  };

  const executeDirectToggle = async (subjectId, topicId, newStatus) => {
    const ref = doc(db, 'academic_progress', user.uid, 'subjects', subjectId);
    await setDoc(ref, { topics: { [topicId]: newStatus }, lastUpdated: Timestamp.now() }, { merge: true });
  };

  const moveOverdue = async () => {
    const startOfToday = new Date(); startOfToday.setHours(0,0,0,0);
    const batch = writeBatch(db);
    let count = 0;
    todos.forEach(t => {
      if(t.status !== 'done' && t.dueDate.toDate() < startOfToday) {
        const newDue = new Date(); newDue.setHours(t.dueDate.toDate().getHours());
        batch.update(doc(db, 'todos', t.id), { dueDate: Timestamp.fromDate(newDue) });
        count++;
      }
    });
    if(count > 0 && confirm(`Reschedule ${count} tasks to today?`)) await batch.commit();
  };

  // --- 📝 REVIEW SUBMISSION ---
  const handleReviewSubmit = async () => {
    if (!reviewForm.message.trim()) return;
    try {
      await addDoc(collection(db, 'testimonials'), {
        userId: user.uid,
        name: profile.displayName || "User",
        uni: profile.universityId || "Unknown",
        branch: profile.branchId || "Unknown",
        semester: profile.semester ? String(profile.semester) : "",
        role: "Student",
        message: reviewForm.message,
        rating: reviewForm.rating,
        approved: false,
        createdAt: Timestamp.now()
      });
      setIsReviewOpen(false);
      alert("Thank you! Your review has been submitted for approval.");
      setReviewForm({ rating: 5, message: "" });
    } catch (err) { console.error("Review Error", err); }
  };

  const jumpToToday = () => setSelectedDate(getLocalDateString());

  const changeSelectedDate = (offset) => {
    const d = new Date(selectedDate); d.setDate(d.getDate() + offset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const dailyMetrics = useMemo(() => {
    const todays = todos.filter(t => {
      if(!t.dueDate) return false;
      const d = t.dueDate.toDate();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}` === selectedDate;
    });
    todays.sort((a,b) => a.dueDate.toDate() - b.dueDate.toDate());
    const done = todays.filter(t => t.status === 'done').length;
    return { total: todays.length, done, percent: todays.length ? Math.round((done / todays.length) * 100) : 0, tasks: todays };
  }, [todos, selectedDate]);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-medium">Initializing Academic OS...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32 selection:bg-violet-100 selection:text-violet-900">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-violet-200 group-hover:scale-105 transition-transform">
              Y
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">YOU LEARN</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-violet-700 font-medium transition-colors">
              <ChevronLeft size={18} /> Back Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">

        {/* 2. PAGE HEADER */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                       <Brain className="text-violet-600" size={32}/> Study Space
                    </h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm sm:text-base">
                        <GraduationCap size={18} className="text-violet-600"/>
                        <span className="font-semibold text-slate-700">{getFullForm(profile?.branchId) || "Engineering"}</span> 
                        <span className="text-slate-300">•</span> 
                        <span>Semester {profile?.semester || "1"}</span>
                    </p>
                </div>
                <button onClick={() => openAddTask()} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 self-start md:self-auto">
                    <Plus size={20}/> New Task
                </button>
             </div>
             <div className="h-px w-full bg-slate-100"></div>
        </div>

        {/* 3. MAIN CONTENT */}
        <div className="max-w-5xl mx-auto space-y-8">

            {/* DATE & OVERDUE */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <button onClick={() => changeSelectedDate(-1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronLeft size={20}/></button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Calendar size={16} className="text-violet-600"/> 
                        {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                    </span>
                    {selectedDate !== getLocalDateString() && (
                      <button onClick={jumpToToday} className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-1 rounded-md hover:bg-violet-200 transition-colors">Today</button>
                    )}
                  </div>
                  <button onClick={() => changeSelectedDate(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronRight size={20}/></button>
                </div>
                <button onClick={moveOverdue} className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"><RefreshCw size={14}/> Sync Overdue</button>
            </div>

            {/* TASK LIST */}
            <div className="space-y-3">
                {dailyMetrics.tasks.map(task => {
                    const taskTime = task.dueDate ? task.dueDate.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
                    return (
                      <div key={task.id} className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${task.status === 'done' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-md'}`}>
                        <button onClick={() => toggleTaskStatus(task)} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-300 hover:border-violet-600'}`}>{task.status === 'done' && <Check size={14} strokeWidth={3}/>}</button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium break-words ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{task.aspect}</span>
                            {task.linkedFrom === 'syllabus' && <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center gap-1"><BookOpen size={10}/> Syllabus</span>}
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center gap-1"><Clock size={10}/> {taskTime || "Anytime"} • {task.effort}m</span>
                          </div>
                        </div>
                        <button onClick={() => { if(confirm('Delete?')) deleteDoc(doc(db, 'todos', task.id)); }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-600 transition-all"><Trash2 size={16}/></button>
                      </div>
                    );
                })}
                {dailyMetrics.tasks.length === 0 && <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl"><p className="text-slate-400 text-sm font-medium">No active tasks for {new Date(selectedDate).toLocaleDateString()}.</p></div>}
            </div>

            {/* PROGRESS METRICS */}
            {dailyMetrics.total > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Daily Velocity</h3>
                            <p className="text-sm font-bold mt-1 text-slate-800">{dailyMetrics.percent === 100 ? "All systems go! 🚀" : dailyMetrics.percent >= 70 ? "High performance zone! 🔥" : dailyMetrics.percent >= 60 ? "Momentum is building..." : "You're making progress."}</p>
                        </div>
                        <span className="text-3xl font-extrabold text-violet-600">{dailyMetrics.percent}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-700 ease-out rounded-full" style={{ width: `${dailyMetrics.percent}%` }}></div></div>
                    {dailyMetrics.percent >= 70 && <div className="mt-4 flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in"><Heart size={16} fill="currentColor"/> Outstanding consistency!</div>}
                </div>
            )}

            {/* ACADEMIC ROADMAP (WITH RESOURCES) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BookOpen size={20} className="text-indigo-600"/> Academic Roadmap</h2>
                <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{syllabus.length} Subjects</span>
              </div>
              <div className="grid gap-4">
                {syllabus.map((subj) => {
                  const completedCount = Object.values(progressMap[subj.subjectId]?.topics || {}).filter(Boolean).length;
                  const totalCount = subj.topics.length;
                  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                  const isExpanded = expandedSubject === subj.subjectId;
                  return (
                    <div key={subj.subjectId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                      <div onClick={() => setExpandedSubject(isExpanded ? null : subj.subjectId)} className="p-4 flex items-center gap-4 cursor-pointer select-none hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2"><h3 className="font-bold text-slate-800">{subj.subjectName}</h3><span className="text-xs font-bold text-indigo-600">{completedCount}/{totalCount} ({percent}%)</span></div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}/></div>
                        </div>
                        {isExpanded ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
                      </div>
                      
                      {isExpanded && (
                        <div className="bg-slate-50/50 border-t border-slate-100 p-2 grid gap-1 max-h-[400px] overflow-y-auto">
                          {subj.topics.map(topic => {
                            const isDone = progressMap[subj.subjectId]?.topics?.[topic.topicId];
                            
                            // 🔍 FIND RESOURCES FOR THIS TOPIC
                            const resources = subj.resources?.filter(r => r.topic === topic.topicName) || [];
                            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.topicName + " " + subj.subjectName + " engineering")}`;

                            return (
                              <div key={topic.topicId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-indigo-200 transition-all gap-3 sm:gap-0">
                                
                                {/* Topic Name */}
                                <span className={`text-sm font-medium ${isDone ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-slate-700'}`}>{topic.topicName}</span>
                                
                                {/* Controls: Resources + Actions */}
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  
                                  {/* 1. Resources (YT/PDF) */}
                                  {resources.map((res, idx) => (
                                      <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-md transition-colors border ${res.type === 'pdf' ? "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100" : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"}`} title={res.type === 'pdf' ? "View PDF" : "Watch Video"}>
                                        {res.type === 'pdf' ? <FileText size={16}/> : <Youtube size={16}/>}
                                      </a>
                                  ))}

                                  {/* 2. Search Button */}
                                  <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100 hover:text-violet-600 transition-colors" title="Search Topic">
                                    <Search size={16} />
                                  </a>

                                  {/* 3. Divider */}
                                  <div className="w-px h-4 bg-slate-200 mx-1"></div>

                                  {/* 4. Actions (Add/Check) */}
                                  {!isDone && <button onClick={(e) => { e.stopPropagation(); handleAddTopicClick(subj.subjectId, subj.subjectName, topic.topicId, topic.topicName, isDone); }} className={`p-1.5 rounded-md transition-colors ${isDone ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'}`} title={isDone ? "Add again for practice" : "Add to Plan"}><Plus size={16}/></button>}
                                  <button onClick={(e) => { e.stopPropagation(); handleDirectTick(subj.subjectId, topic.topicId, isDone); }} className={`p-1.5 rounded-md transition-colors ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} title={isDone ? "Uncheck Topic" : "Mark as Covered"}><Check size={16} strokeWidth={3}/></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {syllabus.length === 0 && !loading && <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-300"><Target className="w-10 h-10 text-slate-300 mx-auto mb-2"/><p className="text-slate-600 font-medium">Syllabus Sync Pending</p><p className="text-xs text-slate-400 mt-1">Could not find data for <span className="font-mono text-indigo-500">{profile?.branchId} / Sem {profile?.semester}</span>.</p></div>}
              </div>
            </section>

            {/* REVIEWS SECTION */}
            <div className="pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-violet-600 text-2xl">❝</span>
                        What Students Say
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsAllReviewsOpen(true)} 
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                      >
                          More Reviews
                      </button>
                      <button 
                        onClick={() => setIsReviewOpen(true)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-100 transition-colors border border-violet-100"
                      >
                          <Plus size={14} /> Write a Review
                      </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                    {reviews.length > 0 ? (
                        reviews.slice(0, 3).map((t, idx) => (
                            <div key={t.id || idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 uppercase shrink-0">
                                        {t.name?.[0] || "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">{t.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium truncate">
                                            {t.role && t.role !== "Student" ? t.role : ""}
                                        </p>
                                        {(t.branch || t.uni) && (
                                            <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">
                                                {getFullForm(t.branch)} {t.branch && t.uni && "•"} {getFullForm(t.uni)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex mb-3">
                                    {[1,2,3,4,5].map(star => (
                                        <Star key={star} size={13} className={star <= (t.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4 flex-grow">
                                    "{t.message}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-3 text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400 text-sm">No reviews yet. Be the first to add one!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* BRANDING & SHARE */}
            <div className="relative mt-12 mb-8 p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white text-center shadow-xl shadow-rose-200 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                    <Heart size={200} className="absolute -top-10 -right-10 rotate-12 fill-white" />
                    <Heart size={100} className="absolute bottom-0 left-0 -translate-x-10 translate-y-10 -rotate-12 fill-white" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
                      <Heart size={32} fill="white" className="animate-pulse" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight">Love using YOU LEARN?</h3>
                    
                    <div className="max-w-lg mx-auto">
                        <p className="text-pink-100 text-sm md:text-base italic leading-relaxed font-medium">
                            "Knowledge increases by sharing, not by saving."
                        </p>
                        <p className="text-pink-200/90 text-xs mt-2 uppercase tracking-wide">
                            Share this platform with your friends & help them excel!
                        </p>
                    </div>

                    <div className="mt-4">
                        <ShareButton 
                            type="app" 
                            customClass="px-8 py-3 bg-white text-rose-600 font-bold rounded-full hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                        />
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center pt-8 pb-4 opacity-50">
                <div className="flex justify-center items-center gap-2 mb-2"><div className="w-4 h-4 bg-slate-400 rounded-sm"></div><span className="text-xs font-bold text-slate-500 tracking-widest">YOU LEARN</span></div>
                <p className="text-[10px] text-slate-400">Student-First Academic Operating System</p>
            </div>

        </div>

      </main>

      {/* CONFIRMATION MODAL */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmation({ isOpen: false })}/>
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmation.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{confirmation.message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmation({ isOpen: false })} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">{confirmation.cancelText}</button>
                    <button onClick={confirmation.onConfirm} className="px-4 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md">{confirmation.confirmText}</button>
                </div>
            </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsReviewOpen(false)}/>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Rating</label>
                      <div className="flex gap-2 mt-1">
                         {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={()=>setReviewForm({...reviewForm, rating: r})} className={`p-1 ${reviewForm.rating >= r ? 'text-amber-400' : 'text-slate-300'}`}><Star fill="currentColor" size={24}/></button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                      <textarea className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-200 outline-none" rows="4" placeholder="How has You Learn helped you?" value={reviewForm.message} onChange={e => setReviewForm({...reviewForm, message: e.target.value})}></textarea>
                   </div>
                   <button onClick={handleReviewSubmit} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Submit Review</button>
                </div>
            </div>
        </div>
      )}

      {/* --- ALL REVIEWS MODAL --- */}
      {isAllReviewsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 w-full sm:max-w-2xl h-[85vh] sm:h-[80vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <span className="text-violet-600 text-xl">❝</span> All Reviews ({reviews.length})
                    </h3>
                    <button onClick={() => setIsAllReviewsOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
                    {reviews.map((t, idx) => (
                          <div key={t.id || idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 uppercase shrink-0">
                                        {t.name?.[0] || "U"}
                                    </div>
                                    <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                        <h4 className="font-bold text-slate-900 leading-tight truncate">{t.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium truncate">
                                            {t.role && t.role !== "Student" ? t.role : ""}
                                        </p>
                                        {(t.branch || t.uni) && (
                                            <p className="text-[9px] text-slate-400 truncate mt-0.5 font-medium">
                                                {getFullForm(t.branch)} {t.branch && t.uni && "•"} {getFullForm(t.uni)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 shrink-0">
                                    {[1,2,3,4,5].map(star => (
                                        <Star key={star} size={12} className={star <= (t.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"} />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-slate-700 text-sm leading-relaxed italic">"{t.message}"</p>
                            </div>
                          </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)}/>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">Add Task</h3>
              <button onClick={() => setIsAddOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Task Title</label>
                  <input autoFocus className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none font-medium text-slate-900" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Time (Optional)</label>
                  <input type="time" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Priority</label>
                  <div className="flex gap-1">
                    {['low', 'high'].map(p => (
                      <button key={p} onClick={() => setNewTask({...newTask, priority: p})} className={`flex-1 py-2.5 rounded-lg text-xs font-bold capitalize transition-all ${newTask.priority === p ? (p==='high'?'bg-rose-600 text-white':'bg-slate-800 text-white') : 'bg-slate-100 text-slate-500'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                  <div className="relative">
                    <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium appearance-none" value={newTask.aspect} onChange={e => setNewTask({...newTask, aspect: e.target.value})}>
                      <option value="academics">Academics</option>
                      <option value="internship">Internship</option>
                      <option value="life">Life</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Effort</label>
                  <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium" value={newTask.effort} onChange={e => setNewTask({...newTask, effort: e.target.value})}>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                  </select>
                </div>
              </div>
              <button onClick={saveTask} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all mt-2">Confirm Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}