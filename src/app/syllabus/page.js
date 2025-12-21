"use client";
import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function SyllabusPage() {
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const router = useRouter();

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

      const p = await getUserProfile(u.uid);
      if (!p) {
        router.push("/onboarding");
        return;
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Syllabus</h1>
          <p className="text-gray-600 text-sm mt-1">Course syllabus and curriculum</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600 text-center py-12">Syllabus content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
