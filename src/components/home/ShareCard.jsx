import React from 'react';
import { Heart } from "lucide-react";
import ShareButton from '../../components/ShareButton';
// Ensure MOODS/Theme is passed correctly or handle internally if needed.
// Assuming this component receives 'theme' prop from HomeShell now.

export default function ShareCard({ theme }) { // ✅ Accept Theme Prop
  // Fallback for gradient if theme isn't fully loaded yet
  const gradient = theme?.share_gradient || "from-indigo-500 to-violet-600";
  const buttonText = theme?.text_main || "text-indigo-600";

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-[2rem] p-8 text-white text-center shadow-xl relative overflow-hidden h-full flex flex-col justify-center transition-all duration-700`}>
      
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Heart size={140} className="absolute -top-6 -right-6 rotate-12 fill-white"/>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20 shadow-inner">
           <Heart size={28} className="text-white animate-pulse" fill="currentColor"/>
        </div>
        
        <h3 className="font-bold text-xl mb-2 tracking-tight">Study Better Together</h3>
        
        <p className="text-sm text-white/90 mb-6 font-medium leading-relaxed max-w-[200px] mx-auto">
          Help friends escape chaos. Share the system.
        </p>
        
        <div className="flex justify-center">
          {/* Custom class logic might need adjustment based on specific button implementation, 
              but passing text color via theme helps match vibe */}
          <ShareButton 
            type="app" 
            customClass={`bg-white ${buttonText.replace('text-', 'text-')} px-6 py-3 rounded-xl text-xs font-bold shadow-lg hover:bg-white/90 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95`}
          />
        </div>
      </div>
    </div>
  );
}