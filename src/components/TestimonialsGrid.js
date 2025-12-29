"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import { Star, Quote } from "lucide-react";

export default function TestimonialsGrid() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      // Only fetch APPROVED reviews
      const q = query(
        collection(db, "reviews"),
        where("approved", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
      );
      const snap = await getDocs(q);
      setReviews(snap.docs.map(d => d.data()));
    };
    fetch();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <Quote className="text-violet-200 mb-4 fill-violet-200" size={32} />
              <p className="text-slate-700 mb-4 leading-relaxed">"{r.message}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                  {r.userName?.[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{r.userName}</h4>
                  <div className="flex text-orange-400">
                    {Array.from({length: r.rating}).map((_, i) => <Star key={i} size={12} fill="currentColor"/>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}