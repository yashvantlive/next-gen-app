"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, setUserProfile, db } 
from "../../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Layers, 
  ChevronRight, 
  Check, 
  Zap, 
  Heart,
  ArrowRight,
  ChevronLeft,
  FastForward // ✅ Imported for mobile skip icon
} from "lucide-react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [existingRole, setExistingRole] = useState("user");
  const [isEditing, setIsEditing] = useState(false); 
  const hydratedRef = useRef(false);
  
  // Metadata State
  const [metadata, setMetadata] = useState({ 
    universities: {}, 
    branches: {}, 
    skills: {}, 
    interests: {} 
  });
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Form State
  const [form, setForm] = useState({
    universityId: "",
    branchId: "",
    year: 1,
    semester: 1,
  });
  
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [interestSuggestions, setInterestSuggestions] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  // --- 1. Initial Load (Auth & Metadata) ---
  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    let unsubscribe = () => {};

    const init = async () => {
      unsubscribe = onAuthChange(async (u) => {
        if (!u) {
          router.push("/auth/login");
          return;
        }
        setUser(u);

        try {
          // B. Fetch All Metadata
          const uniSnap = await getDoc(doc(db, "metadata", "universities"));
          const branchSnap = await getDoc(doc(db, "metadata", "branches"));
          const skillSnap = await getDoc(doc(db, "metadata", "skills"));
          const interestSnap = await getDoc(doc(db, "metadata", "interests"));
          
          const metaData = {
            universities: uniSnap.exists() ? uniSnap.data() : {},
            branches: branchSnap.exists() ? branchSnap.data() : {},
            skills: skillSnap.exists() ? skillSnap.data() : {},
            interests: interestSnap.exists() ? interestSnap.data() : {},
          };
          setMetadata(metaData);

          // C. Fetch Existing Profile
          const profile = await getUserProfile(u.uid);
          if (profile) {
            setIsEditing(true);
            setForm({
              universityId: profile.universityId || profile.university || "",
              branchId: profile.branchId || profile.branch || "",
              year: Number(profile.year) || 1,
              semester: Number(profile.semester) || 1,
            });
            setSkills(profile.skills || []);
            setInterests(profile.interests || []);
            setExistingRole(profile.role || "user");
          } else {
            setIsEditing(false);
          }
        } catch (err) {
          console.error("Init failed:", err);
          setError("Failed to load data. Please check your connection.");
        } finally {
          setLoading(false);
          setLoadingMeta(false);
        }
      });
    };

    init();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  // --- 2. Update Suggestions based on Branch ---
  useEffect(() => {
    if (form.branchId) {
        setSkillSuggestions(metadata.skills[form.branchId] || []);
        setInterestSuggestions(metadata.interests[form.branchId] || []);
    } else {
        setSkillSuggestions([]);
        setInterestSuggestions([]);
    }
  }, [form.branchId, metadata]);

  // --- 3. Handlers ---
  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!form.universityId || !form.branchId) {
        setError("Please select your University and Branch.");
        setSaving(false);
        return;
      }
      
      if (isEditing && skills.length === 0) {
        setError("Please add at least one skill since you are editing.");
        setSaving(false);
        return;
      }

      const payload = {
        universityId: form.universityId,
        branchId: form.branchId,
        year: Number(form.year),
        semester: Number(form.semester),
        skills: skills,
        interests: interests,
        role: existingRole,
        updatedAt: new Date().toISOString(),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        university: metadata.universities[form.universityId]?.name || form.universityId,
        branch: metadata.branches[form.branchId] || form.branchId
      };

      await setUserProfile(user.uid, payload);
      setSuccess("Profile saved successfully!");
      
      setTimeout(() => {
        router.push("/profile");
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
      setSaving(false);
    }
  }

  // --- 4. Helpers: Sorted Data ---
  const sortedUniversities = Object.entries(metadata.universities).sort((a, b) => 
    (a[1]?.name || "").localeCompare(b[1]?.name || "")
  );
  
  const sortedBranches = Object.entries(metadata.branches).sort((a, b) => 
    (a[1] || "").localeCompare(b[1] || "")
  );

  if (loading || loadingMeta) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Setting up workspace...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- NEW HEADER --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ✅ LEFT: Updated Branding (Purple Y + Uppercase Text) */}
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm shadow-violet-200">
               <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight uppercase">YOU LEARN</span>
        </div>

        {/* ✅ RIGHT: Skip & Save Buttons (Responsive Skip) */}
        <div className="flex items-center gap-3">
            {/* Skip Button - Responsive Icon/Text */}
            <button 
                type="button"
                onClick={() => router.push('/profile')} 
                className="px-2 sm:px-3 py-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors rounded-lg hover:bg-slate-50 flex items-center gap-1"
            >
                {/* Mobile: Icon + Short text */}
                <FastForward size={16} className="sm:hidden" />
                <span className="sm:hidden">Skip</span>
                {/* Desktop: Full text */}
                <span className="hidden sm:inline">Skip for now</span>
            </button>
            
            <button 
                type="submit"
                form="onboarding-form"
                disabled={saving}
                className={`px-4 sm:px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                <span className="hidden sm:inline">{saving ? "Saving..." : "Save & Continue"}</span>
                <span className="sm:hidden">{saving ? "Saving..." : "Save"}</span>
                {!saving && <ArrowRight size={16} />}
            </button>
        </div>
      </header>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-200/40 blur-[100px] rounded-full"></div>
         <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-200/40 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative max-w-2xl mx-auto space-y-6 pt-24 px-4">
        
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-slate-900">{isEditing ? "Edit Profile" : "Welcome, Student!"}</h1>
           <p className="text-slate-500 mt-2">{isEditing ? "Update your details below." : "Let's get you started with the basics."}</p>
        </div>

        <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* CARD 1: Academic Information (ALWAYS VISIBLE) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <GraduationCap className="text-violet-600" size={20} />
                    <h2 className="font-bold text-slate-800">Academic Details</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-1.5">
                        <label htmlFor="onboarding-university-select" className="text-sm font-semibold text-slate-700">University / College</label>
                        <div className="relative">
                            <select id="onboarding-university-select" name="onboarding-university-select"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all appearance-none"
                            value={form.universityId} 
                            onChange={(e) => updateField("universityId", e.target.value)}
                            >
                            <option value="">Select University</option>
                            {/* SORTED OPTIONS */}
                            {sortedUniversities.map(([id, data]) => (
                                <option key={id} value={id}>{data.name}</option>
                            ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="onboarding-branch-select" className="text-sm font-semibold text-slate-700">Branch / Course</label>
                        <div className="relative">
                            <select id="onboarding-branch-select" name="onboarding-branch-select"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all appearance-none"
                            value={form.branchId} 
                            onChange={(e) => updateField("branchId", e.target.value)}
                            >
                            <option value="">Select Branch</option>
                            {/* SORTED OPTIONS */}
                            {sortedBranches.map(([id, name]) => (
                                <option key={id} value={id}>{name} ({id})</option>
                            ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label htmlFor="onboarding-year-select" className="text-sm font-semibold text-slate-700">Year</label>
                            <div className="relative">
                                <select id="onboarding-year-select" name="onboarding-year-select"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all appearance-none"
                                value={form.year} 
                                onChange={(e) => updateField("year", Number(e.target.value))}
                                >
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="onboarding-semester-select" className="text-sm font-semibold text-slate-700">Semester</label>
                            <div className="relative">
                                <select id="onboarding-semester-select" name="onboarding-semester-select"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all appearance-none"
                                value={form.semester} 
                                onChange={(e) => updateField("semester", Number(e.target.value))}
                                >
                                {[1,2,3,4,5,6,7,8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                                </select>
                                <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 2: Skills & Interests (ONLY VISIBLE IF EDITING) */}
            {isEditing && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Zap className="text-amber-500" size={20} />
                        <h2 className="font-bold text-slate-800">Skills & Interests</h2>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Skills Section */}
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                <span>Your Skills</span>
                                <span className="text-xs font-normal text-slate-400">{skills.length} selected</span>
                            </div>
                            
                            <div className="min-h-[50px] p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-wrap gap-2">
                                {skills.length === 0 && <span className="text-slate-400 text-sm">Select skills below...</span>}
                                {skills.map(skill => (
                                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-violet-100 text-violet-700 rounded-full text-xs font-bold shadow-sm animate-in zoom-in duration-200">
                                    {skill}
                                    <button type="button" onClick={() => setSkills(prev => prev.filter(s => s !== skill))} className="hover:text-violet-900"><Check size={12} /></button>
                                    </span>
                                ))}
                            </div>

                            {/* Suggestions */}
                            {skillSuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suggested for your branch</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skillSuggestions.map((s) => {
                                            const isSelected = skills.includes(s);
                                            return (
                                                <button
                                                key={s}
                                                type="button"
                                                onClick={() => setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                                    isSelected 
                                                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600'
                                                }`}
                                                >
                                                {isSelected ? '✓ ' : '+ '}{s}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Interests Section */}
                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                <span>Your Interests</span>
                                <span className="text-xs font-normal text-slate-400">{interests.length} selected</span>
                            </div>
                            
                            <div className="min-h-[50px] p-3 border border-slate-200 rounded-xl bg-slate-50 flex flex-wrap gap-2">
                                {interests.length === 0 && <span className="text-slate-400 text-sm">Select interests below...</span>}
                                {interests.map(int => (
                                    <span key={int} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-pink-100 text-pink-600 rounded-full text-xs font-bold shadow-sm animate-in zoom-in duration-200">
                                    {int}
                                    <button type="button" onClick={() => setInterests(prev => prev.filter(i => i !== int))} className="hover:text-pink-800"><Check size={12} /></button>
                                    </span>
                                ))}
                            </div>

                            {/* Suggestions */}
                            {interestSuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Suggested for you</p>
                                    <div className="flex flex-wrap gap-2">
                                        {interestSuggestions.map((s) => {
                                            const isSelected = interests.includes(s);
                                            return (
                                                <button
                                                key={s}
                                                type="button"
                                                onClick={() => setInterests((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                                    isSelected 
                                                    ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200' 
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600'
                                                }`}
                                                >
                                                {isSelected ? '✓ ' : '+ '}{s}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error & Submit */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></div>
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={saving} 
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-violet-200 transition-all ${
                    success ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-violet-600 hover:bg-violet-700 hover:-translate-y-1'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {success ? "Success! Redirecting..." : saving ? "Saving Profile..." : "Save & Continue"}
            </button>

        </form>
      </div>
    </div>
  );
}