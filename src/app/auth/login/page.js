"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
// Import paths ensures they match your structure
import AuthButtons from "../../../components/AuthButtons"; 
import { onAuthChange } from "../../../lib/firebaseClient"; 

export default function LoginPage() {
  const router = useRouter();

  // ✅ Feature: अगर यूजर पहले से लॉग इन है, तो होम पर भेजें
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace("/home"); // 'replace' history loop se bachata hai
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-slate-900">
      
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform">
                  Y
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">You Learn</span>
            </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                You Learn brings your syllabus, tasks, and progress into one quiet space. No chaos, no clutter—just clarity when you need it most.
              </p>
            </div>

            {/* ✅ FIXED: Auth Buttons Centered */}
            <div className="flex justify-center w-full mb-6">
               <AuthButtons />
            </div>

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
          
          {/* Footer of Card - Terms & Privacy Links */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link 
                href="/terms?from=login" 
                className="text-violet-600 hover:underline hover:text-violet-700 font-medium transition-colors"
              >
                Terms
              </Link>
              {' '}and{' '}
              <Link 
                href="/privacy?from=login" 
                className="text-violet-600 hover:underline hover:text-violet-700 font-medium transition-colors"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2 p-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}