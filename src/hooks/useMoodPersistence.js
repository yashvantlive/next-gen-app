import { useState, useEffect } from 'react';
import { MOODS } from '../lib/moodConfig';

export function useMoodPersistence() {
  const [currentMood, setCurrentMood] = useState("focused");

  // Hydrate from Memory
  useEffect(() => {
    const saved = localStorage.getItem("userMood");
    if (saved && MOODS[saved]) {
      setCurrentMood(saved);
    }
  }, []);

  // Persist to Memory
  const setMood = (moodId) => {
    if (MOODS[moodId]) {
      setCurrentMood(moodId);
      localStorage.setItem("userMood", moodId);
    }
  };

  return { currentMood, setMood, theme: MOODS[currentMood] };
}