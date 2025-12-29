"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthState } from "../../hooks/useAuthState"; 
import { 
  Home, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  FileUser 
} from "lucide-react";

export default function MainNav() {
  const pathname = usePathname();
  
  // 1. Auth State Check
  const { user, loading } = useAuthState();

  // 2. Dynamic Routing Logic (Based on your folder structure)
  const routes = {
    home: user ? "/home" : "/",
    syllabus: "/syllabus",
    pyq: "/pyq",
    
    // --- CRITICAL FIX ---
    // Agar User Login hai -> '/todo' (Private App)
    // Agar Public hai -> '/todo-study-planner' (Public Page)
    todo: user ? "/todo" : "/todo-study-planner",

    // Agar User Login hai -> '/resume' (Private App)
    // Agar Public hai -> '/resume-builder' (Public Page)
    resume: user ? "/resume" : "/resume-builder",
  };

  // 3. Active Tab Logic (Taaki icon color hamesha sahi dikhe)
  const isActive = (key) => {
    switch (key) {
      case "home":
        return pathname === "/" || pathname === "/home";
      case "syllabus":
        return pathname.startsWith("/syllabus");
      case "pyq":
        return pathname.startsWith("/pyq");
      case "todo":
        // Dono paths check karenge: '/todo' OR '/todo-study-planner'
        return pathname.startsWith("/todo") || pathname === "/todo-study-planner";
      case "resume":
        // Dono paths check karenge: '/resume' OR '/resume-builder'
        return pathname.startsWith("/resume") || pathname === "/resume-builder";
      default:
        return false;
    }
  };

  const navItems = [
    { key: "home", label: "Home", icon: <Home size={20} />, href: routes.home },
    { key: "syllabus", label: "Syllabus", icon: <BookOpen size={20} />, href: routes.syllabus },
    { key: "pyq", label: "PYQ", icon: <FileText size={20} />, href: routes.pyq },
    { key: "todo", label: "Todo", icon: <CheckSquare size={20} />, href: routes.todo },
    { key: "resume", label: "Resume", icon: <FileUser size={20} />, href: routes.resume },
  ];

  // Optional: Loading state mein nav rendering rokna chahein to
  // if (loading) return null; 

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe md:pb-0 md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:shadow-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-12 h-16 items-center">
          {navItems.map((item) => {
            const active = isActive(item.key);
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`
                  relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 
                  w-full md:w-auto h-full px-2 transition-all duration-200 group
                  ${active 
                    ? "text-violet-600 font-bold" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }
                `}
              >
                {/* Icon Animation */}
                <span className={`transition-transform duration-200 ${active ? "scale-110 -translate-y-1 md:translate-y-0" : "group-hover:scale-105"}`}>
                  {item.icon}
                </span>

                {/* Label */}
                <span className="text-[10px] md:text-sm font-medium tracking-wide">
                  {item.label}
                </span>

                {/* Active Indicator (Mobile Dot) */}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-600 rounded-full md:hidden" />
                )}
                
                {/* Active Indicator (Desktop Border) */}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 hidden md:block" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}