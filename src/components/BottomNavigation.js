"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthState } from "../hooks/useAuthState"; 
import { 
  Home, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  FileUser 
} from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useAuthState();

  // Hide nav on specific pages
  const hideNav = ["/auth", "/onboarding", "/admin"].some(
    (path) => pathname?.startsWith(path)
  );

  if (hideNav) return null;

  const todoHref = user ? "/todo" : "/todo-study-planner";
  const resumeHref = user ? "/resume" : "/resume-builder";
  const homeHref = user ? "/home" : "/";

  const navItems = [
    { name: "Home", href: homeHref, icon: Home, matchPaths: ["/", "/home"] },
    { name: "Syllabus", href: "/syllabus", icon: BookOpen, matchPaths: ["/syllabus"] },
    { name: "PYQ", href: "/pyq", icon: FileText, matchPaths: ["/pyq"] },
    { name: "Todo", href: todoHref, icon: CheckSquare, matchPaths: ["/todo", "/todo-study-planner"] },
    { name: "Resume", href: resumeHref, icon: FileUser, matchPaths: ["/resume", "/resume-builder"] },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-full sm:w-auto bg-white/95 backdrop-blur-xl border-t sm:border border-slate-200 sm:rounded-2xl shadow-lg sm:shadow-2xl sm:mb-6 px-2 py-1.5 sm:px-6 sm:py-2 transition-all duration-300">
        
        <div className="flex items-center justify-around sm:justify-center sm:gap-2 max-w-lg mx-auto sm:mx-0">
          {navItems.map((item) => {
            
            // ✅ FIX: Special Logic for Root Path "/"
            const isActive = item.matchPaths.some(path => {
              // Agar path "/" hai, to bilkul exact match hona chahiye
              if (path === "/") {
                return pathname === "/";
              }
              // Baaki paths ke liye startsWith chalega
              return pathname === path || pathname?.startsWith(path);
            });
            
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex flex-col items-center justify-center gap-0.5 py-1 px-3 sm:px-4 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive ? "text-violet-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className={`relative p-1 rounded-lg transition-all duration-300 ${
                  isActive ? "-translate-y-0.5" : ""
                }`}>
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={`transition-transform duration-300 ${isActive ? "scale-105" : "group-hover:scale-110"}`} 
                  />
                  <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? "text-violet-700 font-bold" : "text-slate-400"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}