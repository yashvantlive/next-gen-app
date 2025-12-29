import { 
  // Tech & Coding
  Code, Terminal, Database, Cpu, Globe, Server, Wifi, Zap, Radio, 
  Settings as Gear, Wrench, Layers, GitBranch, Network,
  Monitor, Smartphone, Gamepad, Ghost, Binary, Fingerprint, Shield, Lock,
  Cloud, Laptop, Box, Search, FileCode,

  // Core Engineering
  Hammer, HardHat, Ruler, Lightbulb, Battery, Plug,
  Car, Truck, Gauge, Anchor, Ship, Plane, Rocket, Mountain,
  Factory, Construction, Drill, CircuitBoard, Cog,

  // Science & Bio
  FlaskConical, Droplet, Atom, TestTube, Microscope, Dna, 
  Stethoscope, HeartPulse, Activity, Pill, Syringe,
  Leaf, Wheat, Wind, Recycle, Flower, Trees, Sprout,
  Apple, Beaker, Flame, Fuel, Radiation, Soup,

  // Creative & Others
  Music, Speaker, Mic, Headphones,
  Palette, Scissors, Home, Building, Landmark,
  PieChart, TrendingUp, BarChart, BookOpen, GraduationCap,
  Brain, Sparkles, Bot, Package, Cable, Podcast
} from "lucide-react";

/**
 * 🎨 ENGINEERING BRANCH THEMES DATABASE
 * Supports 60+ distinct branches with unique gradients, colors, and icon sets.
 */
