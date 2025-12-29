import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // STRICT: Production Domain Only
  const BASE_URL = 'https://youlearn.community';
  
  // 1. Public Routes Only (No Home/Todo/Profile)
  const staticRoutes = [
    '',           // Landing
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/auth/login' // Login is public entry
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // 2. Dynamic Syllabus Routes
    const syllabusRef = collection(db, 'syllabi');
    const syllabusSnap = await getDocs(syllabusRef);
    const syllabusRoutes = syllabusSnap.docs.map(doc => ({
      url: `${BASE_URL}/syllabus?id=${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // 3. Dynamic PYQ Routes
    const pyqRef = collection(db, 'pyqs');
    const pyqSnap = await getDocs(pyqRef);
    const pyqRoutes = pyqSnap.docs.map(doc => ({
      url: `${BASE_URL}/pyq?id=${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate() || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...syllabusRoutes, ...pyqRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticRoutes;
  }
}