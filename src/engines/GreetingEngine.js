export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Late night hustle";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};