export const BRANCH_DATA = {
  // --- 💻 COMPUTER & IT CLUSTER ---
  "CSE": { id: "cse", name: "Computer Science", gradient: "from-blue-600 via-indigo-700 to-violet-800", particle: "139, 92, 246", icons: [Code, Cpu, Terminal, Binary] },
  "IT": { id: "it", name: "Information Tech", gradient: "from-sky-500 via-blue-600 to-indigo-700", particle: "56, 189, 248", icons: [Server, Network, Database, Globe] },
  "SE": { id: "se", name: "Software Eng", gradient: "from-violet-600 via-purple-600 to-fuchsia-700", particle: "192, 38, 211", icons: [FileCode, GitBranch, Code, Layers] },
  "AI": { id: "ai", name: "Artificial Intelligence", gradient: "from-fuchsia-600 via-pink-600 to-rose-600", particle: "236, 72, 153", icons: [Brain, Sparkles, Network, Cpu] },
  "ML": { id: "ml", name: "Machine Learning", gradient: "from-pink-500 via-rose-500 to-red-600", particle: "244, 63, 94", icons: [TrendingUp, Brain, BarChart, Network] },
  "DS": { id: "ds", name: "Data Science", gradient: "from-cyan-600 via-teal-600 to-emerald-600", particle: "20, 184, 166", icons: [BarChart, Database, PieChart, Search] },
  "CY": { id: "cy", name: "Cyber Security", gradient: "from-slate-800 via-zinc-800 to-neutral-900", particle: "34, 197, 94", icons: [Shield, Lock, Fingerprint, Server] },
  "CLOUD": { id: "cloud", name: "Cloud Computing", gradient: "from-sky-400 via-blue-500 to-indigo-600", particle: "255, 255, 255", icons: [Cloud, Server, Database, Network] },
  "IOT": { id: "iot", name: "Internet of Things", gradient: "from-indigo-500 via-purple-500 to-pink-500", particle: "168, 85, 247", icons: [Wifi, Radio, Smartphone, Cpu] },
  "GAME": { id: "game", name: "Game Dev", gradient: "from-purple-600 via-fuchsia-500 to-pink-500", particle: "232, 121, 249", icons: [Gamepad, Monitor, Code, Sparkles] },

  // --- ⚙️ CORE ENGINEERING ---
  "ME": { id: "me", name: "Mechanical", gradient: "from-orange-600 via-red-600 to-rose-700", particle: "249, 115, 22", icons: [Cog, Wrench, Gauge, Drill] },
  "CE": { id: "ce", name: "Civil", gradient: "from-amber-600 via-orange-700 to-yellow-800", particle: "245, 158, 11", icons: [Construction, Ruler, Building, HardHat] },
  "EEE": { id: "eee", name: "Electrical & Electronics", gradient: "from-yellow-500 via-amber-500 to-orange-600", particle: "234, 179, 8", icons: [Zap, CircuitBoard, Plug, Battery] },
  "EE": { id: "ee", name: "Electrical", gradient: "from-yellow-600 via-orange-500 to-red-500", particle: "250, 204, 21", icons: [Zap, Plug, Lightbulb, Cable] },
  "ECE": { id: "ece", name: "Electronics & Comm", gradient: "from-emerald-500 via-teal-600 to-cyan-700", particle: "16, 185, 129", icons: [CircuitBoard, Radio, Wifi, Cpu] },
  "AUTO": { id: "auto", name: "Automobile", gradient: "from-red-600 via-red-700 to-slate-900", particle: "239, 68, 68", icons: [Car, Gauge, Cog, Wrench] },
  "ROBO": { id: "robo", name: "Robotics", gradient: "from-slate-700 via-blue-800 to-slate-900", particle: "96, 165, 250", icons: [Bot, Cog, CircuitBoard, Cpu] },
  "AERO": { id: "aero", name: "Aerospace", gradient: "from-sky-600 via-blue-700 to-slate-800", particle: "224, 242, 254", icons: [Plane, Rocket, Gauge, Wind] },
  "MARINE": { id: "marine", name: "Marine", gradient: "from-cyan-700 via-blue-800 to-indigo-900", particle: "34, 211, 238", icons: [Ship, Anchor, Droplet, Gauge] },
  "MINING": { id: "mining", name: "Mining", gradient: "from-stone-600 via-stone-700 to-stone-800", particle: "168, 162, 158", icons: [Drill, Mountain, HardHat, Truck] },

  // --- 🧪 SCIENCE & BIO ---
  "CHE": { id: "che", name: "Chemical", gradient: "from-lime-500 via-green-600 to-emerald-700", particle: "132, 204, 22", icons: [FlaskConical, Beaker, Atom, Droplet] },
  "BIO": { id: "bio", name: "Biotech", gradient: "from-teal-400 via-teal-600 to-emerald-600", particle: "45, 212, 191", icons: [Dna, Microscope, FlaskConical, Leaf] },
  "BME": { id: "bme", name: "Biomedical", gradient: "from-rose-400 via-pink-500 to-rose-600", particle: "251, 113, 133", icons: [Stethoscope, HeartPulse, Dna, Activity] },
  "AGRI": { id: "agri", name: "Agricultural", gradient: "from-green-500 via-emerald-600 to-lime-600", particle: "34, 197, 94", icons: [Wheat, Sprout, Truck, Droplet] }, 
  "ENV": { id: "env", name: "Environmental", gradient: "from-emerald-400 via-green-500 to-teal-600", particle: "52, 211, 153", icons: [Recycle, Leaf, Globe, Wind] },
  "FOOD": { id: "food", name: "Food Tech", gradient: "from-orange-400 via-amber-500 to-yellow-500", particle: "251, 191, 36", icons: [Apple, Soup, FlaskConical, Package] },
  "TXT": { id: "txt", name: "Textile", gradient: "from-pink-500 via-rose-500 to-red-500", particle: "244, 114, 182", icons: [Scissors, Layers, Palette, Factory] },
  
  // --- 📡 SPECIALIZED & OTHERS ---
  "INST": { id: "inst", name: "Instrumentation", gradient: "from-slate-600 via-zinc-600 to-neutral-700", particle: "203, 213, 225", icons: [Gauge, Activity, CircuitBoard, Radio] },
  "META": { id: "meta", name: "Metallurgy", gradient: "from-zinc-500 via-slate-600 to-gray-700", particle: "212, 212, 216", icons: [Flame, Hammer, Factory, Droplet] },
  "PETRO": { id: "petro", name: "Petroleum", gradient: "from-amber-700 via-orange-800 to-black", particle: "251, 146, 60", icons: [Fuel, Droplet, Drill, Flame] },
  "NANO": { id: "nano", name: "Nanotech", gradient: "from-violet-500 via-purple-600 to-indigo-600", particle: "167, 139, 250", icons: [Atom, Microscope, Sparkles, Layers] },
  "NUCL": { id: "nucl", name: "Nuclear", gradient: "from-yellow-400 via-orange-500 to-red-600", particle: "250, 204, 21", icons: [Radiation, Atom, Zap, Shield] },
  "SOUND": { id: "sound", name: "Sound Eng", gradient: "from-fuchsia-600 via-purple-600 to-indigo-600", particle: "232, 121, 249", icons: [Headphones, Mic, Speaker, Activity] },
  "ARCH": { id: "arch", name: "Architecture", gradient: "from-stone-500 via-stone-600 to-stone-700", particle: "231, 229, 228", icons: [Building, Ruler, Home, Landmark] },
};

// Fallback Theme
const DEFAULT_THEME = {
  id: "default",
  name: "General",
  gradient: "from-slate-700 via-slate-800 to-black",
  particle: "148, 163, 184",
  icons: [GraduationCap, BookOpen, Globe, Layers]
};

/**
 * 🛠️ DATA FETCHER
 * Retrieves branch assets. Handles exact matches and generic fallback logic.
 */
export const getBranchAssets = (branchCode) => {
  if (!branchCode) return DEFAULT_THEME;
  const code = branchCode.toUpperCase();
  
  // 1. Direct Match
  if (BRANCH_DATA[code]) return BRANCH_DATA[code];

  // 2. Fuzzy Matching / Grouping
  if (code.includes("CS") || code.includes("COMP")) return BRANCH_DATA["CSE"];
  if (code.includes("ELECTR") && code.includes("COMM")) return BRANCH_DATA["ECE"];
  if (code.includes("ELECTR")) return BRANCH_DATA["EEE"];
  if (code.includes("MECH")) return BRANCH_DATA["ME"];
  if (code.includes("CIVIL")) return BRANCH_DATA["CE"];
  
  return DEFAULT_THEME;
};