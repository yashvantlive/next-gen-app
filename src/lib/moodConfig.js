import { 
  Zap, Coffee, Flame, BookOpen, BatteryLow 
} from "lucide-react";

export const MOODS = {
  focus: {
    label: "Deep Focus",
    icon: <Zap size={16} />,
    quote: "Flow state is where the magic happens.",
    multiplier: 1.5,
    colors: {
      bg_app: "bg-indigo-50",
      text_main: "text-indigo-950",
      text_sub: "text-indigo-500",
      accent_bg: "bg-indigo-600",
      border: "border-indigo-100",
      shadow: "shadow-indigo-200/50",
      gradient_text: "from-indigo-600 to-violet-600",
      
      // Card Specifics
      card_bg: "bg-white",
      card_border: "border-indigo-100",
      
      // Components
      radar_color: "text-indigo-600",
      radar_bg: "bg-indigo-50",
      progress_bar: "from-indigo-500 to-violet-500",
      
      // Buttons
      solid_button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
      soft_button: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      
      // Sticky Note
      sticky_bg: "bg-indigo-50/50",
      sticky_border: "border-indigo-200",
      
      // Share Card
      share_gradient: "from-indigo-600 to-violet-600"
    }
  },
  chill: {
    label: "Chill Mode",
    icon: <Coffee size={16} />,
    quote: "Relax. Recharge. Reset.",
    multiplier: 1.0,
    colors: {
      bg_app: "bg-emerald-50/60",
      text_main: "text-emerald-900",
      text_sub: "text-emerald-600",
      accent_bg: "bg-emerald-600",
      border: "border-emerald-200",
      shadow: "shadow-emerald-100",
      gradient_text: "from-emerald-600 to-teal-600",
      
      card_bg: "bg-white/90",
      card_border: "border-emerald-100",
      
      radar_color: "text-emerald-600",
      radar_bg: "bg-emerald-50",
      progress_bar: "from-emerald-400 to-teal-500",
      
      solid_button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
      soft_button: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      
      sticky_bg: "bg-emerald-50/50",
      sticky_border: "border-emerald-200",
      
      share_gradient: "from-emerald-500 to-teal-600"
    }
  },
  hustle: {
    label: "Hustle Mode",
    icon: <Flame size={16} />,
    quote: "Dreams demand hustle.",
    multiplier: 2.0,
    colors: {
      bg_app: "bg-orange-50",
      text_main: "text-orange-950",
      text_sub: "text-orange-600",
      accent_bg: "bg-orange-600",
      border: "border-orange-200",
      shadow: "shadow-orange-200/50",
      gradient_text: "from-orange-600 to-red-600",
      
      card_bg: "bg-white",
      card_border: "border-orange-200",
      
      radar_color: "text-orange-600",
      radar_bg: "bg-orange-50",
      progress_bar: "from-orange-500 to-red-500",
      
      solid_button: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200",
      soft_button: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      
      sticky_bg: "bg-orange-50/50",
      sticky_border: "border-orange-200",
      
      share_gradient: "from-orange-500 to-red-600"
    }
  },
  exam: {
    label: "Exam Mode",
    icon: <BookOpen size={16} />,
    quote: "Lock in. It's go time.",
    multiplier: 2.5,
    colors: {
      bg_app: "bg-slate-100",
      text_main: "text-slate-900",
      text_sub: "text-slate-500",
      accent_bg: "bg-slate-900",
      border: "border-slate-300",
      shadow: "shadow-slate-300",
      gradient_text: "from-slate-700 to-black",
      
      card_bg: "bg-white",
      card_border: "border-slate-300",
      
      radar_color: "text-slate-800",
      radar_bg: "bg-slate-100",
      progress_bar: "from-slate-700 to-slate-900",
      
      solid_button: "bg-slate-900 hover:bg-black text-white shadow-slate-300",
      soft_button: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      
      sticky_bg: "bg-slate-50",
      sticky_border: "border-slate-300",
      
      share_gradient: "from-slate-700 to-black"
    }
  },
  tired: {
    label: "Low Battery",
    icon: <BatteryLow size={16} />,
    quote: "It's okay to go slow.",
    multiplier: 0.5,
    colors: {
      bg_app: "bg-stone-100",
      text_main: "text-stone-700",
      text_sub: "text-stone-400",
      accent_bg: "bg-stone-500",
      border: "border-stone-200",
      shadow: "shadow-none",
      gradient_text: "from-stone-500 to-stone-700",
      
      card_bg: "bg-[#fafaf9]",
      card_border: "border-stone-200",
      
      radar_color: "text-stone-500",
      radar_bg: "bg-stone-100",
      progress_bar: "from-stone-400 to-stone-500",
      
      solid_button: "bg-stone-500 hover:bg-stone-600 text-white",
      soft_button: "bg-stone-100 text-stone-600 hover:bg-stone-200",
      
      sticky_bg: "bg-stone-50/50",
      sticky_border: "border-stone-200",
      
      share_gradient: "from-stone-400 to-stone-600"
    }
  }
};