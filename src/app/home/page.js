"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile } from "@/lib/firebaseClient";
import { 
  BookOpen, 
  Calendar, 
  Star, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  Clock, 
  Layout,
  ArrowRight,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const hydratedRef = useRef(false);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- HEADER --- */}
      {/* Reduced height from h-16 to h-14 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
           {/* Left: Logo */}
           <div className="flex items-center gap-2">
            {/* Reduced logo size from w-8 to w-7 */}
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-violet-200 text-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 hidden sm:inline-block">StudyApp</span>
          </div>

          {/* Right: Profile Button */}
          <Link 
            href="/profile"
            className="group flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                {profile?.displayName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">View Profile</p>
            </div>
            
            <div className="relative">
              {profile?.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-violet-300 transition-colors" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs border border-transparent group-hover:border-violet-200">
                  {profile?.displayName?.charAt(0) || <User size={16} />}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* --- WELCOME HERO --- */}
        {/* Reduced padding, font sizes, and icon size */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-lg shadow-violet-200/50">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen size={140} />
           </div>
           
           <div className="relative z-10">
             <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">
               {greeting}, {profile?.displayName?.split(' ')[0]}!
             </h1>
             <p className="text-violet-100 max-w-lg text-base leading-relaxed">
               Ready to make progress? You are currently in <strong>Sem {profile?.semester}</strong> of <strong>{profile?.branch}</strong>.
             </p>
           </div>
        </div>

        {/* --- STATS GRID --- */}
        {/* Reduced gap from 6 to 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            label="Current Semester" 
            value={`Sem ${profile?.semester || 1}`} 
            icon={<GraduationCap size={20} />} 
            color="text-violet-600"
            bg="bg-violet-50"
          />
          <StatCard 
            label="Academic Year" 
            value={`Year ${profile?.year || 1}`} 
            icon={<Calendar size={20} />} 
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <StatCard 
            label="Skills Tracked" 
            value={(profile?.skills || []).length} 
            icon={<Star size={20} />} 
            color="text-amber-500"
            bg="bg-amber-50"
          />
        </div>

        {/* --- DASHBOARD NAVIGATION --- */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layout size={18} className="text-slate-400" />
            Your Dashboard
          </h2>
          
          {/* Reduced gap from 6 to 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NavCard 
              href="/syllabus" 
              title="Syllabus" 
              desc="Track curriculum" 
              icon={<BookOpen size={20} />} 
              color="text-emerald-600"
              bg="bg-emerald-50"
              border="group-hover:border-emerald-200"
            />
            <NavCard 
              href="/pyq" 
              title="Past Papers" 
              desc="Practice questions" 
              icon={<FileText size={20} />} 
              color="text-blue-600"
              bg="bg-blue-50"
              border="group-hover:border-blue-200"
            />
            <NavCard 
              href="/todo" 
              title="Task Board" 
              desc="Manage todos" 
              icon={<CheckSquare size={20} />} 
              color="text-violet-600"
              bg="bg-violet-50"
              border="group-hover:border-violet-200"
            />
             <NavCard 
              href="/resume" 
              title="Resume Builder" 
              desc="Create professional CV" 
              icon={<Layout size={20} />} 
              color="text-rose-600"
              bg="bg-rose-50"
              border="group-hover:border-rose-200"
            />
          </div>
        </div>

        {/* --- RECENT ACTIVITY / PROMO --- */}
        {/* Reduced gap from 6 to 4 */}
        <div className="grid md:grid-cols-2 gap-4">
           <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                 <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                    <Clock size={18} />
                 </div>
                 <h3 className="font-bold text-slate-800 text-base">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                 <Link href="/todo" className="block w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700">
                    → Add a new task for today
                 </Link>
                 <Link href="/profile" className="block w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700">
                    → Update your profile details
                 </Link>
              </div>
           </div>

           <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg flex flex-col justify-center">
              <h3 className="font-bold text-base mb-1">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-3 leading-snug">Check out the latest exam schedules and university notices in the community section.</p>
              <button className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors border border-white/10 w-fit">
                 Coming Soon
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function StatCard({ label, value, icon, color, bg }) {
  return (
    // Reduced padding from p-6 to p-4, reduced rounded from 2xl to xl
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
      {/* Reduced icon box size w-12 -> w-10 */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function NavCard({ href, title, desc, icon, color, bg, border }) {
  return (
    <Link 
      href={href} 
      // Reduced padding p-6 -> p-5
      className={`group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${border}`}
    >
      {/* Reduced icon box size w-12 -> w-10 */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${bg} ${color}`}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
        {title}
        <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </Link>
  );
}