"use client";
import React from "react";
import { Zap, Heart } from "lucide-react";

export default function SkillsInterests({ profile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><Zap size={20} className="text-amber-500" /> Skills</h3>
            <div className="flex flex-wrap gap-2">{(profile?.skills || []).map((s,i) => <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">{s}</span>)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><Heart size={20} className="text-pink-500" /> Interests</h3>
            <div className="flex flex-wrap gap-2">{(profile?.interests || []).map((s,i) => <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-100">{s}</span>)}</div>
        </div>
    </div>
  );
}