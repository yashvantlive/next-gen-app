"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link"; 
import { onAuthChange, getUserProfile, db } from "../../lib/firebaseClient";
import { 
  EXAMS, BRANCHES, parseTopics, parseRawSyllabus, saveExamSyllabus, getExamSyllabus, syncTopicToTodo 
} from "../../lib/examEngine";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  CheckSquare, Square, Youtube, FileText, ChevronDown, ChevronRight, 
  BookOpen, Plus, Trash2, Save, Shield, Download, Wand2, RefreshCcw, Layers, 
  Eye, EyeOff, Search, Edit3, Link as LinkIcon, X, ArrowUp, ArrowLeft, Mail, Rocket
} from "lucide-react";

export default function ExamsPage() {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [isRealAdmin, setIsRealAdmin] = useState(false); 
  const [previewMode, setPreviewMode] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Admin State Calculation
  const isAdmin = isRealAdmin && !previewMode;

  // Filters
  const [selectedExam, setSelectedExam] = useState("GATE");
  const [selectedBranch, setSelectedBranch] = useState("ME");

  // Data
  const [syllabusData, setSyllabusData] = useState({ subjects: [], pdfLink: "", rawText: "" });
  const [userProgress, setUserProgress] = useState({});
  
  // Admin Inputs
  const [rawText, setRawText] = useState("");
  const [pdfInput, setPdfInput] = useState("");
  
  // UI State
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [expandedSections, setExpandedSections] = useState({}); 
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null); 

  // --- 1. AUTH & SCROLL ---
  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        if (profile?.role === 'admin') setIsRealAdmin(true);
      }
      setLoading(false);
    });

    const handleScroll = () => {
      // Show smart header after scrolling down 180px
      setShowStickyHeader(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll);
    return () => { unsub(); window.removeEventListener("scroll", handleScroll); };
  }, []);

  // --- 2. LOAD DATA ---
  useEffect(() => {
    if (selectedExam !== "GATE") {
        setLoading(false);
        return;
    }

    const loadSyllabus = async () => {
      setLoading(true);
      const data = await getExamSyllabus(selectedExam, selectedBranch);
      if (data) {
        setSyllabusData({
            subjects: data.subjects || [],
            pdfLink: data.syllabusPdf || "",
            rawText: data.rawSyllabusText || "" // ✅ Load saved text
        });
        setPdfInput(data.syllabusPdf || "");
        setRawText(data.rawSyllabusText || ""); // ✅ Populate text area
      } else {
        setSyllabusData({ subjects: [], pdfLink: "", rawText: "" });
        setPdfInput("");
        setRawText("");
      }
      setLoading(false);
    };
    loadSyllabus();
  }, [selectedExam, selectedBranch]);

  // --- 3. LOAD PROGRESS ---
  useEffect(() => {
    if (selectedExam !== "GATE") return;

    const loadProgress = async () => {
      const key = `${selectedExam}_${selectedBranch}`;
      if (user) {
        const ref = doc(db, "user_progress", user.uid, "exams", key);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserProgress(snap.data().completedTopics || {});
      } else {
        const local = localStorage.getItem(`prog_${key}`);
        if (local) setUserProgress(JSON.parse(local));
      }
    };
    loadProgress();
  }, [user, selectedExam, selectedBranch]);

  // --- GROUPING LOGIC ---
  const groupedSyllabus = useMemo(() => {
    if (selectedExam !== "GATE") return {};
    const groups = {};
    syllabusData.subjects.forEach((sub, originalIndex) => {
      const sec = sub.section || "General Modules";
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push({ ...sub, originalIndex });
    });
    return groups;
  }, [syllabusData.subjects, selectedExam]);

  useEffect(() => {
    if (Object.keys(groupedSyllabus).length > 0) {
        const firstSec = Object.keys(groupedSyllabus)[0];
        setExpandedSections(prev => ({ ...prev, [firstSec]: true }));
    }
  }, [groupedSyllabus]);

  // ==========================================
  // 🧠 ADMIN ACTIONS
  // ==========================================
  const handleAutoParse = () => {
    if(!rawText.trim()) return alert("Please paste syllabus text first!");
    const parsedSubjects = parseRawSyllabus(rawText);
    
    // Note: In a real merge scenario, you might use mergeSyllabusData here.
    // For now, appending/replacing based on your preference. 
    // Assuming append new ones for safety as per previous context.
    setSyllabusData(prev => ({
        ...prev, 
        subjects: [...prev.subjects, ...parsedSubjects],
        rawText: rawText // Update local state for saving
    }));
    
    setUnsavedChanges(true);
    alert(`Generated ${parsedSubjects.length} subjects!`);
  };

  const handlePdfUpdate = (val) => { setPdfInput(val); setSyllabusData(prev => ({ ...prev, pdfLink: val })); setUnsavedChanges(true); };
  const addNewSection = () => { const sectionName = prompt("Enter New Section Name:"); if(!sectionName) return; const newSub = { id: Date.now(), section: sectionName, name: "New Subject", topics: [] }; setSyllabusData(prev => ({ ...prev, subjects: [...prev.subjects, newSub] })); setUnsavedChanges(true); };
  const addSubjectInSection = (sectionName) => { const newSub = { id: Date.now(), section: sectionName, name: "New Subject", topics: [] }; setSyllabusData(prev => ({ ...prev, subjects: [...prev.subjects, newSub] })); setUnsavedChanges(true); };
  const updateSubjectField = (realIdx, field, value) => { const subs = [...syllabusData.subjects]; subs[realIdx][field] = value; setSyllabusData({ ...syllabusData, subjects: subs }); setUnsavedChanges(true); };
  const deleteSubject = (realIdx) => { if(!confirm("Delete Subject?")) return; const subs = [...syllabusData.subjects]; subs.splice(realIdx, 1); setSyllabusData({ ...syllabusData, subjects: subs }); setUnsavedChanges(true); };
  const addTopicsBatch = (realIdx, textInput) => { if (!textInput.trim()) return; const rawTopics = parseTopics(textInput); const newTopics = rawTopics.map(t => ({ name: t, resources: [] })); const subs = [...syllabusData.subjects]; subs[realIdx].topics = [...(subs[realIdx].topics || []), ...newTopics]; setSyllabusData({ ...syllabusData, subjects: subs }); setUnsavedChanges(true); };
  const deleteTopic = (realIdx, topicIdx) => { if(!confirm("Delete Topic?")) return; const subs = [...syllabusData.subjects]; subs[realIdx].topics.splice(topicIdx, 1); setSyllabusData({ ...syllabusData, subjects: subs }); setUnsavedChanges(true); };
  
  const addResource = (realIdx, topicIdx, type, url) => { 
    if (!url) return; 
    const subs = [...syllabusData.subjects]; 
    if (!subs[realIdx].topics[topicIdx].resources) subs[realIdx].topics[topicIdx].resources = []; 
    subs[realIdx].topics[topicIdx].resources.push({ type, url }); 
    setSyllabusData({ ...syllabusData, subjects: subs }); 
    setUnsavedChanges(true); 
  };
  const removeResource = (realIdx, topicIdx, resIdx) => { 
    if(!confirm("Remove link?")) return; 
    const subs = [...syllabusData.subjects]; 
    subs[realIdx].topics[topicIdx].resources.splice(resIdx, 1); 
    setSyllabusData({ ...syllabusData, subjects: subs }); 
    setUnsavedChanges(true); 
  };

  const saveMasterSyllabus = async () => { 
      if (!confirm("Publish changes?")) return; 
      setLoading(true); 
      // ✅ FIX: Save rawText to Firestore
      const finalData = { ...syllabusData, rawText: rawText };
      await saveExamSyllabus(selectedExam, selectedBranch, finalData); 
      setUnsavedChanges(false); 
      setLoading(false); 
      alert("✅ Published!"); 
  };

  // --- USER ACTIONS ---
  const toggleTopic = async (subjectName, topicName) => {
    const newStatus = !userProgress[topicName];
    const newProg = { ...userProgress, [topicName]: newStatus };
    setUserProgress(newProg);
    const key = `${selectedExam}_${selectedBranch}`;
    if (user) {
      const ref = doc(db, "user_progress", user.uid, "exams", key);
      await setDoc(ref, { completedTopics: newProg }, { merge: true });
      await syncTopicToTodo(user.uid, topicName, subjectName, selectedExam, newStatus);
    } else {
      localStorage.setItem(`prog_${key}`, JSON.stringify(newProg));
    }
  };

  const handleSearch = (term) => {
    const query = `${term} ${selectedBranch} ${selectedExam} preparation`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const backLink = user ? "/home" : "/";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 pb-20 md:pb-0">
      
      {/* ==============================================================
          MOBILE: ANIMATED STICKY HEADER (Appears on Scroll)
          - Contains Back, Branding, and Compact Info
      ============================================================== */}
      <div className={`md:hidden fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 px-4 py-3 flex items-center justify-between transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-full'}`}>
         <div className="flex items-center gap-3">
            <Link href={backLink} className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900">
                <ArrowLeft size={18}/>
            </Link>
            <div className="flex items-center gap-2" onClick={scrollToTop}>
                <div className="p-1.5 bg-violet-100 rounded-lg text-violet-700"><BookOpen size={16}/></div>
                <div>
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase leading-none">Viewing</h3>
                   <p className="text-sm font-black text-slate-900 leading-none mt-0.5 truncate max-w-[150px]">{selectedBranch} ({selectedExam})</p>
                </div>
            </div>
         </div>
         <button onClick={scrollToTop} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200"><ArrowUp size={18}/></button>
      </div>

      {/* ==============================================================
          MOBILE: TOP FILTER SECTION (Visible at start)
          - Contains Back Button, Admin Toggle, and Full Dropdowns
      ============================================================== */}
      <div className="md:hidden bg-white border-b border-slate-200 p-5">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <Link href={backLink} className="text-slate-500 p-1"><ArrowLeft size={20}/></Link>
                <h1 className="font-black text-xl text-slate-800 flex items-center gap-2">
                    <BookOpen className="text-violet-600" size={20}/> EXAM HUB
                </h1>
            </div>
            
            {/* Mobile Admin Toggle (Restored) */}
            {isRealAdmin && (
                <button 
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${previewMode ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}
                >
                    {previewMode ? <><Eye size={12}/> Student</> : <><Shield size={12}/> Admin</>}
                </button>
            )}
         </div>

         {/* Full Selectors */}
         <div className="grid grid-cols-2 gap-3">
            <div>
                <label htmlFor="exam-select" className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Exam</label>
                <select id="exam-select" name="exam" value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="w-full p-2 border rounded-lg font-bold bg-slate-50 text-base outline-none">
                    {EXAMS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="branch-select" className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Branch</label>
                <select id="branch-select" name="branch" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full p-2 border rounded-lg font-bold bg-slate-50 text-base outline-none">
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
            </div>
         </div>
      </div>

      {/* ==============================================================
          DESKTOP SIDEBAR
      ============================================================== */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 p-6 flex-col gap-6 sticky top-0 h-screen z-20">
        <Link href={backLink} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors mb-2">
            <ArrowLeft size={14}/> Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="font-black text-2xl text-slate-800 flex items-center gap-2"><BookOpen className="text-violet-600"/> EXAM HUB</h1>
          {isRealAdmin && !previewMode && <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1 animate-pulse"><Shield size={10}/> ADMIN</div>}
          {previewMode && <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1"><Eye size={10}/> STUDENT</div>}
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="target-exam-select" className="text-xs font-bold text-slate-400">TARGET EXAM</label>
            <select id="target-exam-select" name="target-exam" value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="w-full p-3 border rounded-xl font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
              {EXAMS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="target-branch-select" className="text-xs font-bold text-slate-400">SELECT BRANCH</label>
            <select id="target-branch-select" name="target-branch" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full p-3 border rounded-xl font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
              {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>
          </div>
        </div>
        {isRealAdmin && (
          <div className="mt-auto space-y-3 pt-6 border-t border-slate-100">
            <button onClick={() => setPreviewMode(!previewMode)} className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all border ${previewMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
               {previewMode ? <><EyeOff size={14}/> Exit Preview</> : <><Eye size={14}/> View as Student</>}
            </button>
            {!previewMode && unsavedChanges && <button onClick={saveMasterSyllabus} className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-violet-700 animate-bounce"><Save size={18}/> Publish Changes</button>}
          </div>
        )}
      </aside>

      {/* ==============================================================
          MAIN CONTENT AREA
      ============================================================== */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {selectedExam !== "GATE" ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner"><Rocket size={40} className="text-indigo-600"/></div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Coming Soon!</h2>
                <p className="text-slate-500 max-w-lg text-lg leading-relaxed mb-8">We are crafting a comprehensive roadmap for <span className="font-bold text-indigo-600">{selectedExam}</span>.</p>
                <div className="flex flex-col items-center gap-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact for Updates</p>
                    <div className="flex items-center gap-2 text-slate-800 font-bold bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"><Mail size={16} className="text-violet-500"/>yashvantislive@gmail.com</div>
                </div>
            </div>
        ) : (
            <>
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">{selectedExam} - {selectedBranch}</h2>
                        <p className="text-slate-500 text-sm">Official Syllabus & Roadmap</p>
                    </div>
                    {syllabusData.pdfLink ? <a href={syllabusData.pdfLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-md w-full md:w-auto justify-center"><Download size={18}/> Syllabus PDF</a> : <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded">No PDF Attached</span>}
                </div>

                {isAdmin && (
                    <div className="mb-8 bg-white border-2 border-slate-200 p-6 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-lg"><Wand2 size={20} className="text-violet-600"/> Master Parser</h3>
                        <div className="space-y-4">
                            {/* Updated: text-base to prevent mobile zoom */}
                            <input id="master-pdf-link" name="master-pdf-link" type="text" placeholder="Paste PDF Link Here..." className="w-full p-3 rounded-lg border border-slate-300 text-base bg-white font-medium text-slate-900 focus:ring-2 focus:ring-violet-200 outline-none" value={pdfInput} onChange={(e) => handlePdfUpdate(e.target.value)} />
                            <div className="relative">
                                {/* Updated: text-base to prevent mobile zoom */}
                                <textarea id="master-raw-text" name="master-raw-text" rows={8} placeholder={`Paste Raw Text from PDF here...`} className="w-full p-4 rounded-lg border border-slate-300 text-base font-mono bg-white text-slate-900 outline-none resize-y focus:ring-2 focus:ring-violet-200" value={rawText} onChange={(e) => setRawText(e.target.value)} />
                                <div className="absolute bottom-4 right-4">
                                    <button onClick={handleAutoParse} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black flex items-center gap-2 shadow-lg"><RefreshCcw size={14}/> Update Structure</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Syllabus...</div> : (
                    <div className="space-y-6">
                        {Object.entries(groupedSyllabus).map(([sectionTitle, subjectsInSec]) => {
                            const isSecOpen = expandedSections[sectionTitle];
                            return (
                                <div key={sectionTitle} className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
                                    
                                    {/* SECTION HEADER - STATIC (Sticky Removed to prevent overlap) */}
                                    <div 
                                        onClick={() => setExpandedSections(p => ({...p, [sectionTitle]: !p[sectionTitle]}))} 
                                        className={`p-3 md:p-4 rounded-xl flex items-center justify-between cursor-pointer border transition-all select-none shadow-sm ${isSecOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Layers size={18} className={isSecOpen ? "text-indigo-400" : "text-slate-400"}/>
                                            <h2 className="text-sm md:text-lg font-bold truncate max-w-[200px] md:max-w-none">{sectionTitle}</h2>
                                            <span className="text-[10px] md:text-xs opacity-60 font-medium ml-2 whitespace-nowrap">({subjectsInSec.length} Subjects)</span>
                                        </div>
                                        {isSecOpen ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                                    </div>

                                    {isSecOpen && (
                                        <div className="space-y-4 mt-4 pl-0 md:pl-4 md:border-l-2 border-slate-200/50 md:ml-4 pb-4">
                                            {subjectsInSec.map((subject) => {
                                                const sIdx = subject.originalIndex;
                                                const total = subject.topics?.length || 0;
                                                const done = subject.topics?.filter(t => userProgress[t.name]).length || 0;
                                                const percent = total ? Math.round((done/total)*100) : 0;
                                                const isExp = expandedSubjects[subject.id];

                                                return (
                                                    <div key={subject.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative">
                                                        
                                                        {/* SUBJECT HEADER - STATIC (Sticky Removed) */}
                                                        <div className="bg-white p-3 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors shadow-sm">
                                                            <div className="flex items-center gap-3 w-full">
                                                                <button onClick={() => setExpandedSubjects(p => ({...p, [subject.id]: !p[subject.id]}))} className="p-1.5 md:p-2 bg-white border rounded-lg hover:bg-slate-50 shrink-0">
                                                                    {isExp ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                                                </button>
                                                                <div className="flex-1 min-w-0">
                                                                    {isAdmin ? (
                                                                        <div className="space-y-2">
                                                                            {/* Updated: text-base for zoom prevention */}
                                                                            <input id={`subject-name-${sIdx}`} name={`subject-name-${sIdx}`} value={subject.name} onChange={(e) => updateSubjectField(sIdx, 'name', e.target.value)} className="font-bold text-lg bg-transparent border-b border-dashed border-slate-300 w-full focus:border-indigo-500 outline-none text-slate-900" />
                                                                            <div className="flex gap-2 items-center">
                                                                                <input id={`subject-section-${sIdx}`} name={`subject-section-${sIdx}`} value={subject.section} onChange={(e) => updateSubjectField(sIdx, 'section', e.target.value)} className="text-xs bg-slate-50 p-1 border rounded w-full md:w-48" placeholder="Section Name" />
                                                                                <button onClick={() => deleteSubject(sIdx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <h3 className="font-bold text-sm md:text-lg text-slate-800 truncate">{subject.name}</h3>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <div className="h-1.5 w-12 md:w-16 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${percent}%`}}></div></div>
                                                                                <span className="text-[10px] md:text-xs text-slate-400 font-medium">{done}/{total}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* TOPICS LIST */}
                                                        {isExp && (
                                                            <div>
                                                                {isAdmin && (
                                                                    <div className="p-3 bg-slate-50 border-b flex gap-2 items-center">
                                                                        <input id={`input-${sIdx}`} name={`topics-input-${sIdx}`} placeholder="Paste Topics (Comma Separated)..." className="flex-1 p-2 text-base border rounded outline-none focus:border-violet-500" onKeyDown={(e) => { if(e.key === 'Enter'){ addTopicsBatch(sIdx, e.target.value); e.target.value = ""; } }} />
                                                                        <button onClick={() => { const el = document.getElementById(`input-${sIdx}`); addTopicsBatch(sIdx, el.value); el.value = ""; }} className="bg-slate-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-black">Add</button>
                                                                    </div>
                                                                )}
                                                                <div className="divide-y divide-slate-50">
                                                                    {subject.topics?.map((topic, tIdx) => {
                                                                        const isDone = userProgress[topic.name];
                                                                        const editKey = `${subject.id}-${tIdx}`;
                                                                        const isEditing = editingTopicId === editKey;

                                                                        return (
                                                                            <div key={tIdx} className={`p-3 md:p-4 transition-colors ${isDone ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}>
                                                                                <div className="flex items-start justify-between gap-3">
                                                                                    
                                                                                    {/* LEFT: Checkbox + Name */}
                                                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                                        <button onClick={() => toggleTopic(subject.name, topic.name)} className={`mt-0.5 shrink-0 ${isDone ? "text-emerald-500" : "text-slate-300 hover:text-indigo-500"}`}>{isDone ? <CheckSquare size={20}/> : <Square size={20}/>}</button>
                                                                                        <div className="flex flex-col pt-0.5">
                                                                                            {/* Wraps long text correctly */}
                                                                                            <span className={`text-sm font-medium leading-snug break-words ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{topic.name}</span>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* RIGHT: Actions & Icons */}
                                                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                                                        {topic.resources?.map((res, rIdx) => (
                                                                                            <a key={rIdx} href={res.url} target="_blank" rel="noreferrer" className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${res.type === 'pdf' ? 'text-blue-500' : 'text-red-500'}`} title={res.type.toUpperCase()}>{res.type === 'pdf' ? <FileText size={16}/> : <Youtube size={18}/>}</a>
                                                                                        ))}
                                                                                        <button onClick={() => handleSearch(topic.name)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Search Topic"><Search size={16}/></button>
                                                                                        {isAdmin && <button onClick={() => setEditingTopicId(isEditing ? null : editKey)} className={`p-1.5 rounded-lg transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}>{isEditing ? <X size={16}/> : <Edit3 size={16}/>}</button>}
                                                                                    </div>
                                                                                </div>

                                                                                {/* ADMIN LINK MANAGER */}
                                                                                {isAdmin && isEditing && (
                                                                                    <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2">
                                                                                        <div className="flex items-center justify-between mb-2">
                                                                                            <h4 className="text-xs font-bold text-indigo-800 flex items-center gap-1"><LinkIcon size={12}/> Manage Links</h4>
                                                                                            <button onClick={() => deleteTopic(sIdx, tIdx)} className="text-[10px] text-red-500 hover:underline">Delete Topic</button>
                                                                                        </div>
                                                                                        <div className="space-y-2 mb-3">
                                                                                            {topic.resources?.map((res, rIdx) => (
                                                                                                <div key={rIdx} className="flex items-center justify-between bg-white p-2 rounded border border-indigo-100 text-xs">
                                                                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                                                                        {res.type === 'pdf' ? <FileText size={12} className="text-blue-500 shrink-0"/> : <Youtube size={12} className="text-red-500 shrink-0"/>}
                                                                                                        <span className="truncate max-w-[150px] text-slate-600">{res.url}</span>
                                                                                                    </div>
                                                                                                    <button onClick={() => removeResource(sIdx, tIdx, rIdx)} className="text-red-400 hover:text-red-600"><Trash2 size={12}/></button>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className="flex gap-2">
                                                                                            {/* Updated: text-base to prevent mobile zoom */}
                                                                                            <input id={`url-input-${editKey}`} name={`url-input-${editKey}`} placeholder="Paste Link..." className="flex-1 p-2 text-base border rounded outline-none focus:border-indigo-500" />
                                                                                            <button onClick={() => { const el = document.getElementById(`url-input-${editKey}`); addResource(sIdx, tIdx, 'yt', el.value); el.value=''; }} className="px-3 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold hover:bg-red-200">+ YT</button>
                                                                                            <button onClick={() => { const el = document.getElementById(`url-input-${editKey}`); addResource(sIdx, tIdx, 'pdf', el.value); el.value=''; }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold hover:bg-blue-200">+ PDF</button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {isAdmin && <button onClick={() => addSubjectInSection(sectionTitle)} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 flex justify-center items-center gap-2 transition-all"><Plus size={18}/> Add Subject in "{sectionTitle}"</button>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {isAdmin && <button onClick={addNewSection} className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-black flex justify-center items-center gap-2 shadow-lg transition-all"><Plus size={20}/> Create New Main Section</button>}
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );
}