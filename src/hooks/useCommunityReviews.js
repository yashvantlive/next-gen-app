import { useState, useEffect } from 'react';
import { collection, query, where, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export function useCommunityReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Only approved reviews, ordered by latest
    const q = query(
      collection(db, 'testimonials'), 
      where("approved", "==", true), 
      orderBy("createdAt", "desc"), // Ensure latest first
      limit(3) // Strict limit of 3 cards
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Convert timestamp for UI stability
        createdAt: d.data().createdAt?.toDate().toISOString() 
      }));
      setReviews(data);
    }, (err) => {
      if (err.code !== 'permission-denied') console.error("Review Stream Error:", err);
    });

    return () => unsub();
  }, []);

  return reviews;
}