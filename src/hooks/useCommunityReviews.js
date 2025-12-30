import { useState, useEffect } from 'react';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db, onAuthChange } from '../lib/firebaseClient';

export function useCommunityReviews() {
  const [reviews, setReviews] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. पहले Auth State चेक करें
    const unsubAuth = onAuthChange((user) => {
      // अगर यूजर है, तभी फेच करें (ताकि Permission/Transport एरर न आये)
      // अगर आप पब्लिक रिव्यु चाहते हैं, तो Firestore Rules में 'allow read: if true;' करना होगा
      // अभी के लिए हम इसे सेफ बना रहे हैं:
      if (user) {
        setIsReady(true);
      } else {
        setReviews([]); // क्लियर रिव्यु अगर लॉगआउट है
        setIsReady(false);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Only approved reviews, ordered by latest
    const q = query(
      collection(db, 'testimonials'), 
      where("approved", "==", true), 
      orderBy("createdAt", "desc"), 
      limit(3) 
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate().toISOString() 
      }));
      setReviews(data);
    }, (err) => {
      // Silent fail for permission/transport errors to keep console clean
      if (err.code !== 'permission-denied' && !err.message.includes('transport')) {
        console.error("Review Stream Error:", err);
      }
    });

    return () => unsub();
  }, [isReady]);

  return reviews;
}