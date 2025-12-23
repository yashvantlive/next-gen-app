"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, db } from "@/lib/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Beaker, 
  Layout, 
  X, 
  ChevronRight, 
  Clock, 
  Award,
  AlertCircle,
  Mail,
  FileQuestion,
  GraduationCap,
  FileText // ✅ Added missing import
} from "lucide-react";

export default function SyllabusPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const hydratedRef = useRef(false);
  const router = useRouter();

  // --- Auth & Profile Loading ---
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

      try {
        const p = await getUserProfile(u.uid);
        if (!p) {
          router.push("/onboarding");
          return;
        }
        setProfile(p);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  // --- Syllabus Fetching Logic ---
  useEffect(() => {
    if (!profile) return;

    async function fetchSyllabus() {
      setLoadingSyllabus(true);
      setFetchError(null);

      try {
        const targetUniId = profile.universityId || profile.university;
        const targetBranchId = profile.branchId || profile.branch;
        const targetSemester = Number(profile.semester);

        if (!targetUniId || !targetBranchId || isNaN(targetSemester)) {
            console.warn("SyllabusPage: Missing profile fields for query.");
            setFetchError("Incomplete profile data. Please update your academic details.");
            setLoadingSyllabus(false);
            return;
        }

        const q = query(
          collection(db, "syllabi"),
          where("universityId", "==", targetUniId),
          where("branchId", "==", targetBranchId),
          where("semester", "==", targetSemester) 
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSyllabusData(data);
      } catch (error) {
        console.error("Error fetching syllabus:", error);
        setFetchError("Could not load syllabus. Please try again later.");
      } finally {
        setLoadingSyllabus(false);
      }
    }

    fetchSyllabus();
  }, [profile]);

  // --- Helper to group subjects ---
  const groupedSyllabus = {
    theory: syllabusData.filter(s => s.subjectType === "theory"),
    lab: syllabusData.filter(s => s.subjectType === "lab"),
    other: syllabusData.filter(s => s.subjectType !== "theory" && s.subjectType !== "lab")
  };

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const displayBranch = profile?.branch || profile?.branchId || "Branch";
  const displaySem = profile?.semester || "?";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200">
                <BookOpen size={18} />
             </div>
             <h1 className="text-lg font-bold text-slate-800">Syllabus</h1>
           </div>
           
           <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><GraduationCap size={14} /> {displayBranch}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Sem {displaySem}</span>
           </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* --- Hero Section --- */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl shadow-violet-200">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen size={140} />
           </div>
           <div className="relative z-10">
              <h2 className="text-2xl font-bold">Course Curriculum</h2>
              <p className="text-violet-100 mt-1 text-sm max-w-lg leading-relaxed">
                Access the detailed syllabus for your current semester. Review modules, credits, and subject codes all in one place.
              </p>
           </div>
        </div>

        {/* --- Fetch Error State --- */}
        {fetchError && !loadingSyllabus && (
            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <div>
                    <h3 className="text-sm font-bold">Data Issue</h3>
                    <p className="text-sm mt-1">{fetchError}</p>
                </div>
            </div>
        )}

        {/* --- Loading Syllabus State --- */}
        {loadingSyllabus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1,2,3,4].map(i => (
                <div key={i} className="h-40 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
             ))}
          </div>
        ) : syllabusData.length === 0 ? (
          
          /* --- CUSTOM EMPTY STATE WITH EMAIL ACTION --- */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
               <FileQuestion size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Syllabus Not Found</h3>
             <p className="text-slate-500 text-sm mt-2 max-w-sm text-center leading-relaxed">
               We couldn't find the syllabus for <strong>{displayBranch} (Sem {displaySem})</strong>. It might not be uploaded yet.
             </p>
             
             <div className="mt-8 flex flex-col items-center gap-3">
                <a 
                  href={`mailto:yashvantislive@gmail.com?subject=Request Syllabus: ${displayBranch} Sem ${displaySem}&body=Hi Admin,%0D%0A%0D%0AI couldn't find the syllabus for:%0D%0AUniversity: ${profile?.university || profile?.universityId}%0D%0ABranch: ${displayBranch}%0D%0ASemester: ${displaySem}%0D%0A%0D%0APlease upload it when possible.%0D%0A%0D%0AThanks!`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 hover:-translate-y-0.5"
                >
                   <Mail size={16} />
                   Request via Email
                </a>
                <p className="text-xs text-slate-400">
                  Contact admin at <span className="font-mono text-slate-500">yashvantislive@gmail.com</span>
                </p>
             </div>
          </div>

        ) : (
          
          /* --- Syllabus Content --- */
          <div className="space-y-10 animate-fade-in-up">
            
            {/* Theory Subjects */}
            {groupedSyllabus.theory.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                   <div className="h-8 w-1 bg-violet-500 rounded-full"></div>
                   <h3 className="text-lg font-bold text-slate-800">Theory Subjects</h3>
                   <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full border border-violet-200">
                     {groupedSyllabus.theory.length}
                   </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSyllabus.theory.map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={() => setSelectedSubject(subject)} 
                      icon={<BookOpen size={20} />}
                      accentColor="text-violet-600"
                      accentBg="bg-violet-50"
                      borderColor="group-hover:border-violet-200"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Lab Subjects */}
            {groupedSyllabus.lab.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                   <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                   <h3 className="text-lg font-bold text-slate-800">Laboratories</h3>
                   <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                     {groupedSyllabus.lab.length}
                   </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSyllabus.lab.map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={() => setSelectedSubject(subject)}
                      icon={<Beaker size={20} />}
                      accentColor="text-emerald-600"
                      accentBg="bg-emerald-50"
                      borderColor="group-hover:border-emerald-200"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Subjects */}
            {groupedSyllabus.other.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                   <div className="h-8 w-1 bg-amber-500 rounded-full"></div>
                   <h3 className="text-lg font-bold text-slate-800">Electives & Others</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSyllabus.other.map(subject => (
                    <SubjectCard 
                      key={subject.id} 
                      subject={subject} 
                      onClick={() => setSelectedSubject(subject)}
                      icon={<Layout size={20} />}
                      accentColor="text-amber-600"
                      accentBg="bg-amber-50"
                      borderColor="group-hover:border-amber-200"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* --- View Syllabus Modal --- */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
             onClick={() => setSelectedSubject(null)}
           />
           
           <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${
                          selectedSubject.subjectType === 'theory' 
                            ? 'bg-violet-50 text-violet-700 border-violet-100' 
                            : selectedSubject.subjectType === 'lab'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                       }`}>
                          {selectedSubject.subjectType}
                       </span>
                       {selectedSubject.subjectCode && (
                         <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">
                           {selectedSubject.subjectCode}
                         </span>
                       )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                       {selectedSubject.subjectName}
                    </h3>
                 </div>
                 <button 
                   onClick={() => setSelectedSubject(null)}
                   className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto">
                 {/* Meta Info */}
                 <div className="flex gap-6 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                          <Award size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credits</p>
                          <p className="text-sm font-bold text-slate-900">{selectedSubject.credits || "N/A"}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                          <Clock size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Updated</p>
                          <p className="text-sm font-bold text-slate-900">
                             {selectedSubject.createdAt?.seconds 
                                ? new Date(selectedSubject.createdAt.seconds * 1000).toLocaleDateString() 
                                : "Recently"}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Syllabus Content */}
                 <div className="prose prose-sm prose-slate max-w-none">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <FileText size={14} /> Syllabus Content
                    </h4>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100 font-medium text-sm">
                       {selectedSubject.content || "No detailed content available."}
                    </div>
                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                 <button 
                   onClick={() => setSelectedSubject(null)}
                   className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                 >
                   Close
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// --- Subcomponent: Subject Card ---
function SubjectCard({ subject, onClick, icon, accentColor, accentBg, borderColor }) {
  return (
    <div className={`group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col h-full cursor-pointer ${borderColor}`} onClick={onClick}>
       
       <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${accentBg} ${accentColor}`}>
             {icon}
          </div>
          {subject.credits && (
             <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
               {subject.credits} Credits
             </span>
          )}
       </div>

       <div className="flex-1">
          {subject.subjectCode && (
             <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">{subject.subjectCode}</p>
          )}
          <h4 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-violet-700 transition-colors">
             {subject.subjectName}
          </h4>
       </div>

       <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400 group-hover:text-violet-600 transition-colors">
          <span className="text-xs font-semibold">View Syllabus</span>
          <div className="p-1 rounded-full group-hover:bg-violet-50 transition-colors">
            <ChevronRight size={16} />
          </div>
       </div>
    </div>
  );
}