"use client";
import React, { useState } from "react";
import { X, Send, FileText, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

export default function RequestResourceModal({ isOpen, onClose, authUser }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "Syllabus",
    subject: "",
    details: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) return alert("Please login to submit a request.");
    
    setLoading(true);
    try {
      // Firebase me request save karna
      await addDoc(collection(db, "resource_requests"), {
        userId: authUser.uid,
        userEmail: authUser.email,
        requestType: formData.type,
        subject: formData.subject,
        details: formData.details,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ type: "Syllabus", subject: "", details: "" });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Request Content
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Request Sent!</h4>
              <p className="text-slate-500 mt-2">We will try to upload this resource soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Selection */}
              <div>
                <div className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resource Type</div>
                <div className="grid grid-cols-3 gap-2">
                  {["Syllabus", "PYQ", "Todo/Notes"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        formData.type === t
                          ? "bg-violet-600 text-white border-violet-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="resource-subject" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject / Branch</label>
                <input 
                  id="resource-subject"
                  name="resource-subject"
                  type="text" 
                  required
                  placeholder="e.g. Mathematics II, CSE Branch"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm font-medium"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              {/* Details Textarea */}
              <div>
                <label htmlFor="resource-details" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Additional Details</label>
                <textarea 
                  id="resource-details"
                  name="resource-details"
                  required
                  rows="4"
                  placeholder="Describe specifically what you need..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm font-medium resize-none"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : <>Submit Request <Send size={16} /></>}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}