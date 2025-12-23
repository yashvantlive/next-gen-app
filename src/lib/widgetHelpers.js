/**
 * Shared utilities for Clean UI Widgets
 */

export const COLORS = {
  optimal: "#10b981",    // Green-500 (Healthy/Good)
  caution: "#f59e0b",    // Amber-500 (Warning)
  critical: "#ef4444",   // Red-500 (Danger)
  neutral: "#64748b",    // Slate-500 (Inactive/Text)
  info: "#3b82f6",       // Blue-500 (Information)
  primary: "#7c3aed",    // Violet-600 (Brand)
  bgLight: "#ffffff",    // White
  border: "#e2e8f0",     // Slate-200
};

export function daysBetween(d1, d2) {
  if (!d1 || !d2) return 0;
  const diff = Math.abs(new Date(d1) - new Date(d2));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function normalize(val, max) {
  return Math.min(100, Math.max(0, (val / max) * 100));
}