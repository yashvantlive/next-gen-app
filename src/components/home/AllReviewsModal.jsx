"use client";
import React from "react";
import { X, Star, Quote, User } from "lucide-react";

export default function AllReviewsModal({ isOpen, onClose, reviews, theme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-slate-50 rounded-[2rem] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Quote size={20} className={`${theme.text_main} fill-current opacity-50`} />
              Community Vibes
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              What students are saying ({reviews.length})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {reviews.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
               <Quote size={40} strokeWidth={1} />
               <p>No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                   {/* User Header */}
                   <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${theme.accent_bg}`}>
                            {review.name?.[0] || <User size={16}/>}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-none">{review.name}</h4>
                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wide">
                              {review.branch || "Student"}
                            </p>
                         </div>
                      </div>
                      {/* Rating */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            className={`${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                   </div>

                   {/* Message */}
                   <div className="relative">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{review.message}"
                      </p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}