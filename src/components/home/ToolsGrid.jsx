import React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, BarChart2, GraduationCap, ChevronRight } from "lucide-react";

export default function ToolsGrid({ theme }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DashboardCard 
        href="/syllabus" title="Syllabus" desc="Track topics." tag="CORE"
        icon={<BookOpen size={22}/>} color="violet" theme={theme}
      />
      <DashboardCard 
        href="/pyq" title="PYQs" desc="15k+ Questions." tag="PRACTICE"
        icon={<FileText size={22}/>} color="amber" theme={theme}
      />
      <DashboardCard 
        href="/resume" title="Resume" desc="Auto-format CV." tag="CAREER"
        icon={<BarChart2 size={22}/>} color="blue" theme={theme}
      />
      <DashboardCard 
        href="/exams" title="Competitions" desc="GATE, ISRO." tag="TARGET"
        icon={<GraduationCap size={22}/>} color="rose" theme={theme}
      />
    </div>
  );
}

function DashboardCard({ href, title, desc, tag, icon, color, theme }) {
  // Keep icon colors specific, but adapt container to theme
  const colorMap = {
    violet: { bg: "bg-violet-50", text: "text-violet-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    rose: { bg: "bg-rose-50", text: "text-rose-600" },
  };
  const styles = colorMap[color];

  return (
    <Link href={href} className="group block h-full">
      <div className={`h-full rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden ${theme.card_bg} ${theme.card_border} hover:border-${styles.text.split('-')[1]}-300`}>
        
        <div className={`absolute top-0 right-0 w-24 h-24 ${styles.bg} rounded-bl-full opacity-50 group-hover:scale-150 transition-transform duration-500 origin-top-right`}></div>

        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className={`w-12 h-12 rounded-xl ${styles.bg} flex items-center justify-center ${styles.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100 uppercase`}>{tag}</span>
        </div>

        <div className="relative z-10 flex-1">
          <h3 className={`text-lg font-bold mb-1 transition-colors flex items-center gap-1 ${theme.text_main}`}>
            {title}
          </h3>
          <p className={`text-xs font-medium leading-relaxed ${theme.text_sub}`}>
            {desc}
          </p>
        </div>

        <div className={`mt-4 flex items-center text-xs font-bold ${styles.text} opacity-60 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1`}>
          Launch Tool <ChevronRight size={14}/>
        </div>
      </div>
    </Link>
  );
}