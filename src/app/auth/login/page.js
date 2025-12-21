"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthButtons from "@/components/AuthButtons"; 
import { X, Shield, FileText, Lock } from "lucide-react";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('terms'); // 'terms' or 'privacy'

  const openModal = (type) => {
    setModalContent(type);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans text-slate-900">
      
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform">
                  S
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">StudyApp</span>
            </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-500 text-sm">
                Sign in to sync your tasks, syllabus, and progress across all your devices.
              </p>
            </div>

            <AuthButtons />

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400 flex items-center gap-1">
                  <Lock size={12} /> Secure access
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer of Card */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              By continuing, you agree to our{' '}
              <button onClick={() => openModal('terms')} className="text-violet-600 hover:underline hover:text-violet-700 font-medium">Terms</button>
              {' '}and{' '}
              <button onClick={() => openModal('privacy')} className="text-violet-600 hover:underline hover:text-violet-700 font-medium">Privacy Policy</button>.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* --- MODAL FOR TERMS & PRIVACY --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2 text-slate-800">
                {modalContent === 'terms' ? <FileText size={20} className="text-violet-600"/> : <Shield size={20} className="text-emerald-600"/>}
                <h3 className="text-lg font-bold">
                  {modalContent === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto text-sm text-slate-600 leading-relaxed space-y-4">
              {modalContent === 'terms' ? (
                <>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">Last Updated: December 2025</p>
                  
                  <h4 className="text-base font-bold text-slate-900 mt-4">1. Acceptance of Terms</h4>
                  <p>By accessing and using StudyApp ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.</p>

                  <h4 className="text-base font-bold text-slate-900 mt-4">2. Educational Use Only</h4>
                  <p>This platform is designed to assist students with academic planning, syllabus tracking, and study management. While we strive for accuracy, StudyApp is not a replacement for official university notices or curriculum documents.</p>

                  <h4 className="text-base font-bold text-slate-900 mt-4">3. User Accounts</h4>
                  <p>You are responsible for maintaining the security of your account credentials. StudyApp connects via Google Authentication to ensure secure access; we do not store your passwords directly.</p>

                  <h4 className="text-base font-bold text-slate-900 mt-4">4. User Conduct</h4>
                  <p>You agree not to misuse the Service or help anyone else do so. You must not attempt to disrupt the Service, access it using a method other than the interface and instructions we provide, or use it for any illegal activities.</p>
                </>
              ) : (
                <>
                   <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">Last Updated: December 2025</p>
                   
                   <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs mb-4">
                     <strong>Summary:</strong> We only collect what is necessary to provide the service (your name, email, and photo from Google). We do not sell your data to third parties.
                   </div>

                   <h4 className="text-base font-bold text-slate-900 mt-4">1. Information We Collect</h4>
                   <ul className="list-disc pl-5 space-y-1">
                     <li><strong>Account Information:</strong> When you sign in via Google, we collect your name, email address, and profile picture to create your account.</li>
                     <li><strong>User Content:</strong> Data you create, such as tasks, study plans, and syllabus progress, is stored securely to provide the core functionality of the app.</li>
                   </ul>

                   <h4 className="text-base font-bold text-slate-900 mt-4">2. How We Use Your Data</h4>
                   <p>We use your information solely to provide, maintain, and improve the Service. We do not share your personal information with third-party advertisers.</p>

                   <h4 className="text-base font-bold text-slate-900 mt-4">3. Data Security</h4>
                   <p>We implement industry-standard security measures to protect your data. Your connection to StudyApp is encrypted using SSL (Secure Socket Layer) technology. Authentication is handled securely via Firebase Authentication.</p>

                   <h4 className="text-base font-bold text-slate-900 mt-4">4. Your Rights</h4>
                   <p>You have the right to access, correct, or delete your personal data at any time. You can delete your account and all associated data through your profile settings.</p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm shadow-md"
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