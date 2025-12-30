"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, ArrowRight, FileText, Download, Lock, ChevronRight, ChevronLeft 
} from "lucide-react";

// --- 1. SAMPLE DATA ---
const SAMPLES = {
  rahul: {
    fullName: "Rahul Kumar",
    role: "CSE Student",
    email: "rahul.cse@example.com",
    skills: ["React", "Node.js", "Python", "Data Structures"],
    summary: "Final year Computer Science student passionate about building scalable web applications. Seeking full-stack internship opportunities.",
    education: "B.Tech Computer Science (2021-2025)",
    uni: "Aryabhatta Knowledge University, Patna"
  },
  sneha: {
    fullName: "Sneha Singh",
    role: "ECE Student",
    email: "sneha.ece@example.com",
    skills: ["VLSI", "Verilog", "Embedded C", "Matlab"],
    summary: "Electronics enthusiast with hands-on experience in circuit design and embedded systems. Looking for core industry roles.",
    education: "B.Tech ECE (2021-2025)",
    uni: "RGPV, Bhopal"
  },
  amit: {
    fullName: "Amit Sharma",
    role: "Mechanical Student",
    email: "amit.mech@example.com",
    skills: ["AutoCAD", "SolidWorks", "Thermodynamics", "ANSYS"],
    summary: "Mechanical engineering student skilled in 3D modeling and analysis. Interested in automotive design and manufacturing internships.",
    education: "B.Tech Mechanical (2022-2026)",
    uni: "JUT, Ranchi"
  }
};

