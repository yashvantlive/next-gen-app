import React from 'react';
import Link from 'next/link';
import { Quote, Star, Plus, Edit2, ArrowRight } from "lucide-react";
import { getFullForm } from '../../lib/constants';

export default function CommunityWall({ reviews, theme, onOpenReview, onEditReview, currentUserId }) {
  return (
    <section className={`pt-12 border-t ${theme.border}`}>
      
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-2 gap-4">
         <div className="flex items-center gap-3 opacity-90">
            <div className={`p-2 rounded-lg ${theme.radar_bg}`}>
               <Quote size={20} className={theme.radar_color}/>
            </div>
            <h3 className={`text-base font-bold uppercase tracking-widest ${theme.text_main}`}>Community Vibes</h3>
         </div>
         
         <div className="flex items-center gap-3">
            <Link href="/reviews" className={`text-xs font-bold flex items-center gap-1 transition-colors ${theme.text_sub} hover:${theme.text_main}`}>
                See All Reviews <ArrowRight size={14}/>
            </Link>
            <button 
                onClick={onOpenReview}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all hover:shadow-md active:scale-95 ${theme.soft_button} ${theme.border}`}
            >
                <Plus size={14}/> Write Review
            </button>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
            reviews.slice(0, 3).map((rev, idx) => {
              const isOwner = currentUserId === rev.userId;
              return (
                <div key={rev.id || idx} className={`p-6 rounded-[2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative ${theme.card_bg} ${theme.card_border}`}>
                    
                    {isOwner && (
                      <button onClick={() => onEditReview(rev)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${theme.radar_bg} ${theme.text_sub}`}>
                        <Edit2 size={14}/>
                      </button>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${theme.radar_bg} ${theme.radar_color} ${theme.border}`}>
                              {rev.name?.[0] || "U"}
                          </div>
                          <div className="min-w-0">
                              <p className={`font-bold text-sm truncate flex items-center gap-2 ${theme.text_main}`}>
                                {rev.name}
                              </p>
                              <p className={`text-[10px] uppercase font-bold tracking-wide truncate ${theme.text_sub}`}>
                                  {getFullForm(rev.uni) || "Student"}
                              </p>
                          </div>
                      </div>
                      <p className={`text-xs italic leading-relaxed line-clamp-4 relative pl-3 border-l-2 ${theme.text_main} ${theme.border}`}>
                          "{rev.message}"
                      </p>
                    </div>
                    
                    <div className={`flex items-center justify-between mt-5 pt-4 border-t ${theme.border}`}>
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-amber-400" : "text-slate-200"} />
                            ))}
                        </div>
                        <span className={`text-[9px] font-medium ${theme.text_sub}`}>
                            {rev.branch}
                        </span>
                    </div>
                </div>
              );
            })
        ) : (
            <div className={`col-span-3 text-center py-12 rounded-2xl border border-dashed ${theme.border} ${theme.card_bg}`}>
                <p className={`text-sm font-medium ${theme.text_sub}`}>Be the first to share your journey.</p>
            </div>
        )}
      </div>
    </section>
  );
}