'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import PersonalInfo from '../../components/resume/PersonalInfo';
import SummarySection from '../../components/resume/SummarySection';
import EducationSection from '../../components/resume/EducationSection';
import SkillsSection from '../../components/resume/SkillsSection';
import ProjectsSection from '../../components/resume/ProjectsSection';
import ExperienceSection from '../../components/resume/ExperienceSection';
import ResumePreview from '../../components/resume/ResumePreview';

import { loadResume, saveResume, deleteResume, DEFAULT_RESUME, validateResume } from '../../lib/resumeHelpers';

export default function ResumePage() {
  const router = useRouter();
  const hydratedRef = useRef(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      hydratedRef.current = true;

      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      setUser(currentUser);

      // Check if profile exists
      try {
        const profileRef = doc(db, 'users', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (!profileSnap.exists()) {
          router.push('/onboarding');
          return;
        }

        setProfile(profileSnap.data());

        // Load resume
        const resumeData = await loadResume(currentUser.uid);
        if (resumeData) {
          setResume(resumeData);
        } else {
          setResume(DEFAULT_RESUME);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading profile/resume:', err);
        setError('Failed to load your profile');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!hydratedRef.current || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center pb-32">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <svg className="w-8 h-8 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center pb-32">
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center max-w-md">
          <p className="text-gray-600 mb-4">Failed to load resume data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate resume
      const errors = validateResume(resume);
      if (errors.length > 0) {
        setError('Please fill in all required fields: ' + errors.join(', '));
        return;
      }

      setSaving(true);
      await saveResume(user.uid, resume);

      setSuccess('Resume saved successfully! 💾');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearResume = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you sure you want to clear your entire resume?\n\n' +
      'All your resume data will be permanently deleted.\n\n' +
      'This action cannot be undone!'
    );

    if (!confirmed) return;

    try {
      setError('');
      setSaving(true);
      await deleteResume(user.uid);

      setResume(DEFAULT_RESUME);
      setSuccess('Resume cleared successfully! 🗑️');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to clear resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Validate before export
      const errors = validateResume(resume);
      if (errors.length > 0) {
        setError('Please fill in all required fields before downloading');
        return;
      }

      // Save first before downloading
      setSaving(true);
      await saveResume(user.uid, resume);

      // Switch to preview and trigger print
      setActiveTab('preview');
      setTimeout(() => {
        window.print();
      }, 500);

      setSuccess('Resume saved! Use print dialog to save as PDF.');
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Update resume state handlers
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value) => {
    setResume(prev => ({
      ...prev,
      summary: value
    }));
  };

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: '',
          institution: '',
          university: '',
          year: '',
          cgpa: ''
        }
      ]
    }));
  };

  const updateEducation = (id, updated) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? updated : edu)
    }));
  };

  const deleteEducation = (id) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateSkills = (skills) => {
    setResume(prev => ({
      ...prev,
      skills
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          title: '',
          description: '',
          techStack: [],
          link: ''
        }
      ]
    }));
  };

  const updateProject = (id, updated) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? updated : proj)
    }));
  };

  const deleteProject = (id) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          id: Date.now(),
          company: '',
          role: '',
          duration: '',
          description: ''
        }
      ]
    }));
  };

  const updateExperience = (id, updated) => {
    setResume(prev => ({
      ...prev,
      experience: (prev.experience || []).map(exp => exp.id === id ? updated : exp)
    }));
  };

  const deleteExperience = (id) => {
    setResume(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(exp => exp.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600 text-sm mt-1">Create and manage your professional resume</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'edit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Resume
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'edit' ? (
          <div className="space-y-6">
            {/* Personal Info */}
            <PersonalInfo
              data={resume.personalInfo}
              onChange={(field, value) => updatePersonalInfo(field, value)}
            />

            {/* Summary */}
            <SummarySection data={resume.summary} onChange={updateSummary} />

            {/* Education */}
            <EducationSection
              data={resume.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onDelete={deleteEducation}
            />

            {/* Skills */}
            <SkillsSection data={resume.skills} onChange={updateSkills} />

            {/* Projects */}
            <ProjectsSection
              data={resume.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
            />

            {/* Experience */}
            <ExperienceSection
              data={resume.experience || []}
              onAdd={addExperience}
              onUpdate={updateExperience}
              onDelete={deleteExperience}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {saving ? 'Saving...' : 'Save Resume'}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>

              <button
                onClick={handleClearResume}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-8 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Resume
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Resume Preview</h2>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print/Download
              </button>
            </div>
            <div id="resume-print" className="p-8 overflow-auto">
              <ResumePreview data={resume} />
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          #resume-print {
            page-break-after: always;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
