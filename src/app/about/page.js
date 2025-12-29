import Link from "next/link";
import { ArrowLeft, Users, Target, ShieldCheck, Heart, Lightbulb, Mail } from "lucide-react";

export const metadata = {
  title: 'About Us | YOU LEARN',
  description: 'We are building India’s most clear and useful study platform for engineering students. Clarity over complexity.',
};

export default function AboutPage() {
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
          <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6 text-violet-600">
            <Users size={24}/>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">About YOU LEARN</h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            YOU LEARN is a study management platform built for engineering students in India. We exist to simplify academic life by organizing clarity out of chaos.
          </p>
        </div>

        {/* Content Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-16">
          
          {/* Section 1: Who We Are & Why */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-700"><Target size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Why YOU LEARN Exists</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Engineering students often struggle not because of a lack of effort, but because their study material is scattered.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4 mt-4">
              <ProblemItem text="Syllabus buried in large PDFs" />
              <ProblemItem text="PYQs spread across multiple sources" />
              <ProblemItem text="No clear way to plan daily study" />
              <ProblemItem text="Resume building disconnected from work" />
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4 italic border-l-4 border-violet-200 pl-4 py-1">
              YOU LEARN was created to solve this structural problem — not by adding more content, but by organizing what already matters.
            </p>
          </section>

          {/* Section 2: What We Do */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">What We Provide</h2>
            <div className="grid gap-4">
              <FeatureItem title="Free Academic Access" text="Syllabus and PYQs remain completely free and accessible." />
              <FeatureItem title="Daily Study Tools" text="Simple planning tools that don't overwhelm you." />
              <FeatureItem title="Integrated Resume Builder" text="A profile that grows automatically as you progress." />
              <FeatureItem title="Distraction-Free Environment" text="No ads, no noise, just focus." />
            </div>
          </section>

          {/* Section 3: Philosophy */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-700"><Lightbulb size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Design Philosophy</h2>
            </div>
            <p className="text-lg font-medium text-slate-800 text-center py-6 bg-slate-50 rounded-xl">
              "Studying is already hard. The system supporting it should be simple."
            </p>
            <p className="text-slate-600">That’s why we strictly enforce:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>No intrusive ads</li>
              <li>No aggressive notifications</li>
              <li>No unnecessary pressure or gamification</li>
            </ul>
            <p className="text-slate-600">The platform aims to reduce cognitive load and help students focus on one step at a time.</p>
          </section>

          {/* Section 4: Trust */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-700"><ShieldCheck size={20} /></div>
              <h2 className="text-xl font-bold text-slate-900">Data & Trust</h2>
            </div>
            <p className="text-slate-600">We take student trust seriously.</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Authentication is handled via secure Google Sign-In</li>
              <li>Personal data is stored securely using Google Firestore</li>
              <li>User-created data remains under your control</li>
              <li>We do not sell or misuse student data</li>
            </ul>
          </section>

          {/* Section 5: Audience & Commitment */}
          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Who It’s For</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Undergraduate engineering students</li>
                <li>• Students preparing for semester exams</li>
                <li>• Learners who want structure without pressure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Our Commitment</h3>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>• Keeping core academic access free</li>
                <li>• Respecting student time and attention</li>
                <li>• Improving based on real feedback</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-4">For questions, feedback, or support:</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium hover:border-violet-200 transition-colors">
              <Mail size={16} className="text-violet-600"/>
              <a href="mailto:yashvantislive@gmail.com">yashvantislive@gmail.com</a>
            </div>
          </section>

        </div>

        {/* Final Note */}
        <div className="max-w-2xl mx-auto text-center mt-16 mb-8">
          <p className="text-xl font-medium text-slate-400">
            YOU LEARN is not designed to make studying louder or faster.
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            It is designed to make studying clearer.
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

// --- SUB-COMPONENTS ---

function ProblemItem({ text }) {
  return (
    <li className="flex items-center gap-2 text-slate-600 text-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
      {text}
    </li>
  );
}

function FeatureItem({ title, text }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-slate-600 text-sm">{text}</p>
    </div>
  );
}