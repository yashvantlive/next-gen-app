export const BACKGROUND_TRACKS = [
  {
    id: "lofi_study",
    name: "Lofi Study",
    artist: "Ambient",
    // 👇 Space handled with %20
    url: "/music/lofi%20study.mp3", 
    duration: "Music",
    mood: "Focus",
    color: "#6366F1" // Indigo
  },
  {
    id: "better_day",
    name: "Better Day",
    artist: "Ambient",
    url: "/music/better%20day.mp3",
    duration: "Music",
    mood: "Positive",
    color: "#F59E0B" // Amber
  },
  {
    id: "good_night",
    name: "Good Night Lofi",
    artist: "Ambient",
    url: "/music/good%20night%20lofi.mp3",
    duration: "Music",
    mood: "Sleep",
    color: "#10B981" // Emerald
  },
  {
    id: "lazy_day",
    name: "Lazy Day",
    artist: "Chill",
    url: "/music/lazy%20day.mp3",
    duration: "Music",
    mood: "Relaxed",
    color: "#EC4899" // Pink
  },
  {
    id: "lost_dreams",
    name: "Lost in Dreams",
    artist: "Dreamy",
    url: "/music/lost%20in%20dreams.mp3",
    duration: "Music",
    mood: "Creative",
    color: "#8B5CF6" // Violet
  },
  {
    id: "morning_garden",
    name: "Morning Garden",
    artist: "Acoustic",
    url: "/music/morning%20garden%20acoustic%20chill.mp3",
    duration: "Music",
    mood: "Nature",
    color: "#22C55E" // Green
  },
  {
    id: "gardens_chill",
    name: "Stylish Chill",
    artist: "Vibes",
    url: "/music/gardens%20stylish%20chill.mp3",
    duration: "Music",
    mood: "Cool",
    color: "#0EA5E9" // Sky Blue
  },
  {
    id: "for_her",
    name: "For Her Chill",
    artist: "Soft",
    url: "/music/for%20her%20chill.mp3",
    duration: "Music",
    mood: "Romantic",
    color: "#F43F5E" // Rose
  }
];

export const getTrackById = (trackId) => {
  return BACKGROUND_TRACKS.find(t => t.id === trackId) || BACKGROUND_TRACKS[0];
};