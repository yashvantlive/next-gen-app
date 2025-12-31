"use client";
import { useState, useEffect } from "react";
// ✅ Fixed Import: Now 'logOut' exists in firebaseClient
import { signInWithGoogle, logOut, auth } from "../lib/firebaseClient";
import { useRouter } from "next/navigation"; // ✅ Needed to redirect user

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      
      // If we are redirecting, don't stop loading
      if (result?.redirected) return;

      console.log("Login Success, redirecting...");
      // ✅ FIX: Force navigation to home
      router.push("/home"); 
      
    } catch (err) {
      console.error("Login failed", err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
    >
      {loading ? "Signing in..." : "Sign In with Google"}
    </button>
  );
}