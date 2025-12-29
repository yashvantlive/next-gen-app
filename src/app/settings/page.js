"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, Shield, ShieldAlert, FileQuestion, HelpCircle, 
  Info, CheckCircle2, ExternalLink, Lock, Globe, 
  LogOut, ChevronRight, Mail, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "../../lib/firebaseClient"; 
import RequestResourceModal from "../../components/RequestResourceModal"; 

export default function SettingsPage() {
  const router = useRouter();
  const { authUser } = useAuthGuard();
  
  // ✅ ONLY Language Setting
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // ✅ LOAD SETTINGS
  useEffect(() => {
    const load = async () => {
      if (!authUser?.uid) return;
      try {
        const snap = await getDoc(doc(db, "users", authUser.uid));
        if (snap.exists()) {
          const s = snap.data().settings || {};
          setLanguage(s.language || "English");
        }
      } catch (e) { 
        console.error('Failed to load settings:', e); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [authUser]);

  // ✅ AUTO-SAVE SETTINGS - Only language
  useEffect(() => {
    if (!authUser?.uid || loading) return;
    
    const handler = setTimeout(async () => {
      setSaving(true);
      try {
        await setDoc(doc(db, "users", authUser.uid), {
          settings: { language }
        }, { merge: true });
        
        console.log('✅ Settings saved:', { language });
      } catch (e) { 
        console.error('❌ Failed to save settings:', e); 
      } finally { 
        setTimeout(() => setSaving(false), 800); 
      }
    }, 600);
    
    return () => clearTimeout(handler);
  }, [language, authUser, loading]);

  const handleHelp = () => alert("Help Center: Guides and FAQs will be available soon.");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Modal Component */}
      <RequestResourceModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
        authUser={authUser} 
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center px-6 gap-4">
         <Link href="/profile" className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
         </Link>
         <h1 className="text-lg font-bold text-slate-800 tracking-tight">Settings</h1>
         {saving && (
           <span className="ml-auto text-xs font-medium text-emerald-600 animate-pulse flex items-center gap-2">
             <CheckCircle2 size={14} />
             Saving...
           </span>
         )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        
        {/* 1. ACCOUNT & SECURITY */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Account & Security</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* Change Password */}
                <div className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                            <Lock size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700">Change Password</p>
                            <p className="text-xs text-slate-400">Update your security credentials</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
                </div>

                {/* Logout All Devices */}
                <div className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                            <LogOut size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700">Logout All Devices</p>
                            <p className="text-xs text-slate-400">Secure your account instantly</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
                </div>

            </div>
        </section>

        {/* 2. LANGUAGE & REGION */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Language & Region</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Globe size={18} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">App Language</p>
                        <p className="text-xs text-slate-500">More languages coming soon</p>
                    </div>
                </div>
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
                >
                    <option value="English">English</option>
                    <option value="Hindi" disabled>Hindi (Soon)</option>
                    <option value="Spanish" disabled>Spanish (Soon)</option>
                </select>
            </div>
        </section>

        {/* 3. HELP & SUPPORT */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Help & Support</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* Request Content (Functional) */}
                <button 
                    onClick={() => setIsRequestModalOpen(true)} 
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 text-left group transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileQuestion size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Request Content</p>
                            <p className="text-xs text-slate-500">Missing Syllabus, PYQ, or Notes?</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                </button>

                {/* Contact Support */}
                <button 
                    onClick={handleHelp}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 text-left group transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Contact Support</p>
                            <p className="text-xs text-slate-500">Report bugs or suggest features</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                </button>

                {/* FAQ */}
                <div className="p-5 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                            <HelpCircle size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700">FAQ & Guides</p>
                            <p className="text-xs text-slate-400">Common questions answered</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
            </div>
        </section>

        {/* 4. LEGAL & TRANSPARENCY */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Legal & Transparency</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
                
                {/* Disclaimer */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0"><AlertCircle size={18} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Disclaimer</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            You Learn is an educational platform. We do not claim ownership of third-party assets (music/icons). This app adheres to all standard copyright policies.
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                {/* Credits */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0"><Info size={18} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Credits & Attribution</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Background music tracks are sourced from <a href="https://pixabay.com/music/" target="_blank" rel="noreferrer" className="text-violet-600 hover:underline inline-flex items-center gap-0.5">Pixabay <ExternalLink size={10}/></a> under the Pixabay Content License. 
                        </p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                {/* Links */}
                <div className="flex gap-4 pt-1">
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">Privacy Policy</button>
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">Terms of Service</button>
                </div>
            </div>
        </section>

        {/* 5. ABOUT SYSTEM */}
        <section className="text-center py-4">
            <div className="inline-flex items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl shadow-sm mb-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xs">YL</span>
                </div>
                <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900">You Learn System</h4>
                    <p className="text-[10px] text-slate-500 font-medium">v1.0.0 Public Beta</p>
                </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Built for students who want clarity, not chaos.</p>
        </section>

        {/* 6. DANGER ZONE */}
        <section>
            <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 px-1">Danger Zone</h3>
            <div className="bg-rose-50 rounded-2xl border border-rose-100 p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-sm"><ShieldAlert size={18} /></div>
                    <div>
                        <p className="font-bold text-slate-800">Delete Account</p>
                        <p className="text-xs text-slate-500">Permanently remove all data.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                    Delete
                </button>
            </div>
        </section>

      </main>
    </div>
  );
}