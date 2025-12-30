import React, { useState, useEffect } from 'react';
import { Star, X, User, Building, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { getFullForm } from '../../lib/constants';

export default function ReviewModal({ isOpen, onClose, onSubmit, profile, theme, editData = null }) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill for Edit Mode
  useEffect(() => {
    if (editData) {
      setRating(editData.rating || 5);
      setMessage(editData.message || "");
    } else {
      setRating(5);
      setMessage("");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    // Send data (ID is passed only if editing)
    await onSubmit({ 
      rating, 
      message, 
      id: editData?.id || null 
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            {editData ? "Edit Your Review" : "Write a Review"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* 1, 2, 3: IDENTITY CARD (Name, Branch, Uni - Auto Filled) */}
          <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg_soft} relative`}>
            <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm font-bold border border-slate-100">
                  {profile?.displayName?.[0] || <User size={18}/>}
               </div>
               <div>
                  <p className={`text-sm font-bold ${theme.text_main}`}>
                    {profile?.displayName || "Student"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={10} className="text-emerald-500"/> Verified Identity
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/50">
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Branch</div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700" title={getFullForm(profile?.branchId)}>
                     <BookOpen size={12} className="text-slate-400"/>
                     <span className="truncate max-w-[120px]">{getFullForm(profile?.branchId) || "Not Set"}</span>
                  </div>
               </div>
               <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">University</div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700" title={getFullForm(profile?.universityId)}>
                     <Building size={12} className="text-slate-400"/>
                     <span className="truncate max-w-[120px]">{getFullForm(profile?.universityId) || "Not Set"}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* 4. RATING INPUT */}
          <div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Rate Experience</div>
             <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                   <button 
                     key={star} 
                     onClick={() => setRating(star)}
                     className="transition-transform hover:scale-110 focus:outline-none"
                   >
                      <Star 
                        size={32} 
                        className={`${star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`} 
                        strokeWidth={1.5}
                      />
                   </button>
                ))}
             </div>
          </div>

          {/* 5. REVIEW TEXT */}
          <div>
             <label htmlFor="review-message" className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Your Message</label>
             <textarea 
                id="review-message"
                name="review-message"
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                placeholder="Share your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
             />
          </div>

          {/* SUBMIT */}
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim()}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${theme.button}`}
          >
            {isSubmitting ? (editData ? "Updating..." : "Submitting...") : (editData ? "Update Review" : "Submit Review")}
          </button>

        </div>
      </div>
    </div>
  );
}