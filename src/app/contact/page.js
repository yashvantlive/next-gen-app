import Link from "next/link";
import { ArrowLeft, Mail, Clock, AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata = {
  title: 'Contact Us | YOU LEARN',
  description: 'Need help? Get in touch with the YOU LEARN team for support, feedback, or inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900 pb-20">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft size={18}/> Back to Home
          </Link>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs">Y</div>
            YOU LEARN
          </div>
        </div>
      </nav>

      <main className="pt-32 px-6">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <MessageSquare size={24}/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            If you have questions, feedback, or need support while using YOU LEARN, we’re here to help.
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Main Contact Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <p className="text-slate-600 mb-8">
              We encourage users to reach out for technical issues, feature requests, privacy concerns, or general feedback to improve the platform.
            </p>

            <div className="inline-flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl w-full sm:w-auto min-w-[300px]">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Support Email</span>
              <a 
                href="mailto:yashvantislive@gmail.com" 
                className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-violet-600 hover:text-violet-700 transition-colors"
              >
                <Mail size={24} />
                yashvantislive@gmail.com
              </a>
              <p className="text-xs text-slate-400 mt-3">Please include clear details so we can respond effectively.</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-500"/>
                <span>Response time: <strong>24–48 hours</strong></span>
              </div>
            </div>
          </div>

          {/* Important Notices Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Security Note */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4 text-amber-700">
                <AlertTriangle size={20}/>
                <h3 className="font-bold">Important Note</h3>
              </div>
              <ul className="space-y-3 text-sm text-amber-900/80 leading-relaxed">
                <li>• YOU LEARN does <strong>not</strong> provide phone-based support.</li>
                <li>• All communication is handled via email for clarity.</li>
                <li>• <strong>We do not request passwords</strong> or sensitive credentials via email.</li>
              </ul>
            </div>

            {/* Privacy Note */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4 text-slate-800">
                <ShieldCheck size={20} className="text-emerald-500"/>
                <h3 className="font-bold">Privacy & Trust</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Any information you share with us through email will be used only to address your query and will not be shared or misused.
              </p>
              <Link href="/privacy" className="text-sm font-semibold text-violet-600 hover:underline">
                Review Privacy Policy →
              </Link>
            </div>

          </div>

        </div>

        {/* Final Note */}
        <div className="max-w-2xl mx-auto text-center mt-16 mb-8">
          <p className="text-xl font-medium text-slate-400">
            YOU LEARN is built to support students with clarity and care.
          </p>
          <p className="text-lg font-medium text-slate-800 mt-2">
            Your feedback helps us make the platform better for everyone.
          </p>
        </div>

        {/* Footer */}
        <footer className="max-w-3xl mx-auto text-center border-t border-slate-200 pt-8 pb-8">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} YOU LEARN. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}