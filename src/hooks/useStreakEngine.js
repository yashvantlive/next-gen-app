import { useState, useEffect } from 'react';

export function useStreakEngine(activityCount) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("lastActiveDate");
    const currentStreak = parseInt(localStorage.getItem("userStreak") || "0");

    if (activityCount > 0) {
      if (lastActive !== today) {
        // First activity of the new day
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
          // Continued streak
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          localStorage.setItem("userStreak", newStreak.toString());
        } else {
          // Broken streak or fresh start
          setStreak(1);
          localStorage.setItem("userStreak", "1");
        }
        localStorage.setItem("lastActiveDate", today);
      } else {
        // Already active today
        setStreak(currentStreak);
      }
    } else {
      setStreak(currentStreak);
    }
  }, [activityCount]);

  return streak;
}