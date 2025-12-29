"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // Changed to onSnapshot
import { getUserProfile, db } from "../lib/firebaseClient";
import { useRouter } from "next/navigation";

export function useProfileData(authUser, setLoading) {
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authUser) return;

    // Real-time listener setup
    const userRef = doc(db, "users", authUser.uid);
    
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setIsAdmin(data?.role === "admin");
        if (setLoading) setLoading(false);
      } else {
        // If user doc doesn't exist yet
        router.push("/onboarding");
      }
    }, (error) => {
      console.error("Profile sync error:", error);
      if (setLoading) setLoading(false);
    });

    return () => unsub(); // Cleanup listener on unmount
  }, [authUser, router, setLoading]);

  return { profile, isAdmin };
}