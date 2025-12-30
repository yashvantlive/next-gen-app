"use client";
import React from 'react';
import { Quote, Star, Plus, User, ArrowRight, Edit3 } from 'lucide-react';

export default function CommunityWall({ reviews, theme, currentUserId, onOpenReview, onEditReview, onSeeAll }) {
  
  // Show only top 2 reviews on the wall to keep it clean
  const featuredReviews = reviews.slice(0, 2);

  return (
    <section className="relative">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
           <Quote size={24} className={`transform scale-x-[-1] ${theme.text_main}`} />
           <h2 className="text-lg font-bold text-slate-700 tracking-tight">COMMUNITY VIBES</h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
            {/* ✅ UPDATED: Button triggers Modal instead of Page Link */}
            <button 
                onClick={onSeeAll}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
                See All Reviews <ArrowRight size={12} />
            </button>

            <button 
                onClick={onOpenReview}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-slate-200 transition-transform active:scale-95 ${theme.accent_bg}`}
            >
                <Plus size={14} strokeWidth={3} /> <span className="hidden sm:inline">Write Review</span>
                <span className="sm:hidden">Write</span>
            </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredReviews.length > 0 ? featuredReviews.map((review) => {
            const isOwn = currentUserId && review.userId === currentUserId;
            
            return (
                <div key={review.id} className={`group relative p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 ${theme.card_style}`}>
                    
                    {/* Edit Button (Only for owner) */}
                    {isOwn && (
                        <button 
                            onClick={() => onEditReview(review)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Edit3 size={14} />
                        </button>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md ${theme.accent_bg}`}>
                            {review.name ? review.name[0] : <User size={18}/>}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                {review.name}
                                {isOwn && <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">ME</span>}
                            </h4>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${theme.text_main}`}>
                                {review.uni || "University"} • {review.branch || "Student"}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed italic mb-4">
                        "{review.message}"
                    </p>

                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={star} 
                                size={14} 
                                className={`${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                            />
                        ))}
                    </div>
                </div>
            );
        }) : (
            <div className="col-span-full py-8 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 font-medium">No vibes yet. Start the wave! 🌊</p>
            </div>
        )}
      </div>

    </section>
  );
}