"use client";
import React from "react";
import { BookOpen, Award, Layers, Calendar, Hash } from "lucide-react";

export default function AcademicDetails({ profile, getUniName, getBranchName }) {
  return (
    // Added 'h-full flex flex-col' to ensure equal height
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full flex flex-col justify-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
            <BookOpen size={20} className="text-violet-600" /> Academic Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
            <DetailItem label="University" value={getUniName(profile?.universityId || profile?.university)} icon={<Award size={16} />} />
            <DetailItem label="Branch / Course" value={getBranchName(profile?.branchId || profile?.branch)} icon={<Layers size={16} />} />
            <DetailItem label="Current Year" value={profile?.year ? `Year ${profile.year}` : null} icon={<Calendar size={16} />} />
            <DetailItem label="Semester" value={profile?.semester ? `Semester ${profile.semester}` : null} icon={<Hash size={16} />} />
        </div>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {icon && <span className="opacity-70">{icon}</span>} {label}
            </span>
            <span className="text-base font-bold text-slate-800 leading-tight truncate">
                {value || <span className="text-slate-300 italic font-normal">Not set</span>}
            </span>
        </div>
    );
}