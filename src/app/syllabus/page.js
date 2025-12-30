"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { onAuthChange, getUserProfile, db } from "../../lib/firebaseClient";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, addDoc, Timestamp, limit } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; 
import { 
  BookOpen, ChevronRight, ArrowLeft,
  Youtube, Search, Edit3, X, 
  FileQuestion, FileText, Trash2,
  Library, ChevronDown, Heart, Send, Filter,
  Sparkles, Check, GraduationCap,
  Star, Plus, Save
} from "lucide-react";

// --- FREEMIUM IMPORTS ---
import ShareButton from "../../components/ShareButton";
import LoginWall from "../../components/LoginWall";
import { useFreemiumAccess } from "../../hooks/useFreemiumAccess";

// --- UTILITY: Full Form Mapper ---
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

// --- SYLLABUS CONTENT COMPONENT ---
function SyllabusContent() {
  const [authLoading, setAuthLoading] = useState(true); 
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  
  // Admin & Resource States
  const [editingTopic, setEditingTopic] = useState(null); 
  const [videoInputs, setVideoInputs] = useState(Array(5).fill(""));
  const [pdfInputs, setPdfInputs] = useState(Array(5).fill(""));
  const [openUnit, setOpenUnit] = useState(0); 

  // --- Metadata State ---
  const [metadata, setMetadata] = useState({ universities: {}, branches: {} });
  
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

  const router = useRouter();
  const searchParams = useSearchParams(); 
  const sharedId = searchParams.get('id');

  const { allowAccess, loading: accessChecking } = useFreemiumAccess(selectedSubject?.id, profile);

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
    const savedFilters = localStorage.getItem("public_syllabus_filters");
    if (savedFilters) {
      setPublicFilters(JSON.parse(savedFilters));
    }
  }, []);

  // 4. SAVE FILTERS
  const handleFilterChange = (key, value) => {
    const newFilters = { ...publicFilters, [key]: value };
    setPublicFilters(newFilters);
    localStorage.setItem("public_syllabus_filters", JSON.stringify(newFilters));
  };

  // 5. AUTH CHECK
  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await getUserProfile(u.uid);
          setProfile(p);
          if (p?.role === 'admin') setAdminMode(true);
        } catch (err) { console.error(err); } 
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 6. DATA FETCHING LOGIC (Includes topicResources)
  const fetchData = async (isManualPublicSearch = false) => {
      setDataLoading(true);
      try {
        if (sharedId && !isManualPublicSearch) {
            const docRef = doc(db, "syllabi", sharedId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data(), topicResources: docSnap.data().topicResources || [] };
                setSelectedSubject(data);
            }
        } 
        else if (profile && !isManualPublicSearch) {
            const q = query(
              collection(db, "syllabi"),
              where("universityId", "==", profile.universityId || profile.university),
              where("branchId", "==", profile.branchId || profile.branch),
              where("semester", "==", Number(profile.semester)) 
            );
            const snap = await getDocs(q);
            setSyllabusData(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), topicResources: doc.data().topicResources || [] })));
        }
        else {
            if (!publicFilters.universityId || !publicFilters.branchId) {
                alert("Please select both University and Branch.");
                setDataLoading(false);
                return;
            }
            const q = query(
              collection(db, "syllabi"),
              where("universityId", "==", publicFilters.universityId),
              where("branchId", "==", publicFilters.branchId),
              where("semester", "==", Number(publicFilters.semester)) 
            );
            const snap = await getDocs(q);
            setSyllabusData(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), topicResources: doc.data().topicResources || [] })));
        }
      } catch (error) { 
          console.error("Fetch Error:", error); 
      } finally { 
          setDataLoading(false); 
      }
  };

  useEffect(() => {
    if (!authLoading) {
        if (sharedId) fetchData();
        else if (profile) fetchData();
    }
  }, [authLoading, profile, sharedId]);

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

  // --- PARSING & RESOURCE LOGIC ---
  const parseContentTree = (text) => {
    if (!text) return { units: [], references: [] };
    const lines = text.split('\n').filter(l => l.trim());
    const units = [];
    let references = [];
    const headerRegex = /^(UNIT|MODULE|CHAPTER|SECTION)\s+[\dIVX]+/i;
    const refRegex = /^(REFERENCE|TEXT\s*BOOK|BOOKS|LAB|GUIDE)/i;
    let currentContainer = null;
    lines.forEach(line => {
        const cleanLine = line.trim();
        if (refRegex.test(cleanLine)) {
            currentContainer = { title: cleanLine, topics: [] };
            references.push(currentContainer);
            return;
        } else if (headerRegex.test(cleanLine)) {
            currentContainer = { title: cleanLine, topics: [] };
            units.push(currentContainer);
            return;
        }
        if (currentContainer) {
            const parts = cleanLine.split(/,(?![^(]*\))/); 
            parts.forEach(part => {
                const topicText = part.trim();
                if (!topicText) return;
                const bracketMatch = topicText.match(/^(.*?)\s*\((.*)\)$/);
                if (bracketMatch) {
                    const main = bracketMatch[1].trim(); 
                    const subTopics = bracketMatch[2].split(',').map(s => s.trim()).filter(s => s);
                    currentContainer.topics.push({ text: main, isParent: true, children: subTopics });
                } else {
                    currentContainer.topics.push({ text: topicText, isParent: false });
                }
            });
        }
    });
    if (units.length === 0 && references.length === 0 && text) {
        units.push({ title: "Syllabus Overview", topics: text.split('\n').map(t => ({ text: t, isParent: false })) });
    }
    return { units, references };
  };

  const { units: parsedUnits } = useMemo(() => {
      if (!selectedSubject) return { units: [], references: [] };
      return parseContentTree(selectedSubject.content);
  }, [selectedSubject]);

  // --- RESOURCE MODAL FUNCTIONS ---
  const openResourceModal = (topicText) => {
      setEditingTopic(topicText);
      const existing = selectedSubject.topicResources?.filter(r => r.topic === topicText) || [];
      const vids = existing.filter(r => r.type === 'video').map(r => r.url);
      setVideoInputs([...vids, ...Array(5 - vids.length).fill("")].slice(0, 5));
      const pdfs = existing.filter(r => r.type === 'pdf').map(r => r.url);
      setPdfInputs([...pdfs, ...Array(5 - pdfs.length).fill("")].slice(0, 5));
  };

  const saveAllResources = async () => {
      if (!editingTopic) return;
      try {
          const otherResources = selectedSubject.topicResources?.filter(r => r.topic !== editingTopic) || [];
          const newVideos = videoInputs.filter(url => url.trim() !== "").map(url => ({ topic: editingTopic, url: url.trim(), type: 'video', id: Date.now() + Math.random() }));
          const newPdfs = pdfInputs.filter(url => url.trim() !== "").map(url => ({ topic: editingTopic, url: url.trim(), type: 'pdf', id: Date.now() + Math.random() }));
          const updatedResources = [...otherResources, ...newVideos, ...newPdfs];
          
          const docRef = doc(db, "syllabi", selectedSubject.id);
          await updateDoc(docRef, { topicResources: updatedResources });
          
          setSelectedSubject(prev => ({ ...prev, topicResources: updatedResources }));
          setEditingTopic(null);
      } catch (e) { console.error(e); alert("Error saving resources"); }
  };

  const getResourcesForTopic = (topicText) => selectedSubject.topicResources?.filter(r => r.topic === topicText) || [];
  
  const parseUnitHeader = (title) => {
      const match = title.match(/^(.*?)(\s*\(.*\))$/);
      if (match) return { main: match[1], meta: match[2].trim() };
      return { main: title, meta: null };
  };

  // --- TOPIC ROW (Displays Resources & Admin Edit) ---
  const TopicRow = ({ text, isSub = false, isRef = false }) => {
      const resources = getResourcesForTopic(text);
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(text + " " + selectedSubject.subjectName + " engineering")}`;
      
      return (
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between group py-3 border-b border-gray-50 ${isSub ? "ml-4 sm:ml-8 pl-4 border-l-2 border-indigo-100" : ""}`}>
              <div className="flex items-start gap-3 flex-1 pr-4 mb-2 sm:mb-0">
                  <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${resources.length > 0 ? "bg-green-500" : (isRef ? "bg-amber-500" : "bg-slate-300")}`}></div>
                  <span className={`text-sm ${isSub ? "text-slate-600" : "text-slate-800 font-medium"} leading-relaxed hover:text-violet-700 transition-colors cursor-default`}>{text}</span>
              </div>
              
              {/* RESOURCE ICONS */}
              <div className="flex items-center gap-2 pl-5 sm:pl-0 flex-wrap">
                  {resources.map((res, idx) => (
                      <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all border ${res.type === 'pdf' ? "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100" : "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100"}`} title={res.type === 'pdf' ? "Open Document" : "Watch Video"}>
                        {res.type === 'pdf' ? <FileText size={14}/> : <Youtube size={14}/>}
                        <span className="hidden sm:inline">{res.type === 'pdf' ? 'PDF' : 'Video'}</span>
                      </a>
                  ))}
                  
                  {/* Public Search */}
                  <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-violet-600 p-1.5 transition-colors" title="Search Topic">
                    <Search size={16} />
                  </a>
                  
                  {/* Admin Edit Trigger */}
                  {adminMode && (
                    <button onClick={() => openResourceModal(text)} className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full transition-colors" title="Add Resources">
                        <Edit3 size={16} />
                    </button>
                  )}
              </div>
          </div>
      );
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center animate-pulse text-slate-400 font-bold">Loading...</div>;

  // --- VIEW 1: SUBJECT DETAIL (CONTENT) ---
  if (selectedSubject) {
      const showWall = !dataLoading && !accessChecking && !profile && !allowAccess;
      return (
          <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
              <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 h-20 flex flex-col sm:flex-row items-center justify-between">
                      <button onClick={() => setSelectedSubject(null)} className="absolute left-4 top-4 sm:static p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"><ArrowLeft size={22}/></button>
                      <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
                          <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight line-clamp-1">{selectedSubject.subjectName}</h1>
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase"><span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded border border-violet-100">{selectedSubject.semester}th Sem</span><span>•</span><span>{selectedSubject.credits} Credits</span></div>
                      </div>
                      <div className="absolute right-4 top-4 sm:static"><ShareButton type="syllabus" data={selectedSubject} urlId={selectedSubject.id} customClass="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 border-none shadow-none"/></div>
                  </div>
              </div>
              
              {showWall ? (
                  <div className="py-20 flex justify-center"><LoginWall /></div>
              ) : (
                  <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
                      {parsedUnits.map((unit, idx) => {
                          const { main, meta } = parseUnitHeader(unit.title);
                          return (
                              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
                                  <div onClick={() => setOpenUnit(openUnit === idx ? null : idx)} className="w-full flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50 transition-colors select-none">
                                      <h3 className="text-base font-bold text-slate-800 pr-4">{main}</h3>
                                      <div className="flex items-center gap-3">{meta && <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">{meta}</span>}<div className={`p-1.5 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${openUnit === idx ? 'rotate-180' : ''}`}><ChevronDown size={20} /></div></div>
                                  </div>
                                  {openUnit === idx && (
                                      <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-1 duration-200">
                                          <div className="h-px w-full bg-slate-100 mb-3"></div>
                                          <div className="flex flex-col">
                                              {unit.topics.map((node, tIdx) => (<React.Fragment key={tIdx}><TopicRow text={node.text} />{node.children && node.children.map((child, cIdx) => <TopicRow key={`${tIdx}-${cIdx}`} text={child} isSub={true} />)}</React.Fragment>))}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              )}

              {/* RESOURCE EDITING MODAL (ADMIN ONLY) */}
              {editingTopic && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900">Add Resources: <span className="text-violet-600">{editingTopic}</span></h3>
                            <button onClick={() => setEditingTopic(null)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                        </div>
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Video Inputs */}
                            <div className="space-y-3">
                                <label htmlFor="video-url-0" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><Youtube size={14} className="text-rose-500"/> YouTube Links</label>
                                {videoInputs.map((val, i) => (
                                    <input key={i} id={`video-url-${i}`} name={`video-url-${i}`} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" placeholder={`Video URL ${i+1}`} value={val} onChange={e => { const n = [...videoInputs]; n[i] = e.target.value; setVideoInputs(n); }}/>
                                ))}
                            </div>
                            {/* PDF Inputs */}
                            <div className="space-y-3">
                                <label htmlFor="pdf-url-0" className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider"><FileText size={14} className="text-orange-500"/> PDF Links</label>
                                {pdfInputs.map((val, i) => (
                                    <input key={i} id={`pdf-url-${i}`} name={`pdf-url-${i}`} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" placeholder={`PDF URL ${i+1}`} value={val} onChange={e => { const n = [...pdfInputs]; n[i] = e.target.value; setPdfInputs(n); }}/>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setEditingTopic(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg">Cancel</button>
                            <button onClick={saveAllResources} className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2"><Save size={16}/> Save Resources</button>
                        </div>
                    </div>
                </div>
              )}
          </div>
      );
  }

  // --- VIEW 2: DASHBOARD / LANDING ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      
      {/* BRAND HEADER */}
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
              <ArrowLeft size={18} /> Back Home
            </Link>
            {!profile && (
                <Link
                href="/auth/login"
                className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                >
                Login
                </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-6xl mx-auto px-6">
        
        {/* --- A. PUBLIC USER VIEW: HERO --- */}
        {!profile && (
            <section className="text-center mb-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-6">
                    <Sparkles size={12} /> Syllabus Decoded
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Your exact university syllabus.<br/>
                    <span className="text-violet-600">No more confusion.</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Stop downloading random PDFs. Find your branch, semester, and topic in seconds.
                </p>
            </section>
        )}

        {/* --- B. LOGGED IN VIEW: CLEAN HEADER --- */}
        {profile && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Syllabus</h1>
                        <p className="text-slate-500 mt-2 flex items-center gap-2 text-sm sm:text-base">
                            <GraduationCap size={18} className="text-violet-600"/>
                            <span className="font-semibold text-slate-700">{profile.branch}</span> 
                            <span className="text-slate-300">•</span> 
                            <span>Semester {profile.semester}</span>
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2 self-start md:self-auto">
                        <Check size={14} /> Auto-Synced with Profile
                    </div>
                 </div>
                 <div className="h-px w-full bg-slate-100"></div>
            </div>
        )}

        <div className="max-w-5xl mx-auto">
            
            {/* PUBLIC FILTER */}
            {!profile && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                    
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="text-violet-600" size={20}/>
                        <h3 className="text-lg font-bold text-slate-800">Select Your Course</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
                        {/* University */}
                        <div>
                            <label htmlFor="syllabus-university-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">University</label>
                            <div className="relative">
                                <select id="syllabus-university-select" name="syllabus-university-select"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer truncate" 
                                    value={publicFilters.universityId} 
                                    onChange={e => handleFilterChange("universityId", e.target.value)}
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
                            <label htmlFor="syllabus-branch-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Branch</label>
                            <div className="relative">
                                <select id="syllabus-branch-select" name="syllabus-branch-select"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer truncate" 
                                    value={publicFilters.branchId} 
                                    onChange={e => handleFilterChange("branchId", e.target.value)}
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

                        {/* Semester */}
                        <div>
                            <label htmlFor="syllabus-semester-select" className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">Semester</label>
                            <div className="relative">
                                <select id="syllabus-semester-select" name="syllabus-semester-select"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 appearance-none cursor-pointer" 
                                    value={publicFilters.semester} 
                                    onChange={e => handleFilterChange("semester", e.target.value)}
                                >
                                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                            </div>
                        </div>

                        <button onClick={() => fetchData(true)} className="h-[46px] bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0">
                            <Search size={18}/> Find Syllabus
                        </button>
                    </div>
                </div>
            )}

            {/* RESULTS GRID */}
            {dataLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"></div>)}</div>
            ) : syllabusData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm"><FileQuestion size={32}/></div>
                    <h3 className="text-lg font-bold text-slate-700">No Syllabus Found</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-2">
                        {profile 
                            ? "Your syllabus for this semester hasn't been uploaded yet." 
                            : "Select your course above to view syllabus."
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {syllabusData.map((subject) => (
                        <div key={subject.id} onClick={() => setSelectedSubject(subject)} className="group bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:shadow-violet-100/50 hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 text-slate-50 opacity-50 group-hover:text-violet-50 transition-colors transform rotate-12">
                                <BookOpen size={100} />
                            </div>
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-wider border border-slate-100 group-hover:bg-violet-50 group-hover:text-violet-600 group-hover:border-violet-100 transition-colors">
                                    {subject.subjectType || "Theory"}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-snug relative z-10 group-hover:text-violet-700 transition-colors">
                                {subject.subjectName}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                    {subject.subjectCode}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-400"/> {subject.credits} Credits
                                </span>
                                <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-20 pt-10 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-violet-600 text-2xl">❝</span>
                    Student Stories
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setIsAllReviewsOpen(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                      More Reviews
                  </button>
                  <button onClick={() => { if (!user) router.push("/auth/login"); else setIsReviewOpen(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg hover:bg-violet-100 transition-colors border border-violet-100">
                      <Plus size={14} /> Write a Review
                  </button>
                </div>
            </div>

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

        {/* --- SHARE CARD --- */}
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

      {/* --- REVIEW MODALS --- */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsReviewOpen(false)}/>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                   <div>
                      <label htmlFor="syllabus-review-message" className="text-xs font-bold text-slate-500 uppercase">Rating</label>
                      <div className="flex gap-2 mt-1">
                         {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={()=>setReviewForm({...reviewForm, rating: r})} className={`p-1 ${reviewForm.rating >= r ? 'text-amber-400' : 'text-slate-300'}`}><Star fill="currentColor" size={24}/></button>
                         ))}
                      </div>
                   </div>
                   <div>
                      <label htmlFor="syllabus-review-message" className="text-xs font-bold text-slate-500 uppercase">Message</label>
                      <textarea id="syllabus-review-message" name="syllabus-review-message" className="w-full mt-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-200 outline-none" rows="4" placeholder="How has You Learn helped you?" value={reviewForm.message} onChange={e => setReviewForm({...reviewForm, message: e.target.value})}></textarea>
                   </div>
                   <button onClick={handleReviewSubmit} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">Submit Review</button>
                </div>
            </div>
        </div>
      )}

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

      {/* --- FOOTER (PUBLIC ONLY) --- */}
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

// --- MAIN EXPORT ---
export default function SyllabusPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <SyllabusContent />
    </Suspense>
  );
}