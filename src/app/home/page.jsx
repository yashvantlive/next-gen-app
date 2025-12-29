"use client";
import React from 'react';
import { useAuthHydration } from '../../hooks/useAuthHydration';
import { useMoodPersistence } from '../../hooks/useMoodPersistence';
import { useRealtimeTodos } from '../../hooks/useRealtimeTodos';
import { useAcademicProgress } from '../../hooks/useAcademicProgress';
import { useCommunityReviews } from '../../hooks/useCommunityReviews';
import { useStreakEngine } from '../../hooks/useStreakEngine';
import HomeShell from './HomeShell';

export default function HomePage() {
  // 1. Auth & Profile
  const { user, profile, loading } = useAuthHydration();
  
  // 2. Mood Engine
  const { currentMood, setMood, theme } = useMoodPersistence();
  
  // 3. Real-time Data
  const todos = useRealtimeTodos(user?.uid);
  const academicProgress = useAcademicProgress(user?.uid);
  const reviews = useCommunityReviews();
  
  // 4. Activity Streak Logic
  const activityCount = todos.filter(t => 
    t.status === 'done' && 
    new Date(t.completedAt?.seconds * 1000).toDateString() === new Date().toDateString()
  ).length;
  
  const streak = useStreakEngine(activityCount);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium animate-pulse">Initializing System...</p>
    </div>
  );

  return (
    <HomeShell 
      user={user}
      profile={profile}
      currentMood={currentMood}
      theme={theme}
      onMoodChange={setMood}
      todos={todos}
      academicProgress={academicProgress}
      reviews={reviews}
      streak={streak}
    />
  );
}