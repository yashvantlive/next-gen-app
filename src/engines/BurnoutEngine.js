/**
 * Detects if the user is pushing too hard with diminishing returns.
 */
export const checkBurnoutRisk = (focusScore, moodId) => {
  // If user is in "Beast Mode" but score is low late in the day
  const hour = new Date().getHours();
  
  if (moodId === 'beast' && focusScore < 50 && hour > 20) {
    return {
      risk: true,
      suggestion: "chill",
      message: "High effort detected with low output. Switch to Chill Mode?"
    };
  }
  
  // If user is "Tired" but score is surprisingly high
  if (moodId === 'tired' && focusScore > 200) {
     return {
      risk: false,
      suggestion: "focused",
      message: "You're flowing better than expected. Upgrade mood?"
    };
  }

  return { risk: false, message: "" };
};