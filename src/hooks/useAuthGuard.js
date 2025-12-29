"use client";
import { useState, useEffect } from "react";
import { onAuthChange, signOut } from "../lib/firebaseClient";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      if (!u) {
        setAuthUser(null);
        router.push("/auth/login");
        return;
      }
      setAuthUser(u);
      // We don't set loading false here because profile data needs to load.
      // Loading state is managed by useProfileData mostly, but we return auth loading here.
    });
    return () => unsub();
  }, [router]);

  function handleLogout() {
    if (confirm("Log out?")) signOut().then(() => router.push("/auth/login"));
  }

  return { authUser, setAuthUser, loading, setLoading, handleLogout };
}