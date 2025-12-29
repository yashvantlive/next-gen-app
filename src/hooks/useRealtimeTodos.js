import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export function useRealtimeTodos(userId) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'todos'), where("userId", "==", userId));
    
    // Silent fail permission handling
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTodos(data);
    }, (err) => {
      if (err.code !== 'permission-denied') console.error("Todo Stream Error:", err);
    });

    return () => unsub();
  }, [userId]);

  return todos;
}