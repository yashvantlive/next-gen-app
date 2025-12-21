"use client";
import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState(null);
  const hydratedRef = useRef(false);
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const unsub = onAuthChange(async (u) => {
      if (!u) {
        router.push("/auth/login");
        return;
      }

      try {
        const profile = await getUserProfile(u.uid);
        const admin = profile?.role === "admin";
        setIsAdmin(admin);

        if (!admin) {
          router.push("/profile");
          return;
        }

        // Fetch user count
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        setUserCount(usersSnapshot.size);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, db]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-gray-600">Loading admin panel…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 text-sm mt-1">Dashboard overview</p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Back to Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="flex items-center gap-6">
              <div className="bg-blue-50 rounded-full p-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{userCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

