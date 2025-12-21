"use client";
import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, setUserProfile } from "@/lib/firebaseClient";
import { getSuggestedSkills } from "@/lib/skills";
import { useRouter } from "next/navigation";

const BRANCHES = ["Computer Science", "IT", "Electrical", "Mechanical", "Civil", "Chemical", "Electronics", "Biotechnology", "Other"];

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const hydratedRef = useRef(false);
  const [form, setForm] = useState({
    university: "",
    semester: "",
    branch: "Computer Science",
    stream: "",
    year: "",
  });
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState(getSuggestedSkills("Computer Science"));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
      setUser(u);
      // If profile exists, prefill form for editing; otherwise continue onboarding
      const profile = await getUserProfile(u.uid);
      if (profile) {
        setForm((s) => ({
          university: profile.university || "",
          semester: profile.semester || "",
          branch: profile.branch || "Computer Science",
          stream: profile.stream || "",
          year: profile.year || "",
        }));
        setSkills(profile.skills || []);
        setSuggestions(getSuggestedSkills(profile.branch || "Computer Science"));
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  useEffect(() => {
    setSuggestions(getSuggestedSkills(form.branch));
  }, [form.branch]);





  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // basic validation
      if (!form.university || !form.semester || !form.branch || !form.stream || !form.year) {
        setError("Please fill all fields");
        setSaving(false);
        return;
      }
      if (!skills.length) {
        setError("Please choose at least one skill");
        setSaving(false);
        return;
      }
      const payload = {
        ...form,
        skills,
        role: "user", // Ensure role is set on save
        updatedAt: new Date().toISOString(),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
      };
      await setUserProfile(user.uid, payload);
      setSuccess("Profile saved");
      setSaving(false);
    } catch (err) {
      console.error(err);
      const msg = (err && err.message) || String(err);
      if (/permission|insufficient/i.test(msg)) {
        setError(
          "Permission denied: your Firestore rules may be blocking this write. See README (Firestore security rules) to allow authenticated users to write their own profile."
        );
      } else {
        setError(msg);
      }
      setSaving(false);
    }
  }

  useEffect(() => {
    let t;
    if (success) {
      t = setTimeout(() => {
        setSuccess(null);
        router.push("/profile");
      }, 900);
    }
    return () => clearTimeout(t);
  }, [success, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-xl font-semibold mb-2 text-gray-900">Onboarding</h1>
        <p className="text-sm text-gray-700 mb-2">A few quick questions to personalize your experience.</p>
        {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-800 mb-1">University / Board</label>
            <input className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400" value={form.university} onChange={(e) => updateField("university", e.target.value)} placeholder="e.g., Example University" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-800 mb-1">Branch / Course</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" value={form.branch} onChange={(e) => updateField("branch", e.target.value)}>
                {BRANCHES.map((b) => (<option key={b} value={b}>{b}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-800 mb-1">Stream</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400" value={form.stream} onChange={(e) => updateField("stream", e.target.value)} placeholder="e.g., IT" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-800 mb-1">Year</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" value={form.year} onChange={(e) => updateField("year", e.target.value)}>
                <option value="">Select year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-800 mb-1">Semester</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900" value={form.semester} onChange={(e) => updateField("semester", e.target.value)}>
                <option value="">Select semester</option>
                {Array.from({ length: 8 }).map((_, i) => (<option key={i+1} value={String(i+1)}>{i+1}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-800 mb-1">Skills (comma separated)</label>
            <input value={skills.join(", ")} onChange={(e) => setSkills(e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} placeholder="e.g., JavaScript, React" className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400" />

            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    // toggle suggestion into skills
                    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
                  }}
                  aria-pressed={skills.includes(s)}
                  className={`px-2 py-1 border rounded text-sm ${skills.includes(s) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button disabled={saving} className="px-4 py-2 rounded bg-black text-white">
              {saving ? "Saving…" : "Save and continue"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
