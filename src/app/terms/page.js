"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Mail, Lock } from "lucide-react";

// --- CLIENT COMPONENT FOR NAVIGATION LOGIC ---
function TermsNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSource = searchParams.get('from'); 
  const isFromLogin = fromSource === 'login';

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT SIDE: Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-6">
            
            {/* 1. Back to Login (Specific explicit link if 'from=login' exists) */}
            {isFromLogin && (
                <Link 
                  href="/auth/login" 
                  className="flex items-center gap-2 font-bold text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100"
                >
                  <Lock size={16} /> 
                  <span>Login</span>
                </Link>
            )}

            {/* 2. Generic Back Button (Goes back to previous history - Settings/Home/etc) */}
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18}/> 
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">Back</span>
            </button>
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
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900 pb-20">
      
      {/* Navigation wrapped in Suspense */}
      <Suspense fallback={<div className="h-16 bg-white/90 border-b border-slate-100"/>}>
        <TermsNavigation />
      </Suspense>

      <main className="pt-32 px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <FileText size={24}/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500">Effective Date: January 2026</p>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12">
          
          <div className="prose prose-slate max-w-none space-y-12">
            
            <Section title="1. Acceptance of Terms">
              <p>
                These Terms of Service (“Terms”) govern access to and use of <strong>YOU LEARN</strong> (“Platform”, “Service”, “we”, “us”, “our”), available at <span className="text-violet-600 font-medium">https://youlearn.community</span>.
              </p>
              <p>
                By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must discontinue use of the Platform.
              </p>
            </Section>

            <Section title="2. Description of the Service">
              <p>YOU LEARN is an educational platform designed for engineering students, providing:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Free access to syllabus and previous year question papers (PYQs)</li>
                <li>Account-based tools such as study planning (To-Do) and resume building</li>
                <li>Academic organization and productivity features</li>
              </ul>
              <p className="mt-4">
                Some features are publicly accessible, while others require user authentication.
              </p>
            </Section>

            <Section title="3. Eligibility">
              <p>The Platform is intended for users aged 13 years and above. By using YOU LEARN, you represent that:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>You meet the minimum age requirement</li>
                <li>You are legally capable of entering into this agreement</li>
              </ul>
            </Section>

            <Section title="4. User Accounts and Authentication">
              <h3 className="font-bold text-slate-800 mt-4 mb-2">4.1 Account Creation</h3>
              <p>To access certain features, users must authenticate using Google Sign-In.</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>YOU LEARN does not collect or store passwords</li>
                <li>Authentication is handled securely by Google</li>
              </ul>

              <h3 className="font-bold text-slate-800 mt-6 mb-2">4.2 Account Responsibility</h3>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities performed under your account</li>
              </ul>
              <p className="mt-4">
                YOU LEARN is not liable for unauthorized access resulting from user negligence.
              </p>
            </Section>

            <Section title="5. User Content and Responsibility">
              <p>Users may create or upload content, including study tasks, resume information, and academic preferences. You retain ownership of your content.</p>
              <p className="mt-4">
                By using the Platform, you grant YOU LEARN a limited right to process such content solely to provide the Service. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Upload unlawful, misleading, or harmful content</li>
                <li>Attempt to disrupt or misuse the Platform</li>
              </ul>
            </Section>

            <Section title="6. Data Usage and Privacy">
              <p>
                Use of the Platform is also governed by our <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>, which explains what data is collected, how it is used, and how users control their data.
              </p>
              <p className="mt-2">
                By using YOU LEARN, you consent to data practices described in the Privacy Policy.
              </p>
            </Section>

            <Section title="7. Free Access and Feature Availability">
              <ul className="list-disc pl-5 space-y-2">
                <li>Core features such as syllabus and PYQs are provided free of charge</li>
                <li>Account-based features may be expanded or modified over time</li>
                <li>YOU LEARN reserves the right to introduce new features or limits</li>
              </ul>
              <p className="mt-4">No payment is required unless explicitly stated.</p>
            </Section>

            <Section title="8. Prohibited Activities">
              <p>Users must not:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Attempt to reverse engineer or exploit the Platform</li>
                <li>Use the Service for illegal or unauthorized purposes</li>
                <li>Interfere with system security or performance</li>
                <li>Misrepresent affiliation with YOU LEARN</li>
              </ul>
              <p className="mt-4">
                Violation of these rules may result in suspension or termination of access.
              </p>
            </Section>

            <Section title="9. Service Availability and Modifications">
              <p>YOU LEARN strives to maintain reliable access but does not guarantee uninterrupted availability. We reserve the right to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Modify or discontinue features</li>
                <li>Temporarily suspend access for maintenance</li>
                <li>Update the Platform without prior notice</li>
              </ul>
            </Section>

            <Section title="10. Termination">
              <p>YOU LEARN may suspend or terminate access:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>For violation of these Terms</li>
                <li>For misuse of the Platform</li>
                <li>When required by law</li>
              </ul>
              <p className="mt-4">
                Users may discontinue use at any time. Data deletion requests may be submitted as outlined in the Privacy Policy.
              </p>
            </Section>

            <Section title="11. Disclaimer of Warranties">
              <p>The Platform is provided “as is” and “as available”. YOU LEARN makes no warranties regarding:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Accuracy or completeness of content</li>
                <li>Fitness for a particular purpose</li>
                <li>Academic outcomes or results</li>
              </ul>
              <p className="mt-4">Use of the Platform is at your own discretion and risk.</p>
            </Section>

            <Section title="12. Limitation of Liability">
              <p>To the maximum extent permitted by law, YOU LEARN shall not be liable for:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of data, academic outcomes, or productivity</li>
                <li>Service interruptions or technical issues</li>
              </ul>
            </Section>

            <Section title="13. Indemnification">
              <p>
                You agree to indemnify and hold harmless YOU LEARN from claims arising out of your use of the Platform, violation of these Terms, or infringement of applicable laws or third-party rights.
              </p>
            </Section>

            <Section title="14. Governing Law">
              <p>
                These Terms shall be governed by and interpreted in accordance with the laws of India, without regard to conflict of law principles.
              </p>
            </Section>

            <Section title="15. Changes to These Terms">
              <p>
                YOU LEARN may revise these Terms as necessary. Updates will be reflected by changing the Effective Date. Continued use of the Platform constitutes acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="16. Contact Information">
              <p>For questions or concerns regarding these Terms, contact:</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium hover:border-violet-200 transition-colors">
                <Mail size={16} className="text-violet-600"/>
                <a href="mailto:yashvantislive@gmail.com">yashvantislive@gmail.com</a>
              </div>
            </Section>

            <Section title="17. Entire Agreement">
              <p>
                These Terms, together with the Privacy Policy, constitute the entire agreement between you and YOU LEARN regarding use of the Platform.
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