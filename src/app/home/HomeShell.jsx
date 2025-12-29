"use client";

import React, { useMemo, useState } from 'react';
import { doc, writeBatch, Timestamp, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { MOODS } from '../../lib/moodConfig';

// Components
import NavigationBar from '../../components/home/NavigationBar';
import FocusHUD from '../../components/home/FocusHUD';
import TodayTasks from '../../components/home/TodayTasks';
import StickyBrain from '../../components/home/StickyBrain';
import AcademicRadar from '../../components/home/AcademicRadar';
import ToolsGrid from '../../components/home/ToolsGrid';
import ShareCard from '../../components/home/ShareCard';
import CommunityWall from '../../components/home/CommunityWall';
import ReviewModal from '../../components/home/ReviewModal';

// Engines
import { calculateFocusScore } from '../../engines/FocusScoreEngine';
import { getGreeting } from '../../engines/GreetingEngine';
import { analyzeProductivity } from '../../engines/ProductivityEngine';

export default function HomeShell({ 
  user, profile, currentMood, onMoodChange,
  todos, academicProgress, reviews, streak
}) {
  
  const [reviewModal, setReviewModal] = useState({ 
    isOpen: false, 
    editData: null 
  });
  
  // ✅ Get Theme from Mood Config
  const theme = MOODS[currentMood].colors;
  const moodInfo = MOODS[currentMood];

  // --- BRAIN: Compute Stats ---
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Filter Todays Tasks
    const todaysTasks = todos.filter(t => {
      if (!t.dueDate) return false;
      const d = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate.seconds * 1000);
      return d.toISOString().split('T')[0] === todayStr;
    });

    const completedToday = todaysTasks.filter(t => t.status === 'done').length;
    const taskProgress = todaysTasks.length > 0 ? Math.round((completedToday / todaysTasks.length) * 100) : 0;

    const academicTasksDoneToday = todos.filter(t => {
       if (!t.completedAt) return false;
       const d = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt.seconds * 1000);
       return d.toISOString().split('T')[0] === todayStr && t.status === 'done' && t.linkedFrom === 'syllabus';
    }).length;

    const percent = academicProgress.total > 0 ? (academicProgress.completed / academicProgress.total) * 100 : 0;

    const score = calculateFocusScore({
      tasksDone: completedToday,
      academicTopicsDone: academicTasksDoneToday,
      syllabusPercent: percent,
      streak: streak
    }, moodInfo.multiplier);

    const productivity = analyzeProductivity({
        tasksCompletedToday: completedToday,
        academicTopicsCovered: academicTasksDoneToday,
        syllabusPercent: percent,
        streak: streak
    });

    return {
      todayTotal: todaysTasks.length,
      todayDone: completedToday,
      todayPercent: taskProgress,
      todaysTasksList: todaysTasks.sort((a,b) => (a.status === 'done') - (b.status === 'done')),
      score,
      syllabusPercent: Math.round(percent),
      productivity 
    };
  }, [todos, academicProgress, streak, moodInfo]);

  // --- ACTIONS ---
  const handleTaskToggle = async (task) => {
    if (!user) return;
    try {
      const newStatus = task.status === 'active' ? 'done' : 'active';
      const isCompleted = newStatus === 'done';
      const batch = writeBatch(db);

      const todoRef = doc(db, 'todos', task.id);
      batch.update(todoRef, { status: newStatus, completedAt: isCompleted ? Timestamp.now() : null });

      if (task.subjectId && task.topicId) {
        const progressRef = doc(db, 'academic_progress', user.uid, 'subjects', task.subjectId);
        batch.set(progressRef, { topics: { [task.topicId]: isCompleted }, lastUpdated: Timestamp.now() }, { merge: true });
      }
      await batch.commit();
    } catch (err) { console.error(err); }
  };

  const handleReviewSubmit = async (data) => {
    if (!user) return;
    try {
      if (data.id) {
        const ref = doc(db, 'testimonials', data.id);
        await updateDoc(ref, {
          rating: data.rating,
          message: data.message,
          approved: false,
          updatedAt: Timestamp.now()
        });
        alert("Review updated! Sent for re-approval.");
      } else {
        await addDoc(collection(db, 'testimonials'), {
            userId: user.uid,
            name: profile.displayName || "User",
            uni: profile.universityId || "Unknown",
            branch: profile.branchId || "Engineering",
            rating: data.rating,
            message: data.message,
            approved: false,
            createdAt: Timestamp.now()
        });
        alert("Review submitted successfully!");
      }
    } catch (err) { console.error(err); alert("Failed."); }
  };

  const handleEditReview = (review) => {
    setReviewModal({ isOpen: true, editData: review });
  };

  return (
    <div className={`min-h-screen font-sans text-slate-900 pb-32 transition-all duration-700 ease-in-out ${theme.bg_app}`}>
      
      <NavigationBar 
        user={user} 
        profile={profile} 
        currentMood={currentMood} 
        onMoodChange={onMoodChange} 
        theme={theme} 
      />

      <main className="pt-24 sm:pt-32 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 lg:space-y-12">
        
        {/* HERO */}
        <section className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white ${theme.text_main} border ${theme.border} shadow-sm animate-in fade-in slide-in-from-left-4 duration-500`}>
              {moodInfo.icon} System Status: {stats.productivity.message}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.1]">
              {getGreeting()}, <br/>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient_text}`}>
                {profile?.displayName?.split(' ')[0] || "Scholar"}
              </span>.
            </h1>
            
            <p className={`text-lg max-w-xl leading-relaxed font-medium ${theme.text_sub}`}>"{moodInfo.quote}"</p>
          </div>

          <FocusHUD score={stats.score} theme={theme} streak={streak} />
        </section>

        {/* DASHBOARD GRID */}
        <section className="grid lg:grid-cols-12 gap-6 items-stretch"> 
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <TodayTasks 
              tasks={stats.todaysTasksList} 
              total={stats.todayTotal} 
              done={stats.todayDone} 
              percent={stats.todayPercent} 
              theme={theme}
              onToggle={handleTaskToggle}
            />
            <div className="flex-1">
                <StickyBrain theme={theme} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AcademicRadar progress={academicProgress} percent={stats.syllabusPercent} theme={theme} />
            <ToolsGrid theme={theme} />
          </div>
        </section>

        {/* COMMUNITY WALL */}
        <CommunityWall 
            reviews={reviews} 
            theme={theme} 
            currentUserId={user?.uid} 
            onOpenReview={() => setReviewModal({ isOpen: true, editData: null })}
            onEditReview={handleEditReview}
        />

        {/* ✅ DYNAMIC SHARE CARD CONTAINER */}
        <div className="mt-16 mb-8 max-w-5xl mx-auto px-4">
            <div className={`transform hover:scale-[1.01] transition-all duration-300 rounded-2xl ${theme.card_style}`}>
               <ShareCard theme={theme} /> 
            </div>
        </div>

        {/* REVIEW MODAL */}
        <ReviewModal 
            isOpen={reviewModal.isOpen}
            editData={reviewModal.editData}
            onClose={() => setReviewModal({ isOpen: false, editData: null })}
            onSubmit={handleReviewSubmit}
            profile={profile}
            theme={theme}
        />

        <footer className="text-center pt-12 pb-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex justify-center items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full animate-ping ${theme.accent_bg}`}></div>
                <span className={`text-[10px] font-black tracking-[0.2em] ${theme.text_main}`}>YOU LEARN</span>
            </div>
            <p className={`text-[9px] uppercase tracking-wide font-medium ${theme.text_sub}`}>Engineered for clarity, not chaos.</p>
        </footer>

      </main>
    </div>
  );
}