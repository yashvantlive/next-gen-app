/**
 * -----------------------------------------------------------------------------
 * ⚙️ PRODUCTIVITY ENGINE
 * -----------------------------------------------------------------------------
 * Analyzes user activity to determine momentum and energy levels.
 * Returns a "Pulse" object that UI can use to show relevant messages.
 */

export const analyzeProductivity = ({
    tasksCompletedToday,
    academicTopicsCovered,
    syllabusPercent,
    streak
  }) => {
    
    // 1. Calculate Daily Output Score (0-100)
    // Formula: (Tasks * 15) + (Topics * 25) capped at 100
    const rawOutput = (tasksCompletedToday * 15) + (academicTopicsCovered * 25);
    const dailyOutput = Math.min(rawOutput, 100);
  
    // 2. Determine Momentum State
    let status = "neutral";
    let message = "System ready.";
    let color = "slate";
  
    if (dailyOutput === 0) {
      status = "idle";
      message = "Initiating launch sequence...";
      color = "slate";
    } else if (dailyOutput < 40) {
      status = "warming_up";
      message = "Engine warming up. Keep going.";
      color = "blue";
    } else if (dailyOutput < 80) {
      status = "cruising";
      message = "Steady pace detected. Optimum flow.";
      color = "violet";
    } else {
      status = "peak_performance";
      message = "Systems at max capacity. Excellent work.";
      color = "emerald";
    }
  
    // 3. Burnout Check (High output but low consistency logic could go here)
    
    return {
      dailyOutput,
      status,
      message,
      color
    };
  };