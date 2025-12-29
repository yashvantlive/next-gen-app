"use client";

import React, { useEffect, useState } from "react";
import { onAuthChange, getUserProfile, db } from "../../lib/firebaseClient"; 
import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc,
  query, where, serverTimestamp, orderBy 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Shield, UploadCloud, Database, List, Trash2, CheckCircle, AlertCircle, 
  FileText, Settings, Plus, Zap, Heart, ArrowLeft, Edit2, Star, User, Save, X, Activity, CheckSquare
} from "lucide-react";

// --- Main Admin Component ---
export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); 
  const [metadata, setMetadata] = useState({ universities: {}, branches: {}, skills: {}, interests: {} });
  const router = useRouter();

  // --- Auth Check ---
  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      try {
        const profile = await getUserProfile(user.uid);
        // Remove '|| true' in production to secure this page
        if (profile?.role === "admin" || true) { 
          setIsAdmin(true);
          fetchMetadata();
        } else {
          router.push("/home");
        }
      } catch (err) {
        console.error("Admin check failed", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // --- Fetch Metadata ---
  const fetchMetadata = async () => {
    try {
      const uniSnap = await getDoc(doc(db, "metadata", "universities"));
      const branchSnap = await getDoc(doc(db, "metadata", "branches"));
      const skillSnap = await getDoc(doc(db, "metadata", "skills"));
      const interestSnap = await getDoc(doc(db, "metadata", "interests"));
      
      setMetadata({
        universities: uniSnap.exists() ? uniSnap.data() : {},
        branches: branchSnap.exists() ? branchSnap.data() : {},
        skills: skillSnap.exists() ? skillSnap.data() : {},
        interests: interestSnap.exists() ? interestSnap.data() : {}
      });
    } catch (err) {
      console.error("Error loading metadata:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="font-medium">Verifying Credentials...</p>
    </div>
  );
  
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-200">
                <Shield size={18} />
              </div>
              <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Admin Console</h1>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2">
             <TabButton active={activeTab === "upload"} onClick={() => setActiveTab("upload")} icon={<UploadCloud size={16} />} label="Upload" />
             <TabButton active={activeTab === "manage"} onClick={() => setActiveTab("manage")} icon={<List size={16} />} label="Content" />
             <TabButton active={activeTab === "testimonials"} onClick={() => setActiveTab("testimonials")} icon={<Star size={16} />} label="Reviews" />
             <TabButton active={activeTab === "metadata"} onClick={() => setActiveTab("metadata")} icon={<Settings size={16} />} label="Metadata" />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-white border-t border-slate-100 hide-scrollbar">
             <TabButton active={activeTab === "upload"} onClick={() => setActiveTab("upload")} icon={<UploadCloud size={16} />} label="Upload" />
             <TabButton active={activeTab === "manage"} onClick={() => setActiveTab("manage")} icon={<List size={16} />} label="Content" />
             <TabButton active={activeTab === "testimonials"} onClick={() => setActiveTab("testimonials")} icon={<Star size={16} />} label="Reviews" />
             <TabButton active={activeTab === "metadata"} onClick={() => setActiveTab("metadata")} icon={<Settings size={16} />} label="Meta" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "upload" && <UploadSection metadata={metadata} />}
        {activeTab === "manage" && <ManageSection metadata={metadata} />}
        {activeTab === "testimonials" && <TestimonialManager />}
        {activeTab === "metadata" && <MetadataSection metadata={metadata} refresh={fetchMetadata} />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: Tab Button ---
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active 
          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 shadow-sm" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// --- SUB-COMPONENT: Upload Section ---
function UploadSection({ metadata }) {
  const [type, setType] = useState("syllabus"); 
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [fetchedSubjects, setFetchedSubjects] = useState([]); 

  const [formData, setFormData] = useState({
    universityId: "", branchId: "", semester: 1, 
    subjectName: "", subjectCode: "", subjectType: "theory", 
    credits: 4, content: "", year: new Date().getFullYear(), 
    term: "Final", questions: ""
  });

  const sortedUnis = Object.entries(metadata.universities || {}).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const sortedBranches = Object.entries(metadata.branches || {}).sort((a, b) => a[1].localeCompare(b[1]));

  useEffect(() => {
    const fetchSyllabusSubjects = async () => {
        if (type === 'pyq' && formData.universityId && formData.branchId) {
            try {
                const q = query(
                    collection(db, "syllabi"),
                    where("universityId", "==", formData.universityId),
                    where("branchId", "==", formData.branchId),
                    where("semester", "==", Number(formData.semester))
                );
                const querySnapshot = await getDocs(q);
                const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                subs.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
                setFetchedSubjects(subs);
            } catch (error) {
                console.error("Error fetching subjects for PYQ:", error);
            }
        }
    };
    fetchSyllabusSubjects();
  }, [type, formData.universityId, formData.branchId, formData.semester]);

  const handleSubjectSelect = (e) => {
    const selectedSubName = e.target.value;
    const selectedSub = fetchedSubjects.find(s => s.subjectName === selectedSubName);
    
    if (selectedSub) {
        setFormData(prev => ({
            ...prev,
            subjectName: selectedSub.subjectName,
            subjectCode: selectedSub.subjectCode || "",
            credits: selectedSub.credits || 4,
            subjectType: selectedSub.subjectType || "theory"
        }));
    } else {
        setFormData(prev => ({ ...prev, subjectName: selectedSubName }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Uploading..." });

    try {
      const collectionName = type === "syllabus" ? "syllabi" : "pyqs";
      const baseData = {
        universityId: formData.universityId,
        branchId: formData.branchId,
        semester: Number(formData.semester),
        subjectName: formData.subjectName,
        subjectCode: formData.subjectCode,
        createdAt: serverTimestamp()
      };

      const finalData = type === "syllabus" ? {
        ...baseData,
        subjectType: formData.subjectType,
        credits: Number(formData.credits),
        content: formData.content
      } : {
        ...baseData,
        year: Number(formData.year),
        term: formData.term,
        questions: formData.questions
      };

      await addDoc(collection(db, collectionName), finalData);
      setStatus({ type: "success", msg: `${type === "syllabus" ? "Syllabus" : "PYQ"} Saved Successfully!` });
      setFormData(prev => ({ ...prev, content: "", questions: "" }));
      setTimeout(() => setStatus({type: "", msg: ""}), 3000);

    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Upload failed: " + err.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 inline-flex w-full md:w-auto">
        <button onClick={() => setType("syllabus")} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${type==="syllabus" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
            Syllabus
        </button>
        <button onClick={() => setType("pyq")} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${type==="pyq" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
            PYQ Manager
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
           <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {type === "syllabus" ? <FileText className="text-indigo-500" /> : <Database className="text-indigo-500" />}
                    {type === "syllabus" ? "Add New Syllabus" : "Upload Past Year Question"}
                </h2>
                {type === "pyq" && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Smart Linked</span>}
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">University</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      required value={formData.universityId} onChange={e => setFormData({...formData, universityId: e.target.value})}>
                    <option value="">Choose University...</option>
                    {sortedUnis.map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
                  </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Branch</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                    <option value="">Choose Branch...</option>
                    {sortedBranches.map(([key, val]) => <option key={key} value={key}>{val}</option>)}
                  </select>
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Semester</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}>
                     {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                  </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-6 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Subject Name</label>
                  {type === "pyq" && fetchedSubjects.length > 0 ? (
                      <select 
                        className="w-full p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                        value={formData.subjectName} onChange={handleSubjectSelect} required>
                        <option value="">Select a Subject from Syllabus...</option>
                        {fetchedSubjects.map(sub => <option key={sub.id} value={sub.subjectName}>{sub.subjectName} (Code: {sub.subjectCode})</option>)}
                        <option value="custom">+ Add Manual Subject</option>
                      </select>
                  ) : (
                    <input type="text" placeholder="e.g. Data Structures" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required 
                    value={formData.subjectName} onChange={e => setFormData({...formData, subjectName: e.target.value})} />
                  )}
              </div>
              
              <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Subject Code</label>
                  <input type="text" placeholder="e.g. CS-101" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} />
              </div>

              {type === "syllabus" ? (
                  <div className="md:col-span-3 grid grid-cols-2 gap-2">
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.subjectType} onChange={e => setFormData({...formData, subjectType: e.target.value})}>
                          <option value="theory">Theory</option>
                          <option value="lab">Lab</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Credit</label>
                        <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" 
                          value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} />
                     </div>
                  </div>
              ) : (
                  <div className="md:col-span-3 grid grid-cols-2 gap-2">
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Year</label>
                        <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" 
                        value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Term</label>
                        <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={formData.term} onChange={e => setFormData({...formData, term: e.target.value})}>
                          <option value="Mid">Mid-Term</option>
                          <option value="Final">Final</option>
                        </select>
                     </div>
                  </div>
              )}
           </div>

           <div className="space-y-1.5">
               <label className="text-xs font-semibold text-slate-500 uppercase">
                   {type === "syllabus" ? "Syllabus Content (Modules/Topics)" : "Questions Text / Links"}
               </label>
               <textarea 
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm leading-relaxed" 
                 placeholder={type === "syllabus" ? "Module 1: Introduction...\nModule 2: Arrays..." : "Q1. Explain the theory of relativity...\nQ2. Define thermodynamics..."}
                 required
                 rows={10}
                 value={type === "syllabus" ? formData.content : formData.questions}
                 onChange={e => type === "syllabus" ? setFormData({...formData, content: e.target.value}) : setFormData({...formData, questions: e.target.value})}
               ></textarea>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
             {status.msg && (
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : status.type === 'loading' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                   {status.type === 'success' ? <CheckCircle size={16}/> : status.type === 'loading' ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <AlertCircle size={16}/>}
                   {status.msg}
                </div>
             )}
             <button type="submit" disabled={status.type === 'loading'} className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ml-auto">
               <UploadCloud size={20} />
               {status.type === 'loading' ? 'Saving Data...' : 'Save to Database'}
             </button>
           </div>
      </form>
    </div>
  );
}

// --- SUB-COMPONENT: Manage Section (Unchanged) ---
function ManageSection({ metadata }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ type: "syllabi", uni: "", branch: "", sem: "1" });
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 

  const sortedUnis = Object.entries(metadata.universities || {}).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const sortedBranches = Object.entries(metadata.branches || {}).sort((a, b) => a[1].localeCompare(b[1]));

  const fetchContent = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, filter.type),
        where("universityId", "==", filter.uni),
        where("branchId", "==", filter.branch),
        where("semester", "==", Number(filter.sem))
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Please select all filters correctly.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if(!confirm("Are you sure you want to delete this permanently?")) return;
    try {
      await deleteDoc(doc(db, filter.type, id));
      setItems(prev => prev.filter(i => i.id !== id));
    } catch(e) { alert("Delete failed"); }
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      if(!editingItem) return;
      try {
          const docRef = doc(db, filter.type, editingItem.id);
          const { id, ...dataToSave } = editingItem; 
          await updateDoc(docRef, dataToSave);
          alert("Updated Successfully!");
          setEditingItem(null);
          fetchContent();
      } catch(e) {
          alert("Update Failed: " + e.message);
      }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
            <option value="syllabi">Syllabus</option>
            <option value="pyqs">PYQs</option>
          </select>
          <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={filter.uni} onChange={e => setFilter({...filter, uni: e.target.value})}>
             <option value="">Select Uni</option>
             {sortedUnis.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={filter.branch} onChange={e => setFilter({...filter, branch: e.target.value})}>
             <option value="">Select Branch</option>
             {sortedBranches.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value={filter.sem} onChange={e => setFilter({...filter, sem: e.target.value})}>
             {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
          </select>
          <button onClick={fetchContent} className="md:col-span-1 col-span-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Fetch Data
          </button>
       </div>

       <div className="space-y-3">
         {loading ? <div className="text-center text-slate-400 py-10">Searching Database...</div> : 
          items.length === 0 ? <div className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-100 rounded-xl">No records found. Try different filters.</div> :
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all">
               <div>
                 <h4 className="font-bold text-slate-800 text-sm sm:text-base">{item.subjectName}</h4>
                 <div className="flex gap-3 text-xs text-slate-500 mt-1">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{item.subjectCode || "No Code"}</span>
                    {filter.type === 'syllabi' ? <span>{item.credits} Credits • {item.subjectType}</span> : <span>{item.year} • {item.term}</span>}
                 </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setEditingItem(item)} className="p-2 text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                 </button>
                 <button onClick={() => deleteItem(item.id)} className="p-2 text-rose-500 bg-white border border-rose-100 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                 </button>
               </div>
            </div>
          ))}
       </div>

       {editingItem && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Edit {editingItem.subjectName}</h3>
                    <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Subject Name</label>
                            <input className="w-full p-2 border rounded" value={editingItem.subjectName} onChange={e => setEditingItem({...editingItem, subjectName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Subject Code</label>
                            <input className="w-full p-2 border rounded" value={editingItem.subjectCode} onChange={e => setEditingItem({...editingItem, subjectCode: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Content</label>
                        <textarea className="w-full p-2 border rounded font-mono text-sm h-40" 
                           value={filter.type === 'syllabi' ? editingItem.content : editingItem.questions} 
                           onChange={e => filter.type === 'syllabi' ? setEditingItem({...editingItem, content: e.target.value}) : setEditingItem({...editingItem, questions: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                    <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
         </div>
       )}
    </div>
  );
}

// --- ✅ UPDATED SUB-COMPONENT: Testimonial Manager with 5 Fields ---
function TestimonialManager() {
    const [tData, setTData] = useState({ name: "", branch: "", uni: "", message: "", rating: 5 });
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);

    // Fetch Reviews
    const fetchReviews = async () => {
        try {
            const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch(e) { console.error(e); }
    };

    useEffect(() => { fetchReviews(); }, []);

    // Save New
    const saveTestimonial = async () => {
        if(!tData.name || !tData.message) return alert("Required fields missing");
        try {
            await addDoc(collection(db, "testimonials"), {
                ...tData, createdAt: serverTimestamp(), approved: true
            });
            alert("Review Published!");
            setTData({ name: "", branch: "", uni: "", message: "", rating: 5 });
            fetchReviews();
        } catch(e) { alert("Error adding review"); }
    };

    // Approve
    const approveReview = async (id) => {
        try {
            await updateDoc(doc(db, "testimonials", id), { approved: true });
            alert("Review Approved & Live!");
            fetchReviews();
        } catch(e) { alert("Approval failed"); }
    };

    // Update Existing
    const updateReview = async () => {
        if(!editingReview) return;
        try {
            const { id, ...data } = editingReview;
            await updateDoc(doc(db, "testimonials", id), data);
            alert("Review Updated!");
            setEditingReview(null);
            fetchReviews();
        } catch(e) { alert("Update failed"); }
    };

    // Delete
    const deleteReview = async (id) => {
        if(!confirm("Delete this review?")) return;
        try {
            await deleteDoc(doc(db, "testimonials", id));
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch(e) { alert("Delete failed"); }
    };

    // SPLIT REVIEWS
    const pendingReviews = reviews.filter(r => !r.approved);
    const publishedReviews = reviews.filter(r => r.approved);

    return (
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. PENDING APPROVALS SECTION */}
            {pendingReviews.length > 0 && (
                <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200">
                    <h3 className="font-bold text-lg mb-4 text-amber-800 flex items-center gap-2">
                        <AlertCircle size={20} className="text-amber-600"/> 
                        Pending Reviews ({pendingReviews.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingReviews.map(r => (
                            <div key={r.id} className="p-4 border border-amber-100 rounded-xl bg-white flex flex-col sm:flex-row gap-4 justify-between items-start">
                                <div>
                                    <div className="flex gap-2 items-center mb-1">
                                        <h4 className="font-bold text-slate-900">{r.name}</h4>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{r.branch}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{r.uni}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 italic mt-1">"{r.message}"</p>
                                    <div className="flex text-amber-400 gap-1 text-xs mt-1">Rating: {r.rating} ★</div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => approveReview(r.id)} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-emerald-200 transition-colors">
                                        <CheckCircle size={16}/> Approve
                                    </button>
                                    <button onClick={() => setEditingReview(r)} className="p-2 bg-slate-50 border rounded-lg hover:text-indigo-600"><Edit2 size={16}/></button>
                                    <button onClick={() => deleteReview(r.id)} className="p-2 bg-slate-50 border rounded-lg hover:text-rose-600"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. ADD NEW SECTION (5 FIELDS) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Heart className="text-rose-500 fill-rose-500" size={20}/> Add Manual Review
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Student Name" className="p-3 border rounded-lg w-full" value={tData.name} onChange={e => setTData({...tData, name: e.target.value})} />
                    <input type="text" placeholder="Branch (e.g. CSE)" className="p-3 border rounded-lg w-full" value={tData.branch} onChange={e => setTData({...tData, branch: e.target.value})} />
                    <input type="text" placeholder="University (e.g. AKU)" className="p-3 border rounded-lg w-full" value={tData.uni} onChange={e => setTData({...tData, uni: e.target.value})} />
                </div>
                
                <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1,2,3,4,5].map(s => (
                            <button key={s} onClick={() => setTData({...tData, rating: s})} className={`text-2xl transition-transform hover:scale-110 ${s <= tData.rating ? "text-amber-400" : "text-slate-200"}`}>★</button>
                        ))}
                    </div>
                </div>

                <textarea placeholder="Review Message..." className="p-3 border rounded-lg w-full h-24 mb-4 resize-none" value={tData.message} onChange={e => setTData({...tData, message: e.target.value})} />
                
                <button onClick={saveTestimonial} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Publish Directly</button>
            </div>

            {/* 3. MANAGE PUBLISHED */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                    <CheckSquare size={20} className="text-emerald-600"/>
                    Published Reviews ({publishedReviews.length})
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {publishedReviews.map(r => (
                        <div key={r.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <h4 className="font-bold text-slate-900">{r.name}</h4>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{r.branch}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{r.uni}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingReview(r)} className="p-2 bg-white border rounded hover:text-indigo-600"><Edit2 size={16}/></button>
                                    <button onClick={() => deleteReview(r.id)} className="p-2 bg-white border rounded hover:text-rose-600"><Trash2 size={16}/></button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 italic">"{r.message}"</p>
                            <div className="flex text-amber-400 gap-1 text-xs">Rating: {r.rating} ★</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingReview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="font-bold text-lg mb-4">Edit Review</h3>
                        <div className="space-y-3">
                            <input className="w-full p-2 border rounded" placeholder="Name" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-3">
                                <input className="w-full p-2 border rounded" placeholder="Branch" value={editingReview.branch} onChange={e => setEditingReview({...editingReview, branch: e.target.value})} />
                                <input className="w-full p-2 border rounded" placeholder="University" value={editingReview.uni} onChange={e => setEditingReview({...editingReview, uni: e.target.value})} />
                            </div>

                            <textarea className="w-full p-2 border rounded h-32" value={editingReview.message} onChange={e => setEditingReview({...editingReview, message: e.target.value})} />
                            
                            <div className="flex gap-2">
                                <span className="text-sm font-bold">Rating:</span>
                                {[1,2,3,4,5].map(s => (
                                    <button key={s} onClick={() => setEditingReview({...editingReview, rating: s})} className={`text-xl ${s <= editingReview.rating ? "text-amber-500" : "text-gray-300"}`}>★</button>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setEditingReview(null)} className="flex-1 py-2 bg-slate-100 rounded text-slate-600">Cancel</button>
                                <button onClick={updateReview} className="flex-1 py-2 bg-indigo-600 text-white rounded">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENT: Metadata Section (Unchanged) ---
function MetadataSection({ metadata, refresh }) {
  const [jsonInput, setJsonInput] = useState("");
  const [target, setTarget] = useState("universities"); 

  const handleUpdate = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      await setDoc(doc(db, "metadata", target), parsed, { merge: true });
      alert("Metadata Updated Successfully!");
      setJsonInput("");
      refresh();
    } catch (e) { alert("Invalid JSON Format!"); }
  };

  const placeholders = {
    universities: '{"AKU": {"name": "Aryabhatta Knowledge Univ", "loc": "Patna"}}',
    branches: '{"CSE": "Computer Science", "ME": "Mechanical"}',
    skills: '{"CSE": ["React", "Node.js"], "ME": ["AutoCAD"]}',
    interests: '{"CSE": ["Web Dev", "AI/ML"], "ME": ["Robotics"]}'
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
       <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Preview Data</h3>
          <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
             {Object.keys(metadata[target] || {}).map(k => (
                 <span key={k} className="px-2 py-1 bg-slate-100 text-xs rounded border border-slate-200 font-mono text-slate-600">{k}</span>
             ))}
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl border border-slate-200">
          {/* Updated Buttons including Skills and Interests */}
          <div className="grid grid-cols-2 gap-2 mb-4">
             {["universities", "branches", "skills", "interests"].map(t => (
                 <button key={t} onClick={() => setTarget(t)} className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${target===t ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300" : "bg-slate-50 text-slate-500"}`}>{t}</button>
             ))}
          </div>
          <p className="text-xs text-slate-500 mb-2">Adding to: <span className="font-bold text-indigo-600 uppercase">{target}</span></p>
          <textarea className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-40 font-mono text-xs leading-relaxed" 
            placeholder={placeholders[target]}
            value={jsonInput} onChange={e => setJsonInput(e.target.value)}></textarea>
          <button onClick={handleUpdate} className="mt-4 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
             Merge Metadata
          </button>
       </div>
    </div>
  );
}