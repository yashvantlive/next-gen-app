"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [showTerms, setShowTerms] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-violet-200 selection:text-violet-900 font-sans text-slate-900">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">StudyApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-12 lg:py-20">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge removed as requested */}
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Master your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">
                  academic journey.
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                The all-in-one workspace for students. Plan tasks, track syllabus progress, and practice past questions—without the distractions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 transform hover:-translate-y-0.5"
                >
                  Start Studying Free
                </Link>
                <Link
                  href="/syllabus"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  Explore Syllabus
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span>No Ads</span>
                </div>
              </div>
            </div>

            {/* AESTHETIC DASHBOARD MOCKUP */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden transform transition-transform duration-700 hover:scale-[1.01] hover:rotate-1">
                
                {/* Mockup Header */}
                <div className="h-10 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">Good Morning!</h3>
                      <p className="text-slate-500 text-sm">You have 4 tasks pending today.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-violet-600">85%</div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Goal</div>
                    </div>
                  </div>

                  {/* Task List Mockup */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100 flex items-center justify-between group/item hover:bg-violet-50 transition-colors cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-violet-400 flex items-center justify-center"></div>
                        <div>
                          <div className="font-semibold text-slate-800">Physics: Chapter 5</div>
                          <div className="text-xs text-violet-500 font-medium">High Priority • 2 hrs</div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-white text-xs font-bold text-violet-700 shadow-sm">Do Now</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                        <div>
                          <div className="font-semibold text-slate-700">Math: PYQ 2023</div>
                          <div className="text-xs text-slate-400">Medium Priority • 45 min</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>Syllabus Completion</span>
                      <span>42%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-[42%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <section className="mt-16 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-base font-semibold text-violet-600 uppercase tracking-wide">Why StudyApp?</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to focus.</p>
              <p className="mt-4 text-lg text-slate-600">Clean design meets powerful tracking. No clutter, just clarity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<LayoutIcon />}
                title="Smart Planning" 
                desc="Prioritize tasks with smart tagging and effortless deadline management."
              />
              <FeatureCard 
                icon={<BookIcon />}
                title="Syllabus Tracker" 
                desc="Visual progress bars for every subject. Know exactly where you stand."
              />
              <FeatureCard 
                icon={<ClockIcon />}
                title="Past Papers" 
                desc="Access years of PYQs instantly. Organized by chapter and difficulty."
              />
              <FeatureCard 
                icon={<ShieldIcon />}
                title="Private & Secure" 
                desc="Your academic data is stored locally or encrypted. Your privacy matters."
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} StudyApp Inc.</p>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/about" className="hover:text-violet-600 transition-colors">About</Link>
            <button onClick={() => setShowTerms(true)} className="hover:text-violet-600 transition-colors">Terms</button>
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowTerms(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">Terms of Service</h3>
              <button onClick={() => setShowTerms(false)} className="text-slate-400 hover:text-slate-600">
                <CloseIcon />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh] space-y-4 text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-900">1. Acceptance of Terms</p>
              <p>By accessing and using StudyApp, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <p className="font-medium text-slate-900 mt-4">2. Use License</p>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on StudyApp's website for personal, non-commercial transitory viewing only.</p>
              
              <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-lg mt-6 border border-amber-100">
                <strong>Note:</strong> This is a demonstration project. No real legal data is processed here.
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setShowTerms(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUBCOMPONENTS & ICONS ---

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300">
      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-violet-600 mb-4 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

// Inline SVGs for zero dependencies
const LayoutIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.477 5.754 19 7.5 19s3.332.477 4.5 1.253v-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.477 18.247 19 16.5 19c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const CheckIcon = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);