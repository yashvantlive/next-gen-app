'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Save, Download, RefreshCw } from 'lucide-react';

import PersonalInfo from '../../components/resume/PersonalInfo';
import SummarySection from '../../components/resume/SummarySection';
import EducationSection from '../../components/resume/EducationSection';
import SkillsSection from '../../components/resume/SkillsSection';
import ProjectsSection from '../../components/resume/ProjectsSection';
import ExperienceSection from '../../components/resume/ExperienceSection';
import ExtraCurricularSection from '../../components/resume/ExtraCurricularSection';
import ResumePDF from '../../components/resume/ResumePDF';

import { loadResume, saveResume, deleteResume, DEFAULT_RESUME, validateResume } from '../../lib/resumeHelpers';

export default function ResumePage() {
  const router = useRouter();
  const hydratedRef = useRef(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [metadata, setMetadata] = useState(null);
  const [activeTab, setActiveTab] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      hydratedRef.current = true;
      if (!currentUser) { router.push('/auth/login'); return; }
      setUser(currentUser);

      try {
        const profileRef = doc(db, 'users', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) setProfile(profileSnap.data());

        const resumeData = await loadResume(currentUser.uid);
        if (resumeData) setResume({ ...DEFAULT_RESUME, ...resumeData });

        try {
          const skillsSnap = await getDoc(doc(db, 'metadata', 'skills'));
          setMetadata({ skills: skillsSnap.exists() ? skillsSnap.data() : {} });
        } catch (e) {}

        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    });
    return () => unsubscribe();
  }, [router]);

  const showToast = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const generatePDF = async () => {
    const element = document.getElementById('resume-pdf');
    if (!element) return;
    
    showToast('Preparing PDF...');
    
    try {
      // Dynamic imports
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const fileName = profile?.displayName 
        ? `${profile.displayName.replace(/\s+/g, '_')}_Resume.pdf` 
        : 'My_Resume.pdf';

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowHeight: element.scrollHeight,
        windowWidth: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // If content fits in one page
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Scale down to fit one page
        const scaledHeight = pdfHeight;
        const scaledWidth = (canvas.width * pdfHeight) / canvas.height;
        const xOffset = (pdfWidth - scaledWidth) / 2;
        
        pdf.addImage(imgData, 'JPEG', xOffset, 0, scaledWidth, scaledHeight);
      }

      pdf.save(fileName);
      showToast('Downloaded!');
      
    } catch (err) {
      console.error('PDF Error:', err);
      showToast("PDF Error");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await saveResume(user.uid, resume);
    setSaving(false);
    showToast("Progress Saved!");
  };

  const handleClear = async () => {
    if(confirm("Warning: This will delete all resume data permanently!")) {
        setSaving(true); await deleteResume(user.uid); setResume(DEFAULT_RESUME); setSaving(false);
        showToast("Resume Cleared");
    }
  }

  // Updaters
  const updateInfo = (f, v) => setResume(p => ({ ...p, personalInfo: { ...(p.personalInfo||{}), [f]: v } }));
  const updateSum = (v) => setResume(p => ({ ...p, summary: v }));
  const addEdu = () => setResume(p => ({ ...p, education: [...(p.education||[]), { id: Date.now(), degree: '', institution: '', year: '' }] }));
  const updEdu = (id, u) => setResume(p => ({ ...p, education: (p.education||[]).map(e => e.id === id ? u : e) }));
  const delEdu = (id) => setResume(p => ({ ...p, education: (p.education||[]).filter(e => e.id !== id) }));
  const updSkills = (field, val) => setResume(p => ({ ...p, skills: { ...(p.skills||{}), [field]: val } }));
  const addProj = () => setResume(p => ({ ...p, projects: [...(p.projects||[]), { id: Date.now(), title: '', description: '' }] }));
  const updProj = (id, u) => setResume(p => ({ ...p, projects: (p.projects||[]).map(x => x.id === id ? u : x) }));
  const delProj = (id) => setResume(p => ({ ...p, projects: (p.projects||[]).filter(x => x.id !== id) }));
  const addExp = () => setResume(p => ({ ...p, experience: [...(p.experience||[]), { id: Date.now(), company: '', role: '' }] }));
  const updExp = (id, u) => setResume(p => ({ ...p, experience: (p.experience||[]).map(x => x.id === id ? u : x) }));
  const delExp = (id) => setResume(p => ({ ...p, experience: (p.experience||[]).filter(x => x.id !== id) }));
  const updExtra = (val) => setResume(p => ({ ...p, extraCurricular: val }));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 1. HIDDEN PDF CONTAINER - EXACT MATCH TO PREVIEW */}
      <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
        <div id="resume-pdf">
          <ResumePDF data={resume} />
        </div>
      </div>

      <style jsx global>{`
        /* This ensures the PDF rendering engine sees the exact same dimensions */
        #resume-pdf { 
          width: 210mm; 
          min-height: 297mm; 
          background: white; 
          color: black; 
          font-family: "Times New Roman"; 
        }
      `}</style>

      {/* Toast */}
      {success && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-in slide-in-from-right fade-in">
          {success}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Resume Builder</h1>
        
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
           <div className="flex gap-2">
             <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium">
               <Save size={16} /> Save
             </button>
             <button onClick={() => { handleSave(); generatePDF(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium">
               <Download size={16} /> PDF
             </button>
           </div>

           <div className="flex bg-gray-100 p-1 rounded-lg ml-4">
             <button onClick={()=>setActiveTab('edit')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab==='edit'?'bg-white text-blue-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Edit</button>
             <button onClick={()=>setActiveTab('preview')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab==='preview'?'bg-white text-blue-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Preview</button>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'edit' ? (
          <div className="space-y-8 animate-in fade-in">
             <PersonalInfo data={resume.personalInfo || {}} onChange={updateInfo} />
             <SummarySection data={resume.summary || ''} onChange={updateSum} />
             <EducationSection data={resume.education || []} onAdd={addEdu} onUpdate={updEdu} onDelete={delEdu} />
             <SkillsSection data={resume.skills || {}} onChange={updSkills} metadata={metadata} />
             <ProjectsSection data={resume.projects || []} onAdd={addProj} onUpdate={updProj} onDelete={delProj} />
             <ExperienceSection data={resume.experience || []} onAdd={addExp} onUpdate={updExp} onDelete={delExp} />
             <ExtraCurricularSection data={resume.extraCurricular || []} onChange={updExtra} />
             
             <div className="flex justify-between items-center pt-10 border-t border-gray-200 mt-10">
               <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                 <RefreshCw size={16} /> Clear All Data
               </button>
               <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-bold shadow-lg">
                 Save Progress
               </button>
             </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-8 min-h-[600px] flex justify-center rounded-xl border border-gray-200">
             {/* WEB PREVIEW - Using ResumePDF to guarantee Match */}
             <div className="w-full max-w-[210mm] bg-white shadow-2xl min-h-[297mm] origin-top scale-90 sm:scale-100 transition-transform">
                <ResumePDF data={resume} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}