import { 
  Code, Cpu, Settings, Hammer, Zap, PenTool, Database, Radio 
} from "lucide-react";

export const getBranchTheme = (branchCode) => {
  const code = branchCode?.toUpperCase() || "DEFAULT";

  const THEMES = {
    // Computer Science & IT
    "CSE": { 
      color: "from-blue-600 to-cyan-600", 
      icon: <Code size={120} className="text-white opacity-10 rotate-12" />,
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"
    },
    "IT": { 
      color: "from-sky-600 to-blue-500", 
      icon: <Database size={120} className="text-white opacity-10 -rotate-6" />,
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
    },

    // Mechanical
    "ME": { 
      color: "from-orange-600 to-red-600", 
      icon: <Settings size={120} className="text-white opacity-10 animate-spin-slow" />, // Gear Icon
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"
    },

    // Civil
    "CE": { 
      color: "from-amber-600 to-yellow-600", 
      icon: <Hammer size={120} className="text-white opacity-10 -rotate-45" />,
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')]"
    },

    // Electrical
    "EEE": { 
      color: "from-yellow-500 to-amber-500", 
      icon: <Zap size={120} className="text-white opacity-10 rotate-12" />,
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/lightning.png')]"
    },
    "ECE": { 
      color: "from-emerald-600 to-green-600", 
      icon: <Radio size={120} className="text-white opacity-10" />,
      // ✅ FIXED: Replaced external image with CSS gradient stripes
      pattern: "bg-[linear-gradient(135deg,#ffffff10_25%,transparent_25%,transparent_50%,#ffffff10_50%,#ffffff10_75%,transparent_75%,transparent)] bg-[length:20px_20px]"
    },

    // Default Fallback
    "DEFAULT": { 
      color: "from-violet-600 to-indigo-600", 
      icon: <PenTool size={120} className="text-white opacity-10" />,
      pattern: "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
    }
  };

  return THEMES[code] || THEMES["DEFAULT"];
};