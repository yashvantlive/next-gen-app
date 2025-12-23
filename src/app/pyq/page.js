"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, db } from "@/lib/firebaseClient";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  BookOpen, 
  Eye, 
  Download, 
  X,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function PYQPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [pyqData, setPyqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  
  // Modal State
  const [viewPaper, setViewPaper] = useState(null);

  const router = useRouter();
  const hydratedRef = useRef(false);

  // --- 1. Auth & Data Fetching ---
  useEffect(() => {
    hydratedRef.current = true;
    
    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }

      try {
        const p = await getUserProfile(u.uid);
        if (!p) { router.push("/onboarding"); return; }
        setProfile(p);

        // Fetch PYQs matching user's academic details
        await fetchPYQs(p);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const fetchPYQs = async (userProfile) => {
    try {
      // Query: Match Uni, Branch, and CURRENT Semester
      // (Students need PYQs for the subjects they are currently studying)
      const q = query(
        collection(db, "pyqs"),
        where("universityId", "==", userProfile.universityId || ""),
        where("branchId", "==", userProfile.branchId || ""),
        where("semester", "==", Number(userProfile.semester || 1))
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by Year (Latest first)
      data.sort((a, b) => b.year - a.year);

      setPyqData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch PYQs", error);
    }
  };

  // --- 2. Filter Logic ---
  useEffect(() => {
    let result = pyqData;

    if (selectedSubject !== "All") {
      result = result.filter(item => item.subjectName === selectedSubject);
    }

    if (searchTerm) {
      result = result.filter(item => 
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.year).includes(searchTerm)
      );
    }

    setFilteredData(result);
  }, [searchTerm, selectedSubject, pyqData]);

  // Extract unique subjects for filter dropdown
  const uniqueSubjects = ["All", ...new Set(pyqData.map(item => item.subjectName))];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Finding Papers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <Link href="/home" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft size={24} />
             </Link>
             <div>
               <h1 className="text-lg font-bold text-slate-800 leading-tight">Previous Papers</h1>
               <p className="text-[10px] text-slate-500 font-medium">
                 {profile?.branch} • Sem {profile?.semester}
               </p>
             </div>
           </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by subject or year..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 appearance-none w-full sm:w-48 cursor-pointer"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {uniqueSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PYQ Grid */}
        {filteredData.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-slate-600 font-bold">No papers found</h3>
            <p className="text-slate-400 text-sm mt-1">Try changing filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((paper) => (
              <div 
                key={paper.id} 
                onClick={() => setViewPaper(paper)}
                className="group bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                      {paper.year}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{paper.subjectName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <BookOpen size={10} /> Semester {paper.semester}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Eye size={18} />
                  </button>
                </div>
                
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2 font-mono">
                  {paper.questions?.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* PAPER VIEWER MODAL */}
      {viewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">{viewPaper.subjectName}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {viewPaper.year}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><BookOpen size={12}/> Sem {viewPaper.semester}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-full transition-all hidden sm:block" 
                  title="Print"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={() => setViewPaper(null)} 
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content (Paper) */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-xl mx-auto font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
                {viewPaper.questions}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">End of Paper</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}