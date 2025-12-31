import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ✅ Ensure proper named imports
import { onAuthChange, getUserProfile } from '../lib/firebaseClient';

export function useAuthHydration() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // Safety check: Verify imports exist before running effect
    if (typeof onAuthChange !== 'function' || typeof getUserProfile !== 'function') {
      console.error("🔥 Critical Error: Firebase functions not imported correctly. Check src/lib/firebaseClient.js");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!isMounted) return;

      // 1. If not logged in -> Redirect to Login
      if (!currentUser) {
        console.log("🚫 No user found, redirecting to login...");
        router.replace("/auth/login"); // 'replace' prevents back-button loops
        return;
      }

      // 2. Set User State
      setUser(currentUser);
      
      try {
        // 3. Fetch Profile
        const userProfile = await getUserProfile(currentUser.uid);
        
        if (!isMounted) return;

        // 4. If profile missing or incomplete (no branchId) -> Redirect to Onboarding
        if (!userProfile || !userProfile.branchId) {
          console.log("⚠️ Profile incomplete, redirecting to onboarding...");
          router.replace("/onboarding");
          return;
        }

        setProfile(userProfile);
      } catch (err) {
        console.error("❌ Auth Hydration Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [router]);

  return { user, profile, loading };
}