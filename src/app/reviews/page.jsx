"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { ArrowLeft, Star, Quote, User } from "lucide-react";
import { getFullForm } from '../../lib/constants';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch ALL approved reviews
    const q = query(
      collection(db, 'testimonials'), 
      where("approved", "==", true), 
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/home" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20}/>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">All Community Reviews</h1>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-slate-400 py-12">Loading vibes...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100">
                        {rev.name?.[0] || "U"}
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">{rev.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide truncate">
                            {getFullForm(rev.uni) || "Student"}
                        </p>
                     </div>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-6 relative pl-3 border-l-2 border-violet-200">
                      "{rev.message}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-amber-400" : "text-slate-200"} />
                        ))}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                        {rev.branch || "ENG"}
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}