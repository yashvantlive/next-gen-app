"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, signOut } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, 
  Edit, 
  Shield, 
  User, 
  BookOpen, 
  Calendar, 
  Award, 
  Layers, 
  Hash,
  ChevronLeft,
  GraduationCap
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const hydratedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  function handleLogout() {
    if(confirm("Are you sure you want to log out?")) {
        signOut().then(() => router.push("/auth/login")).catch((e) => console.error("Signout failed", e));
    }
  }

  useEffect(() => {
    if (!hydratedRef.current) return;

    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }
      setAuthUser(u);
      try {
        const p = await getUserProfile(u.uid);
        if (!p) {
          router.push("/onboarding");
          return;
        }
        setProfile(p);
        setIsAdmin(p?.role === "admin");
      } catch (err) {
        console.error("Error fetching profile:", err);
        const msg = (err && err.message) || String(err);
        if (/permission|insufficient/i.test(msg)) {
          setProfile(null);
          setFetchError("Permission denied: check Firestore security rules.");
        } else {
          setFetchError(msg);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Loading profile...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Link href="/home" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <ChevronLeft size={24} />
             </Link>
             <h1 className="text-lg font-bold text-slate-800">My Profile</h1>
           </div>
           
           <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors text-sm font-medium"
           >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
           </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* --- HERO SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
           {/* Cover Banner */}
           <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           </div>

           <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start -mt-12">
                 
                 {/* Avatar */}
                 <div className="relative">
                    {(profile?.photoURL || authUser?.photoURL) ? (
                        <img
                        src={profile?.photoURL || authUser.photoURL}
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-violet-100 flex items-center justify-center text-violet-600">
                        <User size={40} />
                        </div>
                    )}
                 </div>

                 {/* User Info */}
                 <div className="flex-1 pt-2 sm:pt-14 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{profile?.displayName || "Student"}</h2>
                            {/* Replaced Email with Role Badge */}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    <GraduationCap size={12} />
                                    Student
                                </span>
                                {isAdmin && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                                        <Shield size={12} />
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push("/onboarding")}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Edit size={16} />
                                <span>Edit Profile</span>
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => router.push("/admin")}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white hover:bg-violet-700 rounded-lg text-sm font-medium shadow-sm shadow-violet-200 transition-all"
                                >
                                    <Shield size={16} />
                                    <span>Admin Panel</span>
                                </button>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* LEFT COLUMN: Academic Info */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <BookOpen size={20} className="text-violet-600" />
                    Academic Details
                 </h3>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <DetailItem label="University / Board" value={profile?.university} icon={<Award size={16} />} />
                    <DetailItem label="Branch / Stream" value={profile?.branch || profile?.stream} icon={<Layers size={16} />} />
                    <DetailItem label="Current Year" value={profile?.year ? `Year ${profile.year}` : null} icon={<Calendar size={16} />} />
                    <DetailItem label="Semester" value={profile?.semester ? `Semester ${profile.semester}` : null} icon={<Hash size={16} />} />
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Skills & Status */}
           <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                 <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Skills & Interests
                 </h3>

                 {(profile?.skills || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                       {profile.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100"
                          >
                            {skill}
                          </span>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm">No skills added yet.</p>
                        <button onClick={() => router.push("/onboarding")} className="text-violet-600 text-xs font-semibold hover:underline mt-1">Add Skills</button>
                    </div>
                 )}
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Account Status</h3>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                      <span className="text-sm font-semibold">Active</span>
                  </div>
              </div>
           </div>
        </div>

        {fetchError && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 animate-fade-in">
             <Shield size={20} />
             <p className="text-sm font-medium">{fetchError}</p>
          </div>
        )}

      </main>
    </div>
  );
}

// --- SUBCOMPONENT ---
function DetailItem({ label, value, icon }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                {icon && <span className="opacity-50">{icon}</span>}
                {label}
            </span>
            <span className="text-base font-medium text-slate-900 truncate">
                {value || <span className="text-slate-400 italic">Not set</span>}
            </span>
        </div>
    );
}