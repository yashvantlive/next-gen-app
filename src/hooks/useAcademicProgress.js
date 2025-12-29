import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export function useAcademicProgress(userId) {
  const [progress, setProgress] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    if (!userId) return;

    const ref = collection(db, 'academic_progress', userId, 'subjects');
    
    const unsub = onSnapshot(ref, (snap) => {
      let t = 0, c = 0;
      snap.docs.forEach(doc => {
        const data = doc.data();
        const topics = data.topics || {};
        c += Object.values(topics).filter(Boolean).length;
        t += Object.keys(topics).length || 0;
      });
      setProgress({ total: t, completed: c });
    }, (err) => {
      if (err.code !== 'permission-denied') console.error("Academic Stream Error:", err);
    });

    return () => unsub();
  }, [userId]);

  return progress;
}