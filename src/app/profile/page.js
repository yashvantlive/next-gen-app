"use client";
import React, { useRef, useEffect, useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useProfileData } from "../../hooks/useProfileData";
import { useMetadata } from "../../hooks/useMetadata";
import { useWidgetStore } from "../../hooks/useWidgetStore";
import { setUserProfile } from "../../lib/firebaseClient"; 
import { useMusicPlayer } from "../../contexts/MusicContext"; 

import ProfileHeader from "../../components/profile/ProfileHeader";
import AcademicDetails from "../../components/profile/AcademicDetails";
import ExamTarget from "../../components/profile/ExamTarget";
import ExamEntryCard from "../../components/profile/ExamEntryCard"; 
import SkillsInterests from "../../components/profile/SkillsInterests";
import OperationsCenter from "../../components/profile/OperationsCenter";
import WidgetGrid from "../../components/profile/WidgetGrid";
import EditWidgetModal from "../../components/profile/EditWidgetModal";
import WidgetStoreDrawer from "../../components/profile/WidgetStoreDrawer";
import EditExamModal from "../../components/profile/EditExamModal";
import { Music } from "lucide-react"; 

export default function ProfilePage() {
  const { authUser, loading, setLoading, handleLogout } = useAuthGuard();
  const { profile, isAdmin } = useProfileData(authUser, setLoading);
  const { getUniName, getBranchName } = useMetadata(authUser);
  
  // Hook is kept to ensure no logic breaks, even if UI is removed
  const { musicEnabled, isPlaying, currentTrack } = useMusicPlayer(); 

  const { 
    userWidgets, 
    selectedWidgetIds, 
    editConfig, 
    setEditConfig, 
    isStoreOpen, 
    setIsStoreOpen, 
    handleSaveWidget, 
    toggleWidgetSelection 
  } = useWidgetStore(authUser);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const handleSaveExamTargets = async (newGoalsData) => {
    if (!authUser) return;
    try {
        await setUserProfile(authUser.uid, { examGoals: newGoalsData });
    } catch (error) {
        console.error("Error saving exam targets:", error);
        alert("Failed to save targets.");
    }
  };

  const hydratedRef = useRef(false);
  useEffect(() => { hydratedRef.current = true; }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium animate-pulse">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      
      {/* 1. HEADER */}
      <ProfileHeader 
        profile={profile} 
        authUser={authUser} 
        isAdmin={isAdmin} 
        handleLogout={handleLogout} 
      />

      {/* 2. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-6 space-y-8">
        
        {/* ❌ OLD BADGE REMOVED FROM HERE */}

        {/* ROW 1: ACADEMIC & TARGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <AcademicDetails 
                profile={profile} 
                getUniName={getUniName} 
                getBranchName={getBranchName} 
            />
            <ExamTarget 
                profile={profile} 
                onEdit={() => setIsExamModalOpen(true)} 
            />
        </div>

        {/* ROW 2: EXAM ENTRY CARD */}
        <ExamEntryCard userId={authUser?.uid} />

        {/* ROW 3: SKILLS */}
        <SkillsInterests profile={profile} />

        {/* ROW 4: WIDGETS */}
        <div className="pt-2">
           <OperationsCenter setIsStoreOpen={setIsStoreOpen} />
           <WidgetGrid 
             selectedWidgetIds={selectedWidgetIds}
             userWidgets={userWidgets}
             setEditConfig={setEditConfig}
           />
        </div>
      </main>

      {/* MODALS */}
      <EditWidgetModal editConfig={editConfig} setEditConfig={setEditConfig} handleSaveWidget={handleSaveWidget} />
      <WidgetStoreDrawer isStoreOpen={isStoreOpen} setIsStoreOpen={setIsStoreOpen} selectedWidgetIds={selectedWidgetIds} toggleWidgetSelection={toggleWidgetSelection} />
      <EditExamModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} currentGoals={profile?.examGoals} onSave={handleSaveExamTargets} />
    </div>
  );
}