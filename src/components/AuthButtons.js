"use client";

import React, { useEffect, useState } from "react";
import { signInWithGoogle, onAuthChange, getUserProfile } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  // FIX: Use useState instead of useRef so the component re-renders when mounted
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let mounted = true;
    const unsubscribe = onAuthChange(async (u) => {
      if (!mounted) return;
      
      if (u) {
        setUser({
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            uid: u.uid,
        });

        // Auto-redirect logic
        try {
          const profile = await getUserProfile(u.uid);
          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          
          if (!profile && currentPath !== "/onboarding") {
             router.push("/onboarding");
          } else if (profile && currentPath !== "/home" && currentPath !== "/profile") {
             router.push("/home"); 
          }
        } catch (err) {
          console.error("Error checking user profile:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isHydrated, router]);

  async function handleSignIn() {
    setError(null);
    setIsSigning(true);
    try {
      const result = await signInWithGoogle();
      if (result && result.redirected) {
        setError("Redirecting...");
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
      const code = String(err?.code || err?.message || "");
      if (code.toLowerCase().includes('popup')) {
        setError('Popup blocked. Please allow popups for this site.');
      } else if (code.toLowerCase().includes('network')) {
        setError('Network error. Check your connection.');
      } else {
        setError('Unable to sign in. Please try again.');
      }
    } finally {
      // Note: We don't set isSigning(false) immediately if successful 
      // because we want to show the loading state until the redirect happens.
      if (!user) setIsSigning(false); 
    }
  }

  // Loading / Not Hydrated State
  if (!isHydrated) {
    return (
      <button disabled className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-400 rounded-xl px-4 py-3.5 opacity-60 cursor-not-allowed font-medium transition-all">
        <GoogleIcon className="grayscale opacity-50" />
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {user ? (
        // ALREADY LOGGED IN STATE
        <div className="flex items-center gap-4 p-4 bg-violet-50 border border-violet-100 rounded-xl">
          {user.photoURL && (
            <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full border border-violet-200" />
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-slate-800 truncate">{user.displayName}</span>
            <span className="text-xs text-slate-500 truncate">{user.email}</span>
          </div>
          <div className="animate-spin w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        // SIGN IN BUTTON
        <button 
            onClick={handleSignIn} 
            disabled={isSigning} 
            className={`
                group relative w-full flex items-center justify-center gap-3 
                bg-white text-slate-700 border border-slate-200 
                hover:bg-slate-50 hover:border-slate-300 hover:shadow-md 
                active:scale-[0.99]
                rounded-xl px-4 py-3.5 font-medium transition-all duration-200
                ${isSigning ? 'opacity-70 cursor-wait' : ''}
            `}
        >
          {isSigning ? (
             <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
          ) : (
             <GoogleIcon />
          )}
          <span>{isSigning ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600 animate-fade-in">
            <span className="mt-0.5 font-bold">!</span>
            {error}
        </div>
      )}
    </div>
  );
}

// Simple Google Icon Component
function GoogleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}