/**
 * Calculates the satisfying "Focus Score" based on daily activity.
 * Pure function: Deterministic output for given inputs.
 */
export const calculateFocusScore = (metrics, moodMultiplier = 1) => {
  const {
    tasksDone = 0,
    academicTopicsDone = 0,
    syllabusPercent = 0,
    streak = 0
  } = metrics;

  // Weighted scoring system
  const taskScore = tasksDone * 10;
  const academicScore = academicTopicsDone * 25; // Higher weight for study
  const progressScore = syllabusPercent * 2;
  const streakBonus = streak * 15;

  const rawScore = (taskScore + academicScore + progressScore + streakBonus);
  
  // Apply mood multiplier (e.g., Beast mode amplifies score but requires more effort)
  return Math.round(rawScore * moodMultiplier);
};