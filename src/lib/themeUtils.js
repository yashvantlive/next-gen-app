import { MOODS } from './moodConfig';

/**
 * 🛡️ THEME SAFETY UTILITY
 * Centralized logic to prevent "Cannot read properties of undefined (reading 'colors')"
 * crashes across the entire application.
 * * @param {string} currentMood - The mood key passed from props (e.g., 'focused', 'chill')
 * @returns {object} A valid mood object from MOODS config (or default if invalid)
 */
export const getSafeTheme = (currentMood) => {
  // 1. Identify a safe fallback (first available mood in config)
  const availableMoods = Object.keys(MOODS);
  // Default to 'productive' or the first key found, ensuring we always have a string
  const defaultMoodKey = availableMoods[0] || 'productive';
  
  // 2. Validate the requested mood
  // Checks if currentMood exists (is not null/undefined) AND maps to a valid object
  const isValidMood = currentMood && MOODS[currentMood];

  // 3. Return valid theme or fallback
  // Returns the FULL mood object (contains colors, icon, quote, etc.)
  return isValidMood ? MOODS[currentMood] : MOODS[defaultMoodKey];
};