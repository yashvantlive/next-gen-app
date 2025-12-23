"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthChange, getUserProfile, signOut, db } from "@/lib/firebaseClient";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, Edit, Shield, User, BookOpen, Calendar, Award, Layers, Hash, 
  ChevronLeft, GraduationCap, Heart, Zap, PlusCircle, LayoutGrid, X, Save, 
  Target, DollarSign, Activity, Cpu, Settings, Briefcase, Rocket, Brain, Smile, Star,
  Check, Sparkles 
} from "lucide-react";
import { WIDGETS_CONFIG } from "@/lib/widgetsConfig";
import { COLORS, daysBetween } from "@/lib/widgetHelpers";

// --- WIDGET COMPONENT DEFINITIONS ---

// 1. Trajectory Lock
const TrajectoryLock = ({ data, onEdit }) => {
  const cgpaProgress = (data.currentCGPA / 10) * 100;
  const attendanceColor = data.attendance < 75 ? "bg-rose-500" : "bg-emerald-500";
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Target size={18} className="text-violet-600" />
          <span>Trajectory Lock</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>CGPA: {data.currentCGPA} / {data.targetCGPA}</span>
            <span>Target</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${cgpaProgress}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Attendance</span>
            <span className={data.attendance < 75 ? "text-rose-600 font-bold" : "text-emerald-600"}>{data.attendance}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${attendanceColor}`} style={{ width: `${data.attendance}%` }}></div>
          </div>
        </div>
        
        {data.notes && <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// 2. Runway Tracker
const RunwayTracker = ({ data, onEdit }) => {
  const progress = Math.min(100, (data.currentBalance / data.savingsGoal) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <DollarSign size={18} className="text-emerald-600" />
          <span>Runway Tracker</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="text-center py-2">
          <span className="text-3xl font-bold text-slate-800">₹{data.currentBalance}</span>
          <p className="text-xs text-slate-500 mt-1">Current Balance</p>
        </div>

        <div className="space-y-1">
           <div className="flex justify-between text-xs text-slate-500">
             <span>Savings Goal</span>
             <span>{Math.round(progress)}%</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
           </div>
           <div className="flex justify-between text-[10px] text-slate-400 mt-1">
             <span>₹0</span>
             <span>₹{data.savingsGoal}</span>
           </div>
        </div>
        
        {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 italic truncate mt-auto">{data.notes}</div>}
      </div>
    </div>
  );
};

// 3. Network Health
const NetworkHealth = ({ data, onEdit }) => {
  const rels = data.relationships || {
    family: { current: 0, goal: 0 },
    mentor: { current: 0, goal: 0 },
    friends: { current: 0, goal: 0 }
  };

  const RelationshipBar = ({ label, current, goal }) => {
    let barColor = "bg-rose-500"; 
    if (current >= 40 && current < 70) barColor = "bg-amber-500"; 
    if (current >= 70) barColor = "bg-emerald-500";

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-600 uppercase">{label}</span>
          <span className="text-xs font-bold text-slate-500">{current}%</span>
        </div>
        <div className="relative h-4">
          <div className="absolute inset-0 bg-slate-100 rounded-full border border-slate-200"></div>
          <div className={`absolute inset-y-0 left-0 rounded-full ${barColor} opacity-90 transition-all duration-500`} style={{ width: `${current}%` }}></div>
          <div className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-800 rounded-full z-10" style={{ left: `${goal}%` }} title={`Goal: ${goal}%`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Activity size={18} className="text-rose-500" />
          <span>Network Health</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-5 flex-1">
        <RelationshipBar label="Family" current={rels.family?.current || 0} goal={rels.family?.goal || 0} />
        <RelationshipBar label="Mentor" current={rels.mentor?.current || 0} goal={rels.mentor?.goal || 0} />
        <RelationshipBar label="Friends" current={rels.friends?.current || 0} goal={rels.friends?.goal || 0} />
      </div>
        
      {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 mt-4 italic truncate">"{data.notes}"</div>}
    </div>
  );
};

// 4. Mental Bandwidth
const MentalBandwidth = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Cpu size={18} className="text-amber-500" />
          <span>Mental Bandwidth</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex gap-1 h-8 rounded-md overflow-hidden bg-slate-100">
          <div className="bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${data.academicLoad}%` }}>
            {data.academicLoad > 15 && "ACAD"}
          </div>
          <div className="bg-indigo-500 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${data.projectLoad}%` }}>
            {data.projectLoad > 15 && "PROJ"}
          </div>
          <div className="bg-slate-200 h-full flex-1"></div>
        </div>

        <div className="flex justify-between items-center">
           <span className="text-xs text-slate-500 font-medium uppercase">Stress Level</span>
           <span className={`text-sm font-bold ${data.stressLevel > 70 ? 'text-rose-500' : 'text-slate-700'}`}>{data.stressLevel}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
           <div className={`h-full rounded-full transition-all ${data.stressLevel > 70 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${data.stressLevel}%` }}></div>
        </div>

        {data.notes && <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 italic truncate mt-auto">{data.notes}</div>}
      </div>
    </div>
  );
};

