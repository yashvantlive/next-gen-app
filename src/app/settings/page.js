"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, Shield, ShieldAlert, HelpCircle, 
  Info, CheckCircle2, ExternalLink, Lock, Globe, 
  LogOut, ChevronRight, Mail, AlertCircle, Trash2, X, Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { doc, getDoc, deleteDoc } from "firebase/firestore"; 
import { signOut } from "firebase/auth";
import { db, auth } from "../../lib/firebaseClient"; 

export default function SettingsPage() {
  const router = useRouter();
  const { authUser } = useAuthGuard();
  
  // ✅ Settings State
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(true);
  
  // ✅ Modals State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // ✅ Processing State
  const [isDeleting, setIsDeleting] = useState(false);

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

  // ✅ DELETE ACCOUNT ACTION
  const handleDeleteAccount = async () => {
    if (!authUser?.uid) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", authUser.uid));
      await signOut(auth);
      router.push("/auth/login");
    } catch (e) {
      console.error("Delete account failed:", e);
      alert("Failed to delete account. Please try again.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
      
      {/* 1. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Account?</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex border-t border-slate-100 divide-x divide-slate-100">
              <button disabled={isDeleting} onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button disabled={isDeleting} onClick={handleDeleteAccount} className="flex-1 py-4 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">{isDeleting ? "Deleting..." : "Confirm Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT SUPPORT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Mail size={18} className="text-blue-600"/> Contact Support</h3>
                <button onClick={() => setIsContactModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={18} className="text-slate-400"/></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs leading-relaxed border border-blue-100">
                  <strong>Student Guidelines:</strong><br/>
                  1. Check the FAQs below before contacting.<br/>
                  2. For bug reports, please include screenshots.<br/>
                  3. We usually reply within 24-48 hours.
               </div>
               <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Official Support Email</p>
                  <p className="text-lg font-bold text-slate-800 select-all">yashvantislive@gmail.com</p>
               </div>
               <a 
                 href="mailto:yashvantislive@gmail.com" 
                 className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
               >
                 <Send size={16} /> Open Mail App
               </a>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 flex items-center px-6 gap-4">
         <Link href="/profile" className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
         </Link>
         <h1 className="text-lg font-bold text-slate-800 tracking-tight">Settings</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        
        {/* 1. ACCOUNT & SECURITY */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Account & Security</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                <div className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><Lock size={18} /></div>
                        <div>
                            <p className="font-bold text-slate-700">Change Password</p>
                            <p className="text-xs text-slate-400">Update your security credentials</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
                <div className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-not-allowed opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"><LogOut size={18} /></div>
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><Globe size={18} /></div>
                        <div>
                            <p className="font-bold text-slate-800">App Language</p>
                            <p className="text-xs text-slate-500">Currently only English is supported.</p>
                        </div>
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                        English (Default)
                    </div>
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">Hindi & Spanish support coming soon.</p>
            </div>
        </section>

        {/* 3. HELP & SUPPORT / BRAND FAQ */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Help & Support</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                
                {/* Contact Support Trigger */}
                <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 text-left group transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Mail size={18} /></div>
                        <div>
                            <p className="font-bold text-slate-800">Contact Support</p>
                            <p className="text-xs text-slate-500">Email us for direct assistance</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                </button>

                {/* FAQ Section (Updated: 5 FAQs, No Buttons) */}
                <div className="p-5 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1"><HelpCircle size={12}/> FREQUENTLY ASKED QUESTIONS</h4>
                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1">What is You Learn?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">You Learn is a student-first productivity platform designed to help you organize syllabus tracking, manage tasks, and stay focused with a personalized mood-based interface.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1">Is this platform free?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Yes! You Learn is currently in Public Beta and completely free for all students. No hidden charges.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1">How do I track my syllabus?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Go to the Dashboard and use the 'Academic Radar' to view your progress. You can mark topics as completed in the Tasks view.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1">Can I customize the theme?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Yes! You can change the mood-based theme colors from your Profile page by clicking the Palette icon.</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-800 mb-1">Is my data secure?</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Absolutely. We use secure cloud storage for your data. You also have full control to delete your account anytime from the Danger Zone below.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. LEGAL & TRANSPARENCY */}
        <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Legal & Transparency</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 shrink-0"><AlertCircle size={18} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Disclaimer</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            You Learn is an educational platform. We do not claim ownership of third-party assets.
                        </p>
                    </div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div className="flex gap-4 pt-1">
                    <Link href="/privacy" className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline">Terms of Service</Link>
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
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        </section>

      </main>
    </div>
  );
}