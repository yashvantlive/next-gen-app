"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { onAuthChange } from "../lib/firebaseClient"; // Firebase listener check path
import { 
  Check, 
  ArrowRight, 
  FileText, 
  FolderOpen, 
  XCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ListTodo, 
  UserSquare,
  ChevronRight,
  ChevronDown
} from "lucide-react";

// --- NOTE: Metadata cannot be exported from a "use client" component in Next.js.
// Move this object to src/app/layout.js if you need SEO titles for this page.
const metadataConfig = {
  title: 'YOU LEARN | Organize Your Engineering Syllabus & PYQs',
  description: 'Stop drowning in PDFs. A calm, organized system for Indian engineering students to track syllabus, solve PYQs, and plan daily study without the chaos.',
  openGraph: {
    title: 'Stop drowning in PDFs. Start studying with a system.',
    description: 'Your engineering syllabus, PYQs, and daily plan — organized in one place.',
    url: 'https://youlearn.community',
    siteName: 'YOU LEARN',
    locale: 'en_IN',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'YOU LEARN',
  url: 'https://youlearn.community',
  description: 'Free syllabus tracking, PYQ database, and study planner for Indian engineering students.',
  audience: 'Engineering Students',
  keywords: 'engineering syllabus, previous year question papers, engineering PYQs, semester planner, AKU, RGPV',
  isAccessibleForFree: true
};

export default function LandingPage() {
  const router = useRouter();

  // --- AUTO REDIRECT LOGIC ---
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        // If user is logged in, redirect to Dashboard immediately
        router.push("/home");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      
      {/* Inject JSON-LD */}
      <Script
        id="ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-violet-200">
              Y
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">YOU LEARN</span>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="/auth/login" 
              className="hidden sm:block text-slate-500 hover:text-violet-700 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-full hover:bg-violet-700 transition-all shadow-md shadow-violet-200 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        
        {/* --- SECTION 1: HERO --- */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 mb-6 leading-tight">
              Stop drowning in PDFs.<br/>
              <span className="text-violet-600">Start studying with a system.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Your engineering syllabus, PYQs, and daily plan — organized in one place. <br className="hidden sm:block"/>
              Built for Indian engineering students. Zero chaos.
            </p>
          </div>

          {/* VISUAL COMPARISON */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch mb-16">
            
            {/* LEFT: The Mess */}
            <div className="bg-red-50/50 rounded-3xl border border-red-100 p-8 relative overflow-hidden group min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-200"></div>
              <div className="mb-8">
                <h3 className="text-red-900 font-semibold flex items-center gap-2">
                  <XCircle size={20} className="text-red-500"/> The Old Way
                </h3>
                <p className="text-red-700/70 text-sm mt-1">This is how most students study.</p>
              </div>
              
              <div className="relative h-64 w-full">
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-sm border border-red-100 rotate-[-6deg] w-48 animate-pulse-slow">
                  <div className="flex items-center gap-2 text-red-400 mb-2"><FileText size={16}/> <span className="text-xs font-mono text-slate-400">PDF</span></div>
                  <div className="h-2 w-3/4 bg-slate-100 rounded mb-1"></div>
                  <div className="text-xs font-bold text-slate-700">Syllabus_FINAL_v3.pdf</div>
                </div>
                
                <div className="absolute top-20 right-8 bg-white p-3 rounded-lg shadow-sm border border-red-100 rotate-[3deg] w-40 opacity-80">
                  <div className="flex items-center gap-2 text-green-600 mb-2"><div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px]">W</div> <span className="text-xs text-slate-400">WhatsApp</span></div>
                  <div className="text-xs text-slate-600">"Bhai PYQ bhejo koi..."</div>
                </div>

                <div className="absolute bottom-4 left-12 bg-white p-3 rounded-lg shadow-sm border border-red-100 rotate-[-2deg] w-52 opacity-90">
                  <div className="flex items-center gap-2 text-violet-400 mb-2"><FolderOpen size={16}/> <span className="text-xs text-slate-400">Drive</span></div>
                  <div className="text-xs font-bold text-slate-700">New Folder (4)</div>
                  <div className="text-[10px] text-slate-400">Empty</div>
                </div>
              </div>
            </div>

            {/* RIGHT: YOU LEARN */}
            <div className="bg-violet-50/50 rounded-3xl border border-violet-100 p-8 relative overflow-hidden min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-violet-500"></div>
              <div className="mb-8">
                <h3 className="text-violet-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-violet-600"/> The YOU LEARN Way
                </h3>
                <p className="text-violet-700/70 text-sm mt-1">This is how a system works.</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg shadow-violet-900/5 border border-slate-100 overflow-hidden h-64 flex flex-col">
                <div className="h-10 border-b border-slate-50 flex items-center px-4 justify-between">
                  <div className="flex gap-4">
                    <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-violet-100"></div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-1/3 border-r border-slate-50 p-4 space-y-3 bg-slate-50/30">
                    <div className="h-2 w-2/3 bg-violet-200 rounded-full"></div>
                    <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="flex-1 p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-slate-800 rounded"></div>
                      <div className="h-6 px-3 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center">On Track</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-violet-50 border border-violet-100">
                        <div className="w-4 h-4 rounded border-2 border-violet-500 bg-violet-500 text-white flex items-center justify-center"><Check size={10}/></div>
                        <div className="h-2 w-32 bg-slate-600 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg border border-slate-100">
                        <div className="w-4 h-4 rounded border-2 border-slate-300"></div>
                        <div className="h-2 w-24 bg-slate-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Primary CTA */}
          <div className="text-center">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-xl shadow-xl shadow-violet-200 transition-transform hover:-translate-y-1"
            >
              Organize My Semester <ArrowRight size={20} className="text-amber-300" />
            </Link>
            
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><Check size={16} className="text-violet-600"/> No signup needed to explore</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-violet-600"/> Works offline (PWA)</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-violet-600"/> No ads. No noise.</span>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: THE PROBLEM --- */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Does this feel familiar?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard 
              icon={<FileText className="text-slate-400" />}
              title="PDF Overload"
              text="Your syllabus is buried inside a 47-page PDF you downloaded in week one. Finding one topic takes 10 minutes."
            />
            <ProblemCard 
              icon={<UserSquare className="text-slate-400" />}
              title="PYQ Chaos"
              text="Previous year questions scattered across 8 WhatsApp groups. Half the files don't open. The other half are blurry."
            />
            <ProblemCard 
              icon={<ListTodo className="text-slate-400" />}
              title="Fake Productivity"
              text="Three to-do apps installed. None of them understand your semester or exam dates."
            />
          </div>

          <div className="text-center mt-12">
            <p className="text-xl font-medium text-slate-700">
              Engineering is hard.<br/>
              <span className="text-slate-400">Your study setup shouldn’t be.</span>
            </p>
          </div>
        </section>

        {/* --- SECTION 3: THE SOLUTION (Linked to Landing Pages) --- */}
        <section className="bg-slate-50 py-24 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need. Nothing you don’t.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* A) SYLLABUS */}
              <ToolCard 
                href="/syllabus"
                title="Syllabus Navigator"
                desc="Your exact university syllabus. Click any topic to see related PYQs."
                tag="Public Access"
              >
                <div className="bg-white rounded-lg border border-slate-200 p-4 w-full h-full shadow-sm flex flex-col gap-2 group-hover:border-violet-300 transition-colors">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <ChevronDown size={16}/> Semester 3
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center gap-2 text-violet-700 text-sm bg-violet-50 p-1.5 rounded cursor-pointer">
                      <ChevronDown size={14}/> Data Structures
                    </div>
                    <div className="pl-6 space-y-1.5 border-l-2 border-slate-100 ml-2">
                      <div className="text-xs text-slate-500 hover:text-violet-600 cursor-pointer flex justify-between">
                        1.1 Arrays & Linked Lists
                        <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-400">Theory</span>
                      </div>
                      <div className="text-xs text-slate-500 hover:text-violet-600 cursor-pointer">1.2 Stacks & Queues</div>
                    </div>
                  </div>
                </div>
              </ToolCard>

              {/* B) PYQ */}
              <ToolCard 
                href="/pyq"
                title="PYQ Database"
                desc="15,000+ PYQs. Properly organized. No downloads. No junk files."
                tag="Public Access"
              >
                <div className="bg-white rounded-lg border border-slate-200 p-4 w-full h-full shadow-sm flex flex-col gap-3 group-hover:border-violet-300 transition-colors">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 flex items-center gap-2">
                      <Search size={12} className="text-slate-400"/>
                      <div className="h-1.5 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-400"><Filter size={12}/></div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">2023</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Mid-Sem</span>
                  </div>
                  <div className="space-y-2 mt-1">
                    <div className="p-2 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
                      <div className="h-1.5 w-3/4 bg-slate-700 rounded mb-1.5"></div>
                      <div className="h-1 w-1/2 bg-slate-300 rounded"></div>
                    </div>
                    <div className="p-2 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
                      <div className="h-1.5 w-2/3 bg-slate-700 rounded mb-1.5"></div>
                      <div className="h-1 w-1/3 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </ToolCard>

              {/* C) DAILY PLANNER (Links to New Landing Page) */}
              <ToolCard 
                href="/todo-study-planner"
                title="Daily Planner"
                desc="A daily plan that understands your syllabus. Small steps. No overwhelm."
                tag="Interactive Demo"
              >
                <div className="bg-white rounded-lg border border-slate-200 p-4 w-full h-full shadow-sm flex flex-col gap-3 group-hover:border-violet-300 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-slate-700">Today's Focus</span>
                    <span className="text-[10px] text-slate-400">2 Pending</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 group/item cursor-pointer">
                      <div className="w-4 h-4 rounded border border-slate-300 group-hover/item:bg-violet-500 group-hover/item:border-violet-500 transition-colors"></div>
                      <div className="h-1.5 w-32 bg-slate-600 rounded"></div>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-4 h-4 rounded border bg-violet-500 border-violet-500 flex items-center justify-center text-white"><Check size={10}/></div>
                      <div className="h-1.5 w-24 bg-slate-400 rounded line-through"></div>
                    </div>
                  </div>
                </div>
              </ToolCard>

              {/* D) RESUME BUILDER (Links to New Landing Page) */}
              <ToolCard 
                href="/resume-builder"
                title="Resume Builder"
                desc="Your resume grows as you study. Auto-formatted for internships."
                tag="See Samples"
              >
                <div className="bg-white rounded-lg border border-slate-200 p-4 w-full h-full shadow-sm flex flex-col gap-3 group-hover:border-violet-300 transition-colors relative overflow-hidden">
                  <div className="flex gap-3 items-center mb-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-slate-800 rounded"></div>
                      <div className="h-1.5 w-12 bg-slate-400 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded group-hover:bg-violet-50 transition-colors"></div>
                    <div className="h-1.5 w-5/6 bg-slate-100 rounded group-hover:bg-violet-50 transition-colors"></div>
                    <div className="h-1.5 w-full bg-slate-100 rounded group-hover:bg-violet-50 transition-colors"></div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-bold rounded uppercase">
                    ATS Ready
                  </div>
                </div>
              </ToolCard>

            </div>
          </div>
        </section>

        {/* --- SECTION 4: SOCIAL PROOF --- */}
        <section className="max-w-6xl mx-auto px-6 py-24 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Built by students who were tired of the mess.</h2>
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-3xl font-bold text-violet-700">2,147</p>
                  <p className="text-sm text-slate-500">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-violet-700">15k+</p>
                  <p className="text-sm text-slate-500">PYQs Organized</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-500">4.8/5</p>
                  <p className="text-sm text-slate-500">User Rating</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <TestimonialCard 
                name="Vikram" 
                uni="AKU, Patna" 
                text="I stopped using 3 different apps. This just works. The syllabus tree is exactly what I needed."
              />
              <TestimonialCard 
                name="Sanya" 
                uni="RGPV, Bhopal" 
                text="Finally found clear PYQs. No ads, no fake download buttons. Saved me during mid-sems."
              />
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FINAL PUSH (UPGRADED DESIGN) --- */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          {/* Replaced Heavy Purple Box with Premium White Card + Gradient Border */}
          <div className="relative bg-white rounded-3xl p-10 sm:p-14 shadow-2xl shadow-violet-200 border border-slate-100 overflow-hidden">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Start when you’re ready. <br/>We’ll be here.
              </h2>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                Everything is free. Use it to check a single syllabus topic, or organize your whole semester. It's up to you.
              </p>
              
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-slate-200"
              >
                Build My Study Space <ArrowRight size={18} />
              </Link>
              
              <p className="text-xs font-semibold text-violet-600 mt-4 tracking-wide">
                TAKES 30 SECONDS • NO EMAIL REQUIRED TO EXPLORE
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> Free forever</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> No credit card</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500"/> Your data stays local</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER (FIXED ALIGNMENT) */}
      <footer className="bg-white border-t border-slate-200 py-12 pb-32">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          
          {/* LEFT: Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">Y</div>
              <span className="font-bold text-slate-900">YOU LEARN</span>
            </div>
            <div className="text-slate-400 text-xs">
              © {new Date().getFullYear()} YOU LEARN
            </div>
          </div>
          
          {/* RIGHT: Links */}
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link href="/about" className="hover:text-violet-700 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-violet-700 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-violet-700 transition-colors">Privacy</Link>
          </div>
          
        </div>
      </footer>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProblemCard({ icon, title, text }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function ToolCard({ href, title, desc, tag, children }) {
  return (
    <Link href={href} className="group block">
      <div className="h-full bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-violet-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="h-40 bg-slate-50 rounded-xl mb-6 overflow-hidden flex items-center justify-center p-4">
          {children}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{title}</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">{tag}</span>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
        <div className="mt-4 flex items-center text-violet-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
          Open Tool <ChevronRight size={16}/>
        </div>
      </div>
    </Link>
  );
}

function TestimonialCard({ name, uni, text }) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
      <p className="text-slate-700 italic mb-4">"{text}"</p>
      <div>
        <p className="font-bold text-slate-900 text-sm">{name}</p>
        <p className="text-xs text-slate-500">{uni}</p>
      </div>
    </div>
  );
}