// 5. Employability Index
const EmployabilityIndex = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Briefcase size={18} className="text-blue-600" />
          <span>Employability Index</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-4 flex-1">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Skill Readiness</span>
               <span className="font-bold text-blue-600">{data.skillScore}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.skillScore}%` }}></div>
            </div>
         </div>
         
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Market Alignment</span>
               <span className="font-bold text-slate-600">{data.marketDemand}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-400 rounded-full" style={{ width: `${data.marketDemand}%` }}></div>
            </div>
         </div>

         <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">Portfolio Projects</span>
            <span className="text-lg font-bold text-slate-800">{data.projectCount}</span>
         </div>
         {data.notes && <div className="text-xs text-slate-500 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// 6. Body Stress Test
const BodyStressTest = ({ data, onEdit }) => {
  const average = Math.round((data.sleepQuality + data.nutrition + data.exercise) / 3);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Heart size={18} className="text-rose-500" />
          <span>Body Stress Test</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-3 flex-1">
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">SLEEP</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-400 rounded-full" style={{width: `${data.sleepQuality}%`}}></div></div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">DIET</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-green-400 rounded-full" style={{width: `${data.nutrition}%`}}></div></div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold w-16 text-slate-500">MOVE</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full"><div className="h-full bg-orange-400 rounded-full" style={{width: `${data.exercise}%`}}></div></div>
         </div>
         <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">Health Score</span>
            <span className={`font-bold ${average > 70 ? 'text-green-600' : 'text-amber-500'}`}>{average}%</span>
         </div>
      </div>
    </div>
  );
};

// 7. Commitment Stack
const CommitmentStack = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Rocket size={18} className="text-orange-500" />
          <span>Commitment Stack</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
         <div className="flex gap-2">
            <div className="flex-1 bg-red-50 rounded-lg p-2 text-center border border-red-100">
               <span className="block text-xl font-bold text-red-600">{data.urgentTasks}</span>
               <span className="text-[10px] uppercase font-bold text-red-400">Urgent</span>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
               <span className="block text-xl font-bold text-blue-600">{data.upcomingTasks}</span>
               <span className="text-[10px] uppercase font-bold text-blue-400">Upcoming</span>
            </div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Task Clearance Rate</span>
               <span className="font-bold text-slate-700">{data.clearanceRate}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-600 rounded-full" style={{width: `${data.clearanceRate}%`}}></div>
            </div>
         </div>
         {data.notes && <div className="text-xs text-slate-500 pt-1 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// 8. Knowledge Decay
const KnowledgeDecay = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Brain size={18} className="text-purple-500" />
          <span>Knowledge Decay</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="space-y-4 flex-1">
         {[1, 2, 3].map(i => {
            const val = data[`subject${i}`] || 0;
            const color = val < 50 ? 'bg-red-400' : val < 80 ? 'bg-amber-400' : 'bg-green-400';
            return (
               <div key={i}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                     <span>Subject {i}</span>
                     <span>{val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${color}`} style={{width: `${val}%`}}></div>
                  </div>
               </div>
            )
         })}
         {data.notes && <div className="text-xs text-slate-500 pt-2 italic truncate mt-auto">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// 9. Mood Seismograph
const MoodSeismograph = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Smile size={18} className="text-yellow-500" />
          <span>Mood Seismograph</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col justify-between space-y-4">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Mood</span><span className="font-bold">{data.currentMood}/100</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-yellow-400 rounded-full" style={{width: `${data.currentMood}%`}}></div></div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Energy</span><span className="font-bold">{data.energy}%</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-orange-400 rounded-full" style={{width: `${data.energy}%`}}></div></div>
         </div>
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Volatility</span><span className="font-bold">{data.volatility}%</span></div>
            <div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-slate-400 rounded-full" style={{width: `${data.volatility}%`}}></div></div>
         </div>
         {data.notes && <div className="text-xs text-slate-500 pt-2 italic truncate text-center">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// 10. Legacy Builder
const LegacyBuilder = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Star size={18} className="text-amber-400" />
          <span>Legacy Builder</span>
        </div>
        <button onClick={onEdit} className="text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
      </div>
      <div className="flex-1 flex flex-col gap-4">
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Impact Score</span>
               <span className="font-bold text-amber-500">{data.impactScore}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" style={{width: `${data.impactScore}%`}}></div>
            </div>
         </div>
         
         <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Community Contrib</span>
               <span className="font-bold text-slate-600">{data.community}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-slate-400 rounded-full" style={{width: `${data.community}%`}}></div>
            </div>
         </div>

         <div className="flex justify-between items-center py-2 border-t border-slate-50 mt-auto">
            <span className="text-xs text-slate-600">Major Achievements</span>
            <span className="text-xl font-bold text-slate-800">{data.achievements}</span>
         </div>
         {data.notes && <div className="text-xs text-slate-500 italic truncate">"{data.notes}"</div>}
      </div>
    </div>
  );
};

