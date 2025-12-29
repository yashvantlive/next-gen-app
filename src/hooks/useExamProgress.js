"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

export function useExamProgress(userId) {
  const [activeExams, setActiveExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Listener for user_progress/{uid}/exams subcollection
    const ref = collection(db, "user_progress", userId, "exams");
    
    const unsub = onSnapshot(ref, (snapshot) => {
      const exams = snapshot.docs.map(doc => {
        const data = doc.data();
        // Count how many topics are marked "true"
        const completedCount = data.completedTopics 
          ? Object.values(data.completedTopics).filter(v => v === true).length 
          : 0;
        
        // Formatting ID (e.g. "GATE_ME" -> "GATE / ME")
        const formattedName = doc.id.replace('_', ' / ');

        // Assign random color for UI if not stored
        const colors = ["bg-violet-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];
        const randomColor = colors[doc.id.length % colors.length];

        return {
          id: doc.id,
          name: formattedName,
          covered: completedCount,
          total: 100, // Note: Total topics count needs syllabus data, defaulting to 100 for visual scale
          percent: Math.min(100, completedCount), // Visual cap
          color: randomColor
        };
      });
      
      setActiveExams(exams);
      setLoading(false);
    });

    return () => unsub();
  }, [userId]);

  return { activeExams, loading };
}