export default function ResumeLandingPage() {
  const [data, setData] = useState(SAMPLES.rahul);
  const [activeSample, setActiveSample] = useState('rahul');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const loadSample = (key) => {
    setActiveSample(key);
    setData(SAMPLES[key]);
    if (window.innerWidth < 768) {
      document.getElementById('resume-preview').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      
      {/* --- 1. HEADER (EXACT MATCH WITH HOME/TODO) --- */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-violet-200 group-hover:scale-105 transition-transform">
              Y
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">YOU LEARN</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-violet-700 font-medium transition-colors"
            >
              <ChevronLeft size={18} /> Back Home
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
            >
              Build for Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-12">
          <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-6 border border-emerald-100">
            ATS FRIENDLY • ENGINEERING FOCUSED
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Build a resume that grows with <br/><span className="text-violet-600">your engineering journey.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Projects, skills, and internships — automatically structured. <br className="hidden sm:block"/>Try the live editor below.
          </p>
        </section>

        {/* --- LIVE DEMO SECTION --- */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-32">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 lg:p-8 shadow-xl shadow-slate-200/50">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT: Editor Inputs */}
              <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-violet-600"/> Edit Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="resume-full-name" className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                      <input id="resume-full-name" name="resume-full-name"
                        type="text" 
                        value={data.fullName}
                        onChange={(e) => setData({...data, fullName: e.target.value})}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="resume-role" className="text-xs font-semibold text-slate-500 uppercase">Role / Branch</label>
                      <input id="resume-role" name="resume-role"
                        type="text" 
                        value={data.role}
                        onChange={(e) => setData({...data, role: e.target.value})}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="resume-summary" className="text-xs font-semibold text-slate-500 uppercase">Summary</label>
                      <textarea id="resume-summary" name="resume-summary"
                        value={data.summary}
                        onChange={(e) => setData({...data, summary: e.target.value})}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm h-32 focus:ring-2 focus:ring-violet-500 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100 text-center">
                  <p className="text-sm text-violet-800 font-medium mb-4">Want to save this resume?</p>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18}/> Download PDF
                  </button>
                </div>
              </div>

              {/* RIGHT: Live Preview */}
              <div className="lg:col-span-8 flex justify-center items-start order-1 lg:order-2 w-full min-w-0">
                
                <div 
                  id="resume-preview"
                  className="bg-white text-left shadow-2xl transition-all duration-300 w-full p-6 sm:p-8 lg:p-12 rounded-xl border border-slate-100 min-h-[400px] overflow-hidden"
                >
                  {/* Header */}
                  <div className="border-b-2 border-slate-800 pb-6 mb-8 w-full">
                    <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 uppercase tracking-wide leading-tight w-full break-words whitespace-normal break-all">
                      {data.fullName}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 mt-2 font-medium w-full break-words whitespace-normal">
                      {data.role}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 w-full break-all whitespace-normal">
                      {data.email} • +91 98765 43210
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="mb-8 w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Professional Summary</h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                      {data.summary}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="mb-8 w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-md border border-slate-200 break-words break-all text-center">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mb-8 w-full">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Education</h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-1 w-full">
                      <span className="font-bold text-slate-800 text-base break-words whitespace-normal pr-2">{data.education}</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 break-words whitespace-normal">{data.uni}</p>
                  </div>
                  
                  {/* Watermark */}
                  <div className="mt-12 pt-8 border-t border-dashed border-slate-200 text-center opacity-40">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Preview Mode • YOU LEARN</span>
                  </div>
                </div>

                {/* Login Overlay */}
                {showLoginModal && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center">
                      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600">
                        <Lock size={24}/>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Create a free account</h3>
                      <p className="text-slate-500 mb-6 text-sm">Sign up to save your resume, export to PDF, and access unlimited edits.</p>
                      <Link href="/auth/login" className="block w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                        Login / Signup
                      </Link>
                      <button onClick={() => setShowLoginModal(false)} className="mt-4 text-xs text-slate-400 hover:text-slate-600">
                        Continue Editing Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* --- SAMPLE RESUMES --- */}
        <section className="bg-slate-50 py-20 border-y border-slate-200 mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">See examples from students</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <SampleCard 
                initial="R" name="Rahul" role="CSE Student" uni="AKU Patna" 
                isActive={activeSample === 'rahul'} 
                onClick={() => loadSample('rahul')}
              />
              <SampleCard 
                initial="S" name="Sneha" role="ECE Student" uni="RGPV Bhopal" 
                isActive={activeSample === 'sneha'}
                onClick={() => loadSample('sneha')}
              />
              <SampleCard 
                initial="A" name="Amit" role="Mech Student" uni="JUT Ranchi" 
                isActive={activeSample === 'amit'}
                onClick={() => loadSample('amit')}
              />
            </div>
          </div>
        </section>

        {/* --- WHY IT WORKS --- */}
        <section className="max-w-6xl mx-auto px-6 mb-32 grid md:grid-cols-3 gap-8">
          <FeatureBox 
            icon={<Check className="text-emerald-500"/>}
            title="ATS Friendly"
            text="No complex columns or graphics that confuse hiring software. Just clean, readable data."
          />
          <FeatureBox 
            icon={<Check className="text-emerald-500"/>}
            title="Auto-Updates"
            text="As you learn new skills on the platform, they can be auto-added to your resume."
          />
          <FeatureBox 
            icon={<Check className="text-emerald-500"/>}
            title="Engineering Templates"
            text="Formats designed specifically for CSE, ECE, Mech, and Civil internships."
          />
        </section>

        {/* --- FINAL PUSH (EXACT HOME PAGE STYLE) --- */}
        <section className="max-w-3xl mx-auto px-6 text-center">
          <div className="relative bg-white rounded-3xl p-10 sm:p-14 shadow-2xl shadow-violet-200 border border-slate-100 overflow-hidden">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Ready to apply for internships?
              </h2>
              
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-violet-200"
              >
                Create My Resume <ArrowRight size={20} />
              </Link>
              
              <p className="text-xs font-semibold text-slate-400 mt-6 tracking-wide">
                FREE FOREVER • NO WATERMARKS
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER (EXACT MATCH) --- */}
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

function FeatureBox({ icon, title, text }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="mb-4 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">{icon}</div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}

function SampleCard({ initial, name, role, uni, isActive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`
        p-6 rounded-xl border flex items-center gap-4 cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-violet-50 border-violet-200 ring-2 ring-violet-200 shadow-md transform -translate-y-1' 
          : 'bg-white border-slate-200 hover:border-violet-100 hover:shadow-md'
        }
      `}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${isActive ? 'bg-violet-600 text-white' : 'bg-slate-900 text-white'}`}>
        {initial}
      </div>
      <div>
        <h4 className={`font-bold ${isActive ? 'text-violet-900' : 'text-slate-900'}`}>{name}</h4>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{role}</p>
        <p className="text-xs text-slate-400">{uni}</p>
      </div>
      {isActive && <ChevronRight className="ml-auto text-violet-400" size={20} />}
    </div>
  );
}