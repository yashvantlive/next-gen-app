import { db } from './firebaseClient';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

// Default resume template
export const DEFAULT_RESUME = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
    website: ''
  },
  summary: '',
  education: [
    {
      id: Date.now(),
      degree: '',
      institution: '',
      university: '',
      year: '',
      cgpa: ''
    }
  ],
  skills: [],
  projects: [
    {
      id: Date.now(),
      title: '',
      description: '',
      techStack: [],
      link: ''
    }
  ],
  experience: []
};

/**
 * Load resume from Firestore
 * Returns resume data if exists, otherwise returns null
 */
export async function loadResume(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    console.log('📖 Loading resume for user:', userId);
    const resumeRef = doc(db, 'resumes', userId);
    const resumeSnap = await getDoc(resumeRef);

    if (resumeSnap.exists()) {
      console.log('✅ Resume loaded successfully');
      return resumeSnap.data().resumeData || DEFAULT_RESUME;
    }

    console.log('ℹ️ No existing resume found, will create new one on save');
    return null;
  } catch (error) {
    console.error('❌ Error loading resume:', error.message);
    
    // Check for permission errors
    if (error?.code === 'permission-denied' || /permission|insufficient/i.test(error?.message || '')) {
      throw new Error(
        'Permission denied: Cannot load resume. Make sure your Firestore rules allow authenticated users to read their own resumes/{uid} document. See README for setup instructions.'
      );
    }
    
    throw error;
  }
}

/**
 * Save resume to Firestore
 * Creates or updates resume document in 'resumes' collection
 */
export async function saveResume(userId, resumeData) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!resumeData) {
    throw new Error('Resume data is required');
  }

  try {
    console.log('📝 Saving resume for user:', userId);
    const resumeRef = doc(db, 'resumes', userId);

    await setDoc(
      resumeRef,
      {
        userId,
        resumeData,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      },
      { merge: true }
    );

    console.log('✅ Resume saved successfully to resumes collection');
    return true;
  } catch (error) {
    console.error('❌ Error saving resume:', error.message);
    
    // Check for permission errors
    if (error?.code === 'permission-denied' || /permission|insufficient/i.test(error?.message || '')) {
      throw new Error(
        'Permission denied: Cannot save resume. Make sure your Firestore rules allow authenticated users to write to their own resumes/{uid} document. See README for setup instructions.'
      );
    }
    
    throw error;
  }
}

/**
 * Delete entire resume from Firestore
 */
export async function deleteResume(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    console.log('🗑️ Deleting resume for user:', userId);
    const resumeRef = doc(db, 'resumes', userId);
    await deleteDoc(resumeRef);

    console.log('✅ Resume deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting resume:', error.message);
    
    // Check for permission errors
    if (error?.code === 'permission-denied' || /permission|insufficient/i.test(error?.message || '')) {
      throw new Error(
        'Permission denied: Cannot delete resume. Make sure your Firestore rules allow authenticated users to delete their own resumes/{uid} document.'
      );
    }
    
    throw error;
  }
}

/**
 * Validate resume data
 * Returns array of errors, empty if valid
 */
export function validateResume(resumeData) {
  const errors = [];

  // Required fields
  if (!resumeData.personalInfo.fullName?.trim()) {
    errors.push('Full name is required');
  }

  if (!resumeData.personalInfo.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(resumeData.personalInfo.email)) {
    errors.push('Invalid email format');
  }

  if (!resumeData.skills || resumeData.skills.length === 0) {
    errors.push('Add at least one skill');
  }

  // At least one education entry with degree
  if (
    !resumeData.education ||
    resumeData.education.length === 0 ||
    !resumeData.education.some(e => e.degree?.trim())
  ) {
    errors.push('Add at least one education entry with degree');
  }

  return errors;
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Get total resume count (optional - for admin analytics)
 */
export async function getResumeCount() {
  try {
    const resumesRef = collection(db, 'resumes');
    const snapshot = await getDocs(resumesRef);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error getting resume count:', error.message);
    return 0;
  }
}

/**
 * Generate resume text (for export/copy)
 */
export function generateResumeText(resumeData) {
  let text = '';

  // Header
  text += `${resumeData.personalInfo.fullName || 'Your Name'}\n`;
  text += `${resumeData.personalInfo.email || ''} | ${resumeData.personalInfo.phone || ''} | ${resumeData.personalInfo.location || ''}\n`;
  if (resumeData.personalInfo.linkedIn || resumeData.personalInfo.github) {
    text += `${resumeData.personalInfo.linkedIn || ''} | ${resumeData.personalInfo.github || ''}\n`;
  }
  text += '\n';

  // Summary
  if (resumeData.summary) {
    text += `PROFESSIONAL SUMMARY\n`;
    text += `${resumeData.summary}\n\n`;
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += `EDUCATION\n`;
    resumeData.education.forEach(edu => {
      if (edu.degree) {
        text += `${edu.degree} | ${edu.year || ''}\n`;
        text += `${edu.institution}${edu.university ? `, ${edu.university}` : ''}\n`;
        if (edu.cgpa) text += `CGPA: ${edu.cgpa}\n`;
        text += '\n';
      }
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += `SKILLS\n`;
    text += `${resumeData.skills.join(', ')}\n\n`;
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    const filledProjects = resumeData.projects.filter(p => p.title);
    if (filledProjects.length > 0) {
      text += `PROJECTS\n`;
      filledProjects.forEach(project => {
        text += `${project.title}\n`;
        text += `${project.description}\n`;
        if (project.techStack.length > 0) {
          text += `Tech Stack: ${project.techStack.join(', ')}\n`;
        }
        if (project.link) {
          text += `${project.link}\n`;
        }
        text += '\n';
      });
    }
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    text += `EXPERIENCE\n`;
    resumeData.experience.forEach(exp => {
      text += `${exp.role} | ${exp.duration || ''}\n`;
      text += `${exp.company}\n`;
      text += `${exp.description}\n\n`;
    });
  }

  return text;
}
