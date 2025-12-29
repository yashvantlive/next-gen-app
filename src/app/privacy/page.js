"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Lock, Home } from "lucide-react";

// --- CLIENT COMPONENT FOR NAVIGATION LOGIC ---
function PrivacyNavigation() {
  const searchParams = useSearchParams();
  const fromSource = searchParams.get('from'); 
  const isFromLogin = fromSource === 'login';

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT SIDE: Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
            
            {/* 1. Back to Login (Only visible if came from Login) */}
            {isFromLogin && (
                <Link 
                  href="/auth/login" 
                  className="flex items-center gap-2 font-bold text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100"
                >
                  <Lock size={16} /> 
                  <span>Login</span>
                </Link>
            )}

            {/* 2. Back to Home (Always visible) */}
            <Link 
              href="/" 
              className="flex items-center gap-2 font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18}/> 
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
        </div>

        {/* RIGHT SIDE: Branding */}
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs">Y</div>
          <span className="hidden sm:inline">YOU LEARN</span>
        </div>
      </div>
    </nav>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900 pb-20">
      
      {/* Navigation wrapped in Suspense */}
      <Suspense fallback={<div className="h-16 bg-white/90 border-b border-slate-100"/>}>
        <PrivacyNavigation />
      </Suspense>

      <main className="pt-32 px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <ShieldCheck size={24}/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Effective Date: January 2026</p>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
          
          <div className="prose prose-slate max-w-none space-y-12">
            
            <Section title="1. Scope and Applicability">
              <p>
                This Privacy Policy governs the collection, use, storage, and protection of information by <strong>YOU LEARN</strong> (“Platform”, “we”, “us”, “our”), accessible at <span className="text-violet-600 font-medium">https://youlearn.community</span>.
              </p>
              <p>
                This Policy applies to all users who access the Platform, whether registered or unregistered.
              </p>
            </Section>

            <Section title="2. Services Covered">
              <p>YOU LEARN provides educational tools for engineering students, including:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Public access to syllabus and previous year question papers (PYQs)</li>
                <li>Account-based tools such as study planning (To-Do) and resume building</li>
              </ul>
              <p className="mt-4">
                Public features may be accessed without authentication. Personalized features require user authentication.
              </p>
            </Section>

            <Section title="3. Authentication Method">
              <p>For account-based features, YOU LEARN uses Google Sign-In authentication.</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>We do not collect or store passwords</li>
                <li>Authentication is handled directly by Google</li>
                <li>This method is used to ensure security and reduce unauthorized access</li>
              </ul>
            </Section>

            <Section title="4. Information Collected">
              <h3 className="font-bold text-slate-800 mt-4 mb-2">4.1 Information Collected Without Login</h3>
              <p>When accessing public content (syllabus and PYQs), no personally identifiable information is collected.</p>

              <h3 className="font-bold text-slate-800 mt-6 mb-2">4.2 Information Collected Upon Login</h3>
              <p>When a user authenticates via Google Sign-In, the Platform may collect:</p>
              
              <div className="ml-4 mt-4 space-y-4">
                <div>
                  <span className="font-semibold text-slate-800 block">a) Account Information</span>
                  <span className="text-slate-600">Name, Email address, Profile image (if provided by Google)</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">b) Academic Preference Data (User-Provided)</span>
                  <span className="text-slate-600">University or institution, Branch or course, Semester or academic year</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">c) User-Generated Content</span>
                  <span className="text-slate-600">Study planner tasks, Resume content including skills, projects, and academic details</span>
                </div>
              </div>
              <p className="mt-4 italic text-sm text-slate-500">All such data is provided voluntarily by the user.</p>
            </Section>

            <Section title="5. Purpose of Data Collection">
              <p>Information is collected strictly for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Providing personalized academic tools</li>
                <li>Filtering syllabus and PYQs accurately</li>
                <li>Enabling resume and study planner functionality</li>
                <li>Maintaining system integrity and performance</li>
              </ul>
              <p className="mt-4 font-medium text-slate-800">
                Data is not used for advertising profiling or unrelated commercial purposes.
              </p>
            </Section>

            <Section title="6. Data Storage and Security">
              <ul className="list-disc pl-5 space-y-2">
                <li>User data is stored securely using Google Firestore</li>
                <li>Firestore infrastructure follows Google’s industry-standard security practices</li>
                <li>Reasonable administrative and technical safeguards are implemented</li>
              </ul>
              <p className="mt-4">
                While no system can guarantee absolute security, reasonable efforts are made to protect user data against unauthorized access, alteration, or disclosure.
              </p>
            </Section>

            <Section title="7. User Control and Data Deletion">
              <p>Users retain control over their data:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Resume information can be cleared by the user using in-platform controls</li>
                <li>Clearing resume data permanently removes stored resume content</li>
                <li>Users may discontinue use of the Platform at any time</li>
                <li>Users may request deletion of their account-associated data by contacting us</li>
              </ul>
              <p className="mt-4">
                Data deletion requests will be processed within a reasonable timeframe, subject to legal or operational requirements.
              </p>
            </Section>

            <Section title="8. Data Sharing and Disclosure">
              <p>YOU LEARN does not:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Sell personal data</li>
                <li>Rent personal data</li>
                <li>Share personal data with third parties for marketing purposes</li>
              </ul>
              <p className="mt-4">
                Data may be disclosed only when required by law, legal process, or governmental request.
              </p>
            </Section>

            <Section title="9. Cookies and Analytics">
              <p>The Platform may use limited cookies or analytics tools solely to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Monitor system performance</li>
                <li>Understand aggregate usage patterns</li>
                <li>Improve platform reliability</li>
              </ul>
              <p className="mt-4">Such tools do not intentionally identify individual users.</p>
            </Section>

            <Section title="10. Children’s Privacy">
              <p>
                The Platform is intended for users aged 13 years and above. We do not knowingly collect personal data from children under 13. If such data is identified, it will be removed upon notification.
              </p>
            </Section>

            <Section title="11. Policy Updates">
              <p>
                This Privacy Policy may be updated to reflect changes in features, legal requirements, or operational practices. Updates will be reflected by revising the Effective Date. Continued use of the Platform constitutes acceptance of the revised Policy.
              </p>
            </Section>

            <Section title="12. Contact Information">
              <p>For privacy-related inquiries, data requests, or concerns, contact:</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium hover:border-violet-200 transition-colors">
                <Mail size={16} className="text-violet-600"/>
                <a href="mailto:yashvantislive@gmail.com">yashvantislive@gmail.com</a>
              </div>
            </Section>

            <Section title="13. Responsibility Statement">
              <p>
                YOU LEARN acknowledges its responsibility to handle student data with care and integrity. Data is collected only to deliver educational functionality and is treated as a matter of trust.
              </p>
            </Section>

          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-3xl mx-auto mt-16 text-center border-t border-slate-200 pt-8 pb-8">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} YOU LEARN. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}

// --- SUB-COMPONENT ---
function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
      <div className="text-slate-600 leading-relaxed text-base">
        {children}
      </div>
    </section>
  );
}