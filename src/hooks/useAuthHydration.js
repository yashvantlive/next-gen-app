import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, getUserProfile } from '../lib/firebaseClient';

export function useAuthHydration() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }
      setUser(u);
      
      try {
        const p = await getUserProfile(u.uid);
        if (!p?.branchId) {
          router.push("/onboarding");
          return;
        }
        setProfile(p);
      } catch (err) {
        console.error("Hydration Error:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  return { user, profile, loading };
}