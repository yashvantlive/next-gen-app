"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, db } from "@/lib/firebaseClient";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp, 
  orderBy 
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  UploadCloud, 
  Database, 
  List, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  HelpCircle,
  Settings,
  Plus,
  Zap,
  Heart
} from "lucide-react";

// --- Main Admin Component ---
export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // 'upload', 'manage', 'metadata'
  const [metadata, setMetadata] = useState({ universities: {}, branches: {}, skills: {}, interests: {} });
  const router = useRouter();
  const hydratedRef = useRef(false);

  // --- Auth Check ---
  useEffect(() => {
    hydratedRef.current = true;
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.role !== "admin") {
          alert("Access Denied: Admins only.");
          router.push("/home");
          return;
        }
        setIsAdmin(true);
        fetchMetadata(); // Load metadata on auth success
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Verifying Admin Access...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 text-white rounded-lg shadow-md shadow-violet-200">
              <Shield size={20} />
            </div>
            <h1 className="text-lg font-bold text-slate-800">Admin Console</h1>
          </div>
          <div className="flex gap-2">
             <TabButton active={activeTab === "upload"} onClick={() => setActiveTab("upload")} icon={<UploadCloud size={16} />} label="Upload Data" />
             <TabButton active={activeTab === "manage"} onClick={() => setActiveTab("manage")} icon={<List size={16} />} label="Manage Content" />
             <TabButton active={activeTab === "metadata"} onClick={() => setActiveTab("metadata")} icon={<Settings size={16} />} label="Metadata" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === "upload" && <UploadSection metadata={metadata} />}
        {activeTab === "manage" && <ManageSection metadata={metadata} />}
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
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active 
          ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200" 
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// --- SUB-COMPONENT: Upload Section (Syllabus & PYQ) ---
function UploadSection({ metadata }) {
  const [type, setType] = useState("syllabus"); // 'syllabus' | 'pyq'
  const [mode, setMode] = useState("manual"); // 'manual' | 'bulk'
  const [status, setStatus] = useState({ type: "", msg: "" });

  // Form State
  const [formData, setFormData] = useState({
    universityId: "", branchId: "", semester: 1, 
    subjectName: "", subjectCode: "", subjectType: "theory", 
    credits: 4, content: "", year: new Date().getFullYear(), questions: ""
  });
  const [bulkText, setBulkText] = useState("");

  const universities = Object.entries(metadata.universities);
  const branches = Object.entries(metadata.branches);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Uploading..." });

    try {
      const collectionName = type === "syllabus" ? "syllabi" : "pyqs";
      const baseData = {
        universityId: formData.universityId,
        branchId: formData.branchId,
        semester: Number(formData.semester),
        subjectName: formData.subjectName,
        createdAt: serverTimestamp()
      };

      const finalData = type === "syllabus" ? {
        ...baseData,
        subjectCode: formData.subjectCode,
        subjectType: formData.subjectType,
        credits: Number(formData.credits),
        content: formData.content // Ensure newlines are preserved
      } : {
        ...baseData,
        year: Number(formData.year),
        questions: formData.questions
      };

      await addDoc(collection(db, collectionName), finalData);
      setStatus({ type: "success", msg: `${type === "syllabus" ? "Syllabus" : "PYQ"} uploaded successfully!` });
      // Reset critical fields only
      setFormData(prev => ({ ...prev, subjectName: "", subjectCode: "", content: "", questions: "" }));
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Upload failed. Check console." });
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkText.trim()) return;
    setStatus({ type: "loading", msg: "Parsing and uploading..." });

    const lines = bulkText.split("\n").filter(l => l.trim());
    let successCount = 0;
    let failCount = 0;

    try {
      const batchPromises = lines.map(async (line) => {
        const parts = line.split("|").map(p => p.trim());
        // Simple validation based on part count
        
        if (type === "syllabus" && parts.length < 7) { failCount++; return; }
        if (type === "pyq" && parts.length < 6) { failCount++; return; }

        const baseData = {
          universityId: parts[0],
          branchId: parts[1],
          semester: Number(parts[2]),
          subjectName: parts[3],
          createdAt: serverTimestamp()
        };

        const finalData = type === "syllabus" ? {
          ...baseData,
          subjectType: parts[4],
          credits: Number(parts[5]),
          content: parts.slice(6).join("|").replace(/\\n/g, '\n') // Handle escaped newlines
        } : {
          ...baseData,
          year: Number(parts[4]),
          questions: parts.slice(5).join("|").replace(/\\n/g, '\n')
        };

        await addDoc(collection(db, type === "syllabus" ? "syllabi" : "pyqs"), finalData);
        successCount++;
      });

      await Promise.all(batchPromises);
      setStatus({ type: "success", msg: `Bulk complete: ${successCount} uploaded, ${failCount} failed.` });
      if (successCount > 0) setBulkText("");
    } catch (err) {
      setStatus({ type: "error", msg: "Bulk upload error." });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Type Toggle */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <button onClick={() => setType("syllabus")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${type==="syllabus" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>Syllabus</button>
          <button onClick={() => setType("pyq")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${type==="pyq" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>PYQ</button>
        </div>
        <div className="flex gap-2 text-sm">
          <button onClick={() => setMode("manual")} className={`px-3 py-1 rounded-md ${mode==="manual" ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-500"}`}>Manual Entry</button>
          <button onClick={() => setMode("bulk")} className={`px-3 py-1 rounded-md ${mode==="bulk" ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-500"}`}>Bulk Text</button>
        </div>
      </div>

      {/* Manual Form */}
      {mode === "manual" && (
        <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <FileText size={20} className="text-indigo-500"/> Add Single {type === "syllabus" ? "Syllabus" : "PYQ"}
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="input-field" required value={formData.universityId} onChange={e => setFormData({...formData, universityId: e.target.value})}>
                <option value="">Select University</option>
                {universities.map(([key, val]) => <option key={key} value={key}>{val.name} ({key})</option>)}
              </select>
              <select className="input-field" required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
                <option value="">Select Branch</option>
                {branches.map(([key, val]) => <option key={key} value={key}>{val} ({key})</option>)}
              </select>
              <select className="input-field" required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})}>
                 {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
              </select>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Subject Name (e.g. Data Structures)" className="input-field" required 
                value={formData.subjectName} onChange={e => setFormData({...formData, subjectName: e.target.value})} />
              
              {type === "syllabus" ? (
                <>
                  <input type="text" placeholder="Subject Code (Optional)" className="input-field" 
                    value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} />
                  <div className="flex gap-2">
                    <select className="input-field" value={formData.subjectType} onChange={e => setFormData({...formData, subjectType: e.target.value})}>
                      <option value="theory">Theory</option>
                      <option value="lab">Lab</option>
                      <option value="other">Other</option>
                    </select>
                    <input type="number" placeholder="Credits" className="input-field w-24" 
                      value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} />
                  </div>
                </>
              ) : (
                <input type="number" placeholder="Year (e.g. 2023)" className="input-field" required 
                  value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
              )}
           </div>

           <textarea 
             className="input-field h-40 font-mono text-sm" 
             placeholder={type === "syllabus" ? "Paste Syllabus Content here..." : "Paste Questions here..."}
             required
             value={type === "syllabus" ? formData.content : formData.questions}
             onChange={e => type === "syllabus" ? setFormData({...formData, content: e.target.value}) : setFormData({...formData, questions: e.target.value})}
           ></textarea>

           <div className="flex justify-end">
             <button type="submit" disabled={status.type === 'loading'} className="btn-primary">
               {status.type === 'loading' ? 'Saving...' : 'Save to Firestore'}
             </button>
           </div>
        </form>
      )}

      {/* Bulk Form */}
      {mode === "bulk" && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <Database size={20} className="text-indigo-500"/> Bulk {type === "syllabus" ? "Syllabus" : "PYQ"} Upload
           </h2>
           <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 font-mono border border-slate-100">
             <p className="font-bold mb-2">Format (Pipe Separated):</p>
             {type === "syllabus" 
               ? "UniID | BranchID | Sem | Subject | Type | Credits | Content (use \\n for newlines)" 
               : "UniID | BranchID | Sem | Subject | Year | Questions (use \\n for newlines)"}
             <p className="mt-2 text-xs text-slate-400">Example: BHU | CS | 1 | DSA | theory | 4 | Module 1: Intro...</p>
           </div>
           
           <textarea 
             className="input-field h-60 font-mono text-xs leading-relaxed whitespace-pre"
             placeholder="Paste bulk data here..."
             value={bulkText}
             onChange={e => setBulkText(e.target.value)}
           ></textarea>

           <div className="flex justify-end">
             <button onClick={handleBulkUpload} disabled={status.type === 'loading'} className="btn-primary">
               {status.type === 'loading' ? 'Processing...' : 'Parse & Upload'}
             </button>
           </div>
        </div>
      )}

      {/* Status Message */}
      {status.msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
           {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
           <span className="font-medium">{status.msg}</span>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: Manage Section ---
function ManageSection({ metadata }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ type: "syllabi", uni: "", branch: "", sem: "1" });
  const [loading, setLoading] = useState(false);

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
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      alert("Error fetching. Check if filters match valid data.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if(!confirm("Delete this item permanently?")) return;
    try {
      await deleteDoc(doc(db, filter.type, id));
      setItems(prev => prev.filter(i => i.id !== id));
    } catch(e) { alert("Delete failed"); }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
       <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <select className="input-field" value={filter.type} onChange={e => setFilter({...filter, type: e.target.value})}>
            <option value="syllabi">Syllabus</option>
            <option value="pyqs">PYQs</option>
          </select>
          <select className="input-field" value={filter.uni} onChange={e => setFilter({...filter, uni: e.target.value})}>
             <option value="">Select Uni</option>
             {Object.keys(metadata.universities).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select className="input-field" value={filter.branch} onChange={e => setFilter({...filter, branch: e.target.value})}>
             <option value="">Select Branch</option>
             {Object.keys(metadata.branches).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select className="input-field" value={filter.sem} onChange={e => setFilter({...filter, sem: e.target.value})}>
             {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
          </select>
          <button onClick={fetchContent} className="btn-primary md:col-span-1 col-span-2">Fetch</button>
       </div>

       <div className="space-y-2">
         {loading ? <div className="text-center text-slate-400 py-10">Loading...</div> : 
          items.length === 0 ? <div className="text-center text-slate-400 py-10">No records found.</div> :
          items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div>
                 <p className="font-bold text-slate-800">{item.subjectName}</p>
                 <p className="text-xs text-slate-500">
                   {filter.type === 'syllabi' ? `${item.subjectType} • ${item.credits} Credits` : `Year: ${item.year}`}
                 </p>
               </div>
               <button onClick={() => deleteItem(item.id)} className="p-2 text-rose-500 hover:bg-rose-100 rounded-full transition-colors">
                 <Trash2 size={16} />
               </button>
            </div>
          ))}
       </div>
    </div>
  );
}

// --- SUB-COMPONENT: Metadata Section ---
function MetadataSection({ metadata, refresh }) {
  const [jsonInput, setJsonInput] = useState("");
  const [target, setTarget] = useState("universities"); // universities | branches | skills | interests

  const handleUpdate = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      // Merge with existing
      await setDoc(doc(db, "metadata", target), parsed, { merge: true });
      alert("Metadata updated successfully!");
      setJsonInput("");
      refresh();
    } catch (e) {
      alert("Invalid JSON or Upload Failed");
    }
  };

  const getPlaceholder = () => {
    if (target === "branches") return '{"CSE": "Computer Science", "ME": "Mechanical"}';
    if (target === "skills") return '{"CSE": ["React", "Node.js"], "ME": ["AutoCAD", "SolidWorks"]}';
    if (target === "interests") return '{"CSE": ["Web Dev", "AI/ML"], "ME": ["Robotics", "Thermodynamics"]}';
    return '{"MIT": {"name": "MIT", "location": "USA"}}';
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Current Metadata</h3>
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
             <div>
               <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Universities</h4>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(metadata.universities).map(([k, v]) => (
                   <span key={k} className="px-2 py-1 bg-slate-100 text-xs rounded text-slate-600 font-mono" title={JSON.stringify(v)}>{k}</span>
                 ))}
               </div>
             </div>
             <div>
               <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Branches</h4>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(metadata.branches).map(([k, v]) => (
                   <span key={k} className="px-2 py-1 bg-slate-100 text-xs rounded text-slate-600 font-mono" title={v}>{k}</span>
                 ))}
               </div>
             </div>
             <div>
               <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Skills (By Branch)</h4>
               <div className="flex flex-wrap gap-2">
                 {Object.keys(metadata.skills).map((k) => (
                   <span key={k} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-mono border border-indigo-100" title={JSON.stringify(metadata.skills[k])}>{k}</span>
                 ))}
               </div>
             </div>
             <div>
               <h4 className="text-xs font-bold text-indigo-500 uppercase mb-2">Interests (By Branch)</h4>
               <div className="flex flex-wrap gap-2">
                 {Object.keys(metadata.interests).map((k) => (
                   <span key={k} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded font-mono border border-indigo-100" title={JSON.stringify(metadata.interests[k])}>{k}</span>
                 ))}
               </div>
             </div>
          </div>
       </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
            <Plus size={20} className="text-indigo-500"/> Add Metadata
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
             <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${target==="universities" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-slate-200"}`}>
               <input type="radio" name="metaTarget" checked={target==="universities"} onChange={() => setTarget("universities")} className="accent-indigo-600" /> Universities
             </label>
             <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${target==="branches" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-slate-200"}`}>
               <input type="radio" name="metaTarget" checked={target==="branches"} onChange={() => setTarget("branches")} className="accent-indigo-600" /> Branches
             </label>
             <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${target==="skills" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-slate-200"}`}>
               <input type="radio" name="metaTarget" checked={target==="skills"} onChange={() => setTarget("skills")} className="accent-indigo-600" /> <Zap size={14}/> Skills
             </label>
             <label className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${target==="interests" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-slate-200"}`}>
               <input type="radio" name="metaTarget" checked={target==="interests"} onChange={() => setTarget("interests")} className="accent-indigo-600" /> <Heart size={14}/> Interests
             </label>
          </div>

          <p className="text-xs text-slate-500 mb-2">Paste JSON object to merge. Keys are IDs (e.g., CSE).</p>
          <textarea 
            className="input-field h-60 font-mono text-xs" 
            placeholder={getPlaceholder()}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
          ></textarea>
          <button onClick={handleUpdate} className="btn-primary mt-4 w-full">Update Metadata</button>
       </div>
    </div>
  );
}