// --- COMPONENT MAP ---
const COMPONENT_MAP = {
  TrajectoryLock, RunwayTracker, NetworkHealth, MentalBandwidth,
  EmployabilityIndex, BodyStressTest, CommitmentStack, KnowledgeDecay, MoodSeismograph, LegacyBuilder
};

// --- MAIN PROFILE PAGE ---

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [metadata, setMetadata] = useState({ universities: {}, branches: {} });
  const [authUser, setAuthUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Widget Data State
  const [userWidgets, setUserWidgets] = useState({});
  const [selectedWidgetIds, setSelectedWidgetIds] = useState(["trajectory_lock", "runway_tracker", "network_health", "mental_bandwidth"]); 
  const [editConfig, setEditConfig] = useState(null); 
  
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const router = useRouter();
  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = true;
    const unsub = onAuthChange(async (u) => {
      if (!u) { router.push("/auth/login"); return; }
      setAuthUser(u);
      
      try {
        const p = await getUserProfile(u.uid);
        if (!p) { router.push("/onboarding"); return; }
        setProfile(p);
        setIsAdmin(p?.role === "admin");

        const uniSnap = await getDoc(doc(db, "metadata", "universities"));
        const branchSnap = await getDoc(doc(db, "metadata", "branches"));
        setMetadata({
            universities: uniSnap.exists() ? uniSnap.data() : {},
            branches: branchSnap.exists() ? branchSnap.data() : {}
        });

        // Widget Data Fetch
        const widgetRef = doc(db, "user_widgets", u.uid);
        const widgetUnsub = onSnapshot(widgetRef, (docSnap) => {
           if (docSnap.exists()) {
             const data = docSnap.data();
             if(data.selectedIds && data.selectedIds.length > 0) setSelectedWidgetIds(data.selectedIds);
             setUserWidgets(data.widgetData || {});
           }
        });

        setLoading(false);
        return () => widgetUnsub();

      } catch (err) { console.error(err); setLoading(false); }
    });
    return () => unsub();
  }, [router]);

  function handleLogout() {
    if(confirm("Log out?")) signOut().then(() => router.push("/auth/login"));
  }

  // --- SAVE LOGIC ---
  const handleSaveWidget = async (e) => {
    e.preventDefault();
    if (!authUser || !editConfig) return;

    const formData = new FormData(e.target);
    let newData = { ...editConfig.data };
    
    // Logic for Network Health (Nested Data)
    if (editConfig.widgetId === 'network_health') {
        newData.relationships = {
            family: {
                current: Number(formData.get("family.current")),
                goal: Number(formData.get("family.goal"))
            },
            mentor: {
                current: Number(formData.get("mentor.current")),
                goal: Number(formData.get("mentor.goal"))
            },
            friends: {
                current: Number(formData.get("friends.current")),
                goal: Number(formData.get("friends.goal"))
            }
        };
    } 
    // Logic for Standard Widgets
    else if (editConfig.schema) {
      editConfig.schema.forEach(field => {
        const val = formData.get(field.key);
        if (field.type === 'number' || field.type === 'slider') {
          newData[field.key] = Number(val);
        } else {
          newData[field.key] = val;
        }
      });
    }
    
    newData.notes = formData.get("notes");

    try {
      const widgetRef = doc(db, "user_widgets", authUser.uid);
      const updatedWidgets = { ...userWidgets, [editConfig.widgetId]: newData };
      
      await setDoc(widgetRef, { 
        selectedIds: selectedWidgetIds, 
        widgetData: updatedWidgets 
      }, { merge: true });
      
      setEditConfig(null); 
    } catch(err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    }
  };

  const toggleWidgetSelection = async (widgetId) => {
    if (!authUser) return;
    const newIds = selectedWidgetIds.includes(widgetId)
      ? selectedWidgetIds.filter(id => id !== widgetId)
      : [...selectedWidgetIds, widgetId];
    
    let newWidgetData = { ...userWidgets };
    if (!userWidgets[widgetId]) {
       const def = WIDGETS_CONFIG.find(w => w.id === widgetId);
       newWidgetData[widgetId] = def.defaultData;
    }

    setSelectedWidgetIds(newIds);
    await setDoc(doc(db, "user_widgets", authUser.uid), { 
       selectedIds: newIds, widgetData: newWidgetData
    }, { merge: true });
  };

  const getUniName = (id) => metadata.universities[id]?.name || id || "Not set";
  const getBranchName = (id) => metadata.branches[id] || id || "Not set";

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Link href="/home" className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></Link>
             <h1 className="text-lg font-bold text-slate-800">My Profile</h1>
           </div>
           <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium">
            <LogOut size={16} /> <span className="hidden sm:inline">Log out</span>
           </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* HERO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           </div>
           <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start -mt-12">
                 <div className="relative">
                    <img src={profile?.photoURL || authUser?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="Profile" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                 </div>
                 <div className="flex-1 pt-2 sm:pt-14 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{profile?.displayName || "Student"}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"><GraduationCap size={12} /> Student</span>
                                {isAdmin && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200"><Shield size={12} /> Admin</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.push("/onboarding")} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"><Edit size={16} /> <span>Edit Profile</span></button>
                            {isAdmin && <button onClick={() => router.push("/admin")} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white hover:bg-violet-700 rounded-lg text-sm font-medium shadow-sm"><Shield size={16} /> <span>Admin Panel</span></button>}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ACADEMIC DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><BookOpen size={20} className="text-violet-600" /> Academic Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailItem label="University" value={getUniName(profile?.universityId || profile?.university)} icon={<Award size={16} />} />
                <DetailItem label="Branch / Course" value={getBranchName(profile?.branchId || profile?.branch)} icon={<Layers size={16} />} />
                <DetailItem label="Current Year" value={profile?.year ? `Year ${profile.year}` : null} icon={<Calendar size={16} />} />
                <DetailItem label="Semester" value={profile?.semester ? `Semester ${profile.semester}` : null} icon={<Hash size={16} />} />
            </div>
        </div>

        {/* SKILLS & INTERESTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><Zap size={20} className="text-amber-500" /> Skills</h3>
                <div className="flex flex-wrap gap-2">{(profile?.skills || []).map((s,i) => <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">{s}</span>)}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2"><Heart size={20} className="text-pink-500" /> Interests</h3>
                <div className="flex flex-wrap gap-2">{(profile?.interests || []).map((s,i) => <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-100">{s}</span>)}</div>
            </div>
        </div>

        {/* OPERATIONS CENTER (WIDGETS) */}
        <div className="pt-4">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <LayoutGrid className="text-indigo-600" size={20}/> Operations Center
              </h2>
              {/* Add Widgets Button */}
              <button onClick={() => setIsStoreOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                 <PlusCircle size={16} /> Customize
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedWidgetIds.map(id => {
                 const def = WIDGETS_CONFIG.find(w => w.id === id);
                 if (!def) return null;
                 const Component = COMPONENT_MAP[def.componentName];
                 const data = userWidgets[id] || def.defaultData;
                 if (!Component) return null;
                 
                 return (
                    <div key={id} className="animate-fade-in-up">
                       <Component 
                         data={data} 
                         onEdit={() => setEditConfig({ widgetId: id, data, schema: def.schema })} 
                       />
                    </div>
                 );
              })}
           </div>
        </div>

      </main>

      {/* --- EDIT MODAL (UPDATED FOR 70% HEIGHT FIXED + SCROLLABLE) --- */}
      {editConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col h-[70vh] animate-in zoom-in-95 duration-300 relative">
              
              {/* Header (Fixed) */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
                 <h3 className="font-bold text-slate-800">Update {WIDGETS_CONFIG.find(w => w.id === editConfig.widgetId)?.name}</h3>
                 <button onClick={() => setEditConfig(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto flex-1">
                <form id="widget-form" onSubmit={handleSaveWidget} className="space-y-6">
                   
                   {/* Schema Fields */}
                   {editConfig.schema && editConfig.schema.map((field, idx) => {
                     // Handle nested keys
                     let defaultVal = editConfig.data[field.key];
                     if(field.key.includes('.')) {
                         const [parent, child] = field.key.split('.');
                         defaultVal = editConfig.data.relationships?.[parent]?.[child] || 0;
                     }

                     return (
                       <div key={idx}>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{field.label}</label>
                          {field.type === 'slider' ? (
                            <div className="flex items-center gap-4">
                               <input 
                                 type="range" 
                                 name={field.key}
                                 min={field.min || 0} 
                                 max={field.max || 100} 
                                 defaultValue={defaultVal} 
                                 className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                               />
                               <span className="text-sm font-mono text-slate-700 w-10 text-right font-bold">{defaultVal}</span>
                            </div>
                          ) : (
                            <input 
                              type={field.type} 
                              name={field.key}
                              step={field.step || 1}
                              defaultValue={defaultVal}
                              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 transition-all"
                            />
                          )}
                       </div>
                     );
                   })}

                   {/* Notes Field */}
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notes & Goals</label>
                      <textarea 
                        name="notes"
                        rows={4}
                        defaultValue={editConfig.data.notes}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-300 resize-none transition-all"
                        placeholder="Add specific details or targets..."
                      />
                   </div>
                </form>
              </div>

              {/* Footer (Fixed) */}
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white rounded-b-2xl shrink-0">
                 <button type="button" onClick={() => setEditConfig(null)} className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                 <button type="submit" form="widget-form" className="px-6 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2">
                    <Save size={18} /> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Widget Selector Modal */}
      {isStoreOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsStoreOpen(false)}></div>
           <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                 <h3 className="font-bold text-slate-800 text-lg">Widget Library</h3>
                 <button onClick={() => setIsStoreOpen(false)}><X size={20} className="text-slate-500"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {WIDGETS_CONFIG.map(def => {
                   const isSelected = selectedWidgetIds.includes(def.id);
                   return (
                     <button key={def.id} onClick={() => toggleWidgetSelection(def.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isSelected ? "border-violet-600 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"}`}>
                        <div className={`p-3 rounded-lg ${isSelected ? "bg-white" : "bg-slate-100"}`}><def.icon size={20} className={def.color || "text-slate-600"} /></div>
                        <div className="flex-1">
                           <h4 className="font-bold text-sm text-slate-800">{def.name}</h4>
                           <p className="text-xs text-slate-500 line-clamp-1">{def.description}</p>
                        </div>
                        {isSelected && <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center"><Check size={12} className="text-white"/></div>}
                     </button>
                   );
                 })}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

function DetailItem({ label, value, icon }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                {icon && <span className="opacity-50">{icon}</span>} {label}
            </span>
            <span className="text-base font-medium text-slate-900 truncate">{value || <span className="text-slate-400 italic">Not set</span>}</span>
        </div>
    );
}