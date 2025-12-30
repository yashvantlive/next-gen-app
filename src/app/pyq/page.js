"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, db } from "../../lib/firebaseClient";
import { collection, query, where, getDocs, doc, getDoc, addDoc, Timestamp, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  FileText, Search, Filter, Calendar, 
  BookOpen, Eye, X, 
  ChevronLeft, Sparkles, GraduationCap, 
  Check, ChevronDown, Printer, Heart,
  Star, Plus, User
} from "lucide-react";
import Link from "next/link";

// --- IMPORTS FOR SHARE ---
import ShareButton from "../../components/ShareButton";

// --- UTILITY: Full Form Mapper (For Reviews) ---
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

export default function PYQPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [pyqData, setPyqData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // --- Metadata State ---
  const [metadata, setMetadata] = useState({ universities: {}, branches: {} });

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // --- Public Filter State ---
  const [publicFilters, setPublicFilters] = useState({
      universityId: "",
      branchId: "",
      semester: "1"
  });
  
  // --- Reviews State ---
  const [reviews, setReviews] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, message: "" });

  // Modal State
  const [viewPaper, setViewPaper] = useState(null);

  const router = useRouter();
  const hydratedRef = useRef(false);

  // 1. FETCH METADATA
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const uniSnap = await getDoc(doc(db, "metadata", "universities"));
        const branchSnap = await getDoc(doc(db, "metadata", "branches"));
        
        setMetadata({
          universities: uniSnap.exists() ? uniSnap.data() : {},
          branches: branchSnap.exists() ? branchSnap.data() : {}
        });
      } catch (err) {
        console.error("Metadata fetch error:", err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. FETCH REVIEWS
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const qReviews = query(
          collection(db, 'testimonials'), 
          where("approved", "==", true), 
          limit(10)
        );
        const snapReviews = await getDocs(qReviews);
        const fetchedReviews = snapReviews.docs.map(d => ({ id: d.id, ...d.data() }));
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Reviews fetch error:", err);
      }
    };
    fetchReviews();
  }, []);

  // 3. LOAD PUBLIC FILTERS
  useEffect(() => {
    const savedFilters = localStorage.getItem("public_pyq_filters");
    if (savedFilters) {
      setPublicFilters(JSON.parse(savedFilters));
    }
  }, []);

  // 4. AUTH & DATA FETCHING
  useEffect(() => {
    hydratedRef.current = true;
    
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await getUserProfile(u.uid);
          setProfile(p);
          if(p) await fetchPYQs(p, false); 
        } catch (err) { console.error(err); }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 5. FETCH PYQs FUNCTION
  const fetchPYQs = async (userProfile, isPublicSearch = false) => {
    setLoading(true);
    try {
      let q;

      if (isPublicSearch) {
        if (!publicFilters.universityId || !publicFilters.branchId) {
            alert("Please select University and Branch.");
            setLoading(false);
            return;
        }
        localStorage.setItem("public_pyq_filters", JSON.stringify(publicFilters));

        q = query(
            collection(db, "pyqs"),
            where("universityId", "==", publicFilters.universityId),
            where("branchId", "==", publicFilters.branchId),
            where("semester", "==", Number(publicFilters.semester))
        );
      } else {
        q = query(
            collection(db, "pyqs"),
            where("universityId", "==", userProfile.universityId || ""),
            where("branchId", "==", userProfile.branchId || ""),
            where("semester", "==", Number(userProfile.semester || 1))
        );
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      data.sort((a, b) => b.year - a.year);

      setPyqData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Failed to fetch PYQs", error);
    } finally {
        setLoading(false);
    }
  };

  // 6. CLIENT-SIDE FILTERING
  useEffect(() => {
    let result = pyqData;

    if (selectedSubject !== "All") {
      result = result.filter(item => item.subjectName === selectedSubject);
    }
    if (selectedYear !== "All") {
        result = result.filter(item => String(item.year) === selectedYear);
    }
    if (selectedType !== "All") {
        result = result.filter(item => item.type === selectedType || item.examType === selectedType);
    }
    if (searchTerm) {
      result = result.filter(item => 
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.year).includes(searchTerm)
      );
    }

    setFilteredData(result);
  }, [searchTerm, selectedSubject, selectedYear, selectedType, pyqData]);

  // 7. HANDLE REVIEW SUBMIT
  const handleReviewSubmit = async () => {
    if (!user) {
        alert("Please login to submit a review.");
        router.push("/auth/login");
        return;
    }
    if (!reviewForm.message.trim()) return;
    try {
      await addDoc(collection(db, 'testimonials'), {
        userId: user.uid,
        name: profile?.displayName || user.displayName || "User",
        uni: profile?.universityId || "Unknown",
        branch: profile?.branchId || "Unknown",
        semester: profile?.semester ? String(profile.semester) : "",
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

  const uniqueSubjects = ["All", ...new Set(pyqData.map(item => item.subjectName))];
  const uniqueYears = ["All", ...new Set(pyqData.map(item => item.year))].sort((a,b) => b-a);
  const uniqueTypes = ["All", "Mid Sem", "End Sem", "Supply"]; 

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 selection:bg-violet-100 selection:text-violet-900">
      
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
            {!profile && (
               <Link href="/auth/login" className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
                 Login
               </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">

        {/* --- 2. PUBLIC HERO & FILTERS --- */}
        {!profile && (
           <>
            <section className="text-center mb-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-6">
                    <Sparkles size={12} /> Exam Archive
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Master your exams with <br/>
                    <span className="text-violet-600">organized PYQs.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    10,000+ Previous Year Questions. Filtered by your university pattern.
                </p>
            </section>

            {/* PUBLIC FILTER CARD */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="text-violet-600" size={20}/>
                    <h3 className="text-lg font-bold text-slate-800">Select Your Course</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                    {/* Uni */}
                    <div>
                        <label htmlFor="pyq-university-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">University</label>
                        <div className="relative">
                            <select id="pyq-university-select" name="pyq-university-select"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer truncate" 
                                value={publicFilters.universityId} 
                                onChange={e => setPublicFilters({...publicFilters, universityId: e.target.value})}
                            >
                                <option value="">Select Uni</option>
                                {Object.entries(metadata.universities)
                                    .sort(([, a], [, b]) => (typeof a === 'object' ? a.name : a).localeCompare(typeof b === 'object' ? b.name : b))
                                    .map(([code, uniData]) => (
                                    <option key={code} value={code}>
                                        {typeof uniData === 'object' ? uniData.name : uniData} ({code})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    {/* Branch */}
                    <div>
                        <label htmlFor="pyq-branch-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Branch</label>
                        <div className="relative">
                            <select id="pyq-branch-select" name="pyq-branch-select"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer truncate" 
                                value={publicFilters.branchId} 
                                onChange={e => setPublicFilters({...publicFilters, branchId: e.target.value})}
                            >
                                <option value="">Select Branch</option>
                                {Object.entries(metadata.branches)
                                    .sort(([, a], [, b]) => (typeof a === 'object' ? a.name : a).localeCompare(typeof b === 'object' ? b.name : b))
                                    .map(([code, branchData]) => (
                                    <option key={code} value={code}>
                                        {typeof branchData === 'object' ? branchData.name : branchData} ({code})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    {/* Sem */}
                    <div>
                        <label htmlFor="pyq-semester-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Semester</label>
                        <div className="relative">
                            <select id="pyq-semester-select" name="pyq-semester-select"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer" 
                                value={publicFilters.semester} 
                                onChange={e => setPublicFilters({...publicFilters, semester: e.target.value})}
                            >
                                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <button onClick={() => fetchPYQs(null, true)} className="h-[46px] bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0">
                        <Search size={18}/> Find Papers
                    </button>
                </div>
            </div>
           </>
        )}

        {/* --- 3. LOGGED IN HEADER --- */}
        {profile && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Previous Questions</h1>
                        <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm sm:text-base">
                            <GraduationCap size={18} className="text-violet-600"/>
                            <span className="font-semibold text-slate-700">{profile.branch}</span> 
                            <span className="text-slate-300">•</span> 
                            <span>Semester {profile.semester}</span>
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2 self-start md:self-auto">
                        <Check size={14} /> Auto-Synced
                    </div>
                 </div>
                 <div className="h-px w-full bg-slate-100"></div>
            </div>
        )}

        {/* --- 4. DATA CONTROLS --- */}
        {(filteredData.length > 0 || pyqData.length > 0) && (
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input id="pyq-search" name="pyq-search"
                    type="text" 
                    placeholder="Search subject..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="relative min-w-[140px]">
                        <select id="pyq-filter-subject" name="pyq-filter-subject"
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 appearance-none cursor-pointer font-medium text-slate-700"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                        {uniqueSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                    </div>
                    <div className="relative min-w-[100px]">
                        <select id="pyq-filter-year" name="pyq-filter-year"
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 appearance-none cursor-pointer font-medium text-slate-700"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        >
                         <option value="All">Year: All</option>
                        {uniqueYears.map(yr => (yr !== "All" && <option key={yr} value={yr}>{yr}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                    </div>
                    <div className="relative min-w-[130px]">
                        <select id="pyq-filter-type" name="pyq-filter-type"
                        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 appearance-none cursor-pointer font-medium text-slate-700"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        >
                         <option value="All">Type: All</option>
                        {uniqueTypes.map(type => (type !== "All" && <option key={type} value={type}>{type}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
                    </div>
                </div>
            </div>
        )}

        {/* --- 5. RESULTS GRID --- */}
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>)}</div>
        ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                    <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Papers Found</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-2">
                    {!profile && pyqData.length === 0 ? "Select your course above to find papers." : "Try adjusting your filters or search."}
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {filteredData.map((paper) => (
                <div 
                    key={paper.id} 
                    onClick={() => setViewPaper(paper)}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-700 flex flex-col items-center justify-center font-bold text-xs border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <span className="text-[10px] opacity-70">YEAR</span>
                                <span className="text-base">{paper.year}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                                    {paper.type || paper.examType || "End Sem"}
                                </span>
                            </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-violet-600 transition-colors">
                            <Eye size={20} />
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-violet-700 transition-colors">
                        {paper.subjectName}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                        <BookOpen size={12}/> Semester {paper.semester}
                    </p>
                    
                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono line-clamp-2 leading-relaxed">
                        {paper.questions?.substring(0, 100) || "No preview available..."}
                    </div>
                </div>
                ))}
            </div>
        )}

        {/* --- 6. REVIEWS SECTION (Visible to ALL) --- */}
        <div className="mt-20 pt-10 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
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
                    onClick={() => {
                        if (!user) router.push("/auth/login");
                        else setIsReviewOpen(true);
                    }} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-100 transition-colors border border-violet-100"
                  >
                      <Plus size={14} /> Write a Review
                  </button>
                </div>
            </div>

            {/* Displaying Top 3 Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
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

        {/* --- 7. SHARE CARD (RESIZED & PUBLIC) --- */}
        <div className="mt-16 mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white text-center shadow-xl shadow-rose-200 overflow-hidden relative max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                <Heart size={200} className="absolute -top-10 -right-10 rotate-12 fill-white" />
                <Heart size={100} className="absolute bottom-0 left-0 -translate-x-10 translate-y-10 -rotate-12 fill-white" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
                   <Heart size={24} fill="white" className="animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-black tracking-tight">Love using YOU LEARN?</h3>
                
                <div className="max-w-md mx-auto">
                    <p className="text-pink-100 text-sm italic leading-relaxed font-medium">
                        "Knowledge increases by sharing, not by saving."
                    </p>
                </div>

                <div className="mt-3">
                    <ShareButton 
                        type="app" 
                        customClass="px-6 py-2 bg-white text-rose-600 font-bold text-sm rounded-full hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                    />
                </div>
            </div>
        </div>

      </main>

      {/* --- MODALS --- */}

      {/* VIEW PAPER */}
      {viewPaper && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-sm border border-violet-100">
                    {viewPaper.year}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg leading-tight">{viewPaper.subjectName}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{viewPaper.type || "End Sem"}</span>
                        <span>•</span>
                        <span>Semester {viewPaper.semester}</span>
                    </div>
                  </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hidden sm:block" 
                  title="Print"
                >
                  <Printer size={20} />
                </button>
                <button 
                  onClick={() => setViewPaper(null)} 
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="max-w-2xl mx-auto font-serif text-slate-800 leading-relaxed whitespace-pre-wrap text-base">
                {viewPaper.questions}
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">End of Paper • YOU LEARN</p>
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
                      <div className="text-xs font-bold text-slate-500 uppercase">Rating</div>
                      <div className="flex gap-2 mt-1">
                         {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={()=>setReviewForm({...reviewForm, rating: r})} className={`p-1 ${reviewForm.rating >= r ? 'text-amber-400' : 'text-slate-300'}`}><Star fill="currentColor" size={24}/></button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <label htmlFor="pyq-review-message" className="text-xs font-bold text-slate-500 uppercase">Message</label>
                      <textarea id="pyq-review-message" name="pyq-review-message" className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-200 outline-none" rows="4" placeholder="How has You Learn helped you?" value={reviewForm.message} onChange={e => setReviewForm({...reviewForm, message: e.target.value})}></textarea>
                   </div>
                   <button onClick={handleReviewSubmit} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Submit Review</button>
                </div>
            </div>
        </div>
      )}

      {/* ALL REVIEWS MODAL */}
      {isAllReviewsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 w-full sm:max-w-2xl h-[85vh] sm:h-[80vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
                <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <span className="text-violet-600 text-xl">❝</span> All Reviews ({reviews.length})
                    </h3>
                    <button onClick={() => setIsAllReviewsOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
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

      {/* --- 8. FOOTER (PUBLIC ONLY) --- */}
      {!profile && (
        <footer className="bg-white border-t border-slate-200 py-12 pb-32">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">Y</div>
                <span className="font-bold text-slate-900">YOU LEARN</span>
                </div>
                <div className="text-slate-400 text-xs">
                © {new Date().getFullYear()} YOU LEARN
                </div>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
                <Link href="/about" className="hover:text-violet-700 transition-colors">About</Link>
                <Link href="/contact" className="hover:text-violet-700 transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-violet-700 transition-colors">Privacy</Link>
            </div>
            </div>
        </footer>
      )}

    </div>
  );
}