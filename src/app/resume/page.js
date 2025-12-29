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

// ✅ SHARE BUTTON IMPORT
import ShareButton from '../../components/ShareButton';

import { loadResume, saveResume, deleteResume, DEFAULT_RESUME } from '../../lib/resumeHelpers';

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

  // --- 📱 MOBILE PREVIEW SCALING STATE ---
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);

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

  // --- 📏 SMART SCALING EFFECT ---
  useEffect(() => {
    if (activeTab !== 'preview') return;

    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // A4 Width is approx 794px at 96 DPI. 
        // We add padding buffer (e.g., 32px or 40px) to prevent edge touching.
        const targetA4Width = 794; 
        const paddingBuffer = 32; 
        
        const availableWidth = containerWidth - paddingBuffer;
        
        // Calculate Scale Ratio
        const scale = Math.min(availableWidth / targetA4Width, 1);
        
        setPreviewScale(scale > 0 ? scale : 1);
      }
    };

    // Initial Calculation
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const showToast = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const generatePDF = async () => {
    const element = document.getElementById('resume-pdf');
    if (!element) return;
    
    showToast('Preparing PDF...');
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const fileName = profile?.displayName 
        ? `${profile.displayName.replace(/\s+/g, '_')}_Resume.pdf` 
        : 'My_Resume.pdf';

      // 1. Generate Image from DOM
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowHeight: element.scrollHeight,
        windowWidth: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 Dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Calculate Image Dimensions to fit PDF
      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Variables to track where the image is drawn (for link mapping)
      let renderX = 0;
      let renderY = 0;
      let renderW = pdfWidth;
      let renderH = pdfImgHeight;

      // Logic to fit content if it's too tall (or just fit width if it fits)
      if (pdfImgHeight <= pdfHeight) {
        // Fits vertically, use full width
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfImgHeight);
      } else {
        // Too tall, scale to fit height (and center horizontally)
        renderH = pdfHeight;
        renderW = (imgProps.width * pdfHeight) / imgProps.height;
        renderX = (pdfWidth - renderW) / 2;
        pdf.addImage(imgData, 'JPEG', renderX, 0, renderW, renderH);
      }

      // -----------------------------------------------------------
      // ✅ FIX: MANUALLY ADD CLICKABLE LINKS OVER THE IMAGE
      // -----------------------------------------------------------
      const links = element.querySelectorAll('a');
      const domRect = element.getBoundingClientRect();
      
      // Scale Factor: Ratio of PDF Width (mm) to DOM Scroll Width (px)
      // This maps pixels on screen to millimeters on PDF
      const scaleFactor = renderW / element.scrollWidth;

      links.forEach(link => {
        if (!link.href) return;

        const linkRect = link.getBoundingClientRect();
        
        // Calculate relative position within the resume container
        const relativeX = linkRect.left - domRect.left;
        const relativeY = linkRect.top - domRect.top;
        
        // Convert to PDF coordinates
        const pdfLinkX = renderX + (relativeX * scaleFactor);
        const pdfLinkY = renderY + (relativeY * scaleFactor);
        const pdfLinkW = linkRect.width * scaleFactor;
        const pdfLinkH = linkRect.height * scaleFactor;

        // Add invisible clickable area
        pdf.link(pdfLinkX, pdfLinkY, pdfLinkW, pdfLinkH, { url: link.href });
      });
      // -----------------------------------------------------------

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
      {/* 1. HIDDEN PDF CONTAINER - For Generation Only */}
      <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
        <div id="resume-pdf">
          <ResumePDF data={resume} />
        </div>
      </div>

      <style jsx global>{`
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
           <div className="flex gap-2 items-center">
             <ShareButton 
                type="resume"
                data={{ fullName: resume.personalInfo?.fullName || "My Resume" }}
                customClass="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-sm font-bold shadow-sm"
             />

             <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium">
               <Save size={16} /> <span className="hidden sm:inline">Save</span>
             </button>
             <button onClick={() => { handleSave(); generatePDF(); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium">
               <Download size={16} /> <span className="hidden sm:inline">PDF</span>
             </button>
           </div>

           <div className="flex bg-gray-100 p-1 rounded-lg ml-2 sm:ml-4">
             <button onClick={()=>setActiveTab('edit')} className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab==='edit'?'bg-white text-blue-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Edit</button>
             <button onClick={()=>setActiveTab('preview')} className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab==='preview'?'bg-white text-blue-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Preview</button>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
        {activeTab === 'edit' ? (
          <div className="space-y-8 animate-in fade-in">
             <PersonalInfo data={resume.personalInfo || {}} onChange={updateInfo} />
             <SummarySection data={resume.summary || ''} onChange={updateSum} />
             <EducationSection data={resume.education || []} onAdd={addEdu} onUpdate={updEdu} onDelete={delEdu} />
             <SkillsSection data={resume.skills || {}} onChange={updSkills} metadata={metadata} />
             <ProjectsSection data={resume.projects || []} onAdd={addProj} onUpdate={updProj} onDelete={delProj} />
             <ExperienceSection data={resume.experience || []} onAdd={addExp} onUpdate={updExp} onDelete={delExp} />
             <ExtraCurricularSection data={resume.extraCurricular || []} onChange={updExtra} />
             
             <div className="flex justify-between items-center pt-10 border-t border-gray-200 mt-10 pb-10">
               <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                 <RefreshCw size={16} /> <span className="hidden sm:inline">Clear Data</span>
               </button>
               <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-sm font-bold shadow-lg">
                 Save Progress
               </button>
             </div>
          </div>
        ) : (
          /* ✅ RESPONSIVE PREVIEW CONTAINER */
          <div className="bg-gray-100 min-h-[600px] flex justify-center items-start pt-8 pb-8 rounded-xl border border-gray-200 overflow-hidden relative">
             <div 
               ref={previewContainerRef} 
               className="w-full flex justify-center"
             >
               <div 
                 style={{
                   width: '210mm',
                   minHeight: '297mm',
                   transform: `scale(${previewScale})`, 
                   transformOrigin: 'top center',
                   display: 'flex',
                   marginBottom: `-${(1 - previewScale) * 100}%`
                 }}
                 className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top"
               >
                  <ResumePDF data={resume} />
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}