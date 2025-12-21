"use client";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}



let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export async function signInWithGoogle() {
  try {
    console.log('🟢 Initiating Google sign-in (popup)...');
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, googleProvider);
    console.log('✅ signInWithGoogle popup success:', res);
    return res;
  } catch (err) {
    console.error('signInWithGoogle popup error:', err);

    // If the popup is blocked or not allowed, fallback to redirect
    const msg = String(err?.code || err?.message || "").toLowerCase();
    if (msg.includes('popup') || msg.includes('blocked') || msg.includes('redirect')) {
      try {
        console.log('🔁 Popup blocked — falling back to redirect sign-in');
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        await signInWithRedirect(auth, googleProvider);
        // Note: redirect does not return to this function; it will navigate the browser
        return { redirected: true };
      } catch (err2) {
        console.error('signInWithGoogle redirect fallback failed:', err2);
        throw err2;
      }
    }

    // Re-throw so callers can show the message for other errors
    throw err;
  }
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

// Firestore helpers
export async function getUserProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  try {
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("getUserProfile error:", err);
    if (err?.code === "permission-denied" || /permission|insufficient/i.test(err?.message || "")) {
      throw new Error(
        "Permission denied: cannot read profile. Make sure your Firestore rules allow authenticated users to read their own document (see README).")
    }
    throw err;
  }
}

export async function setUserProfile(uid, data) {
  if (!uid) throw new Error("UID required to set user profile");
  const ref = doc(db, "users", uid);
  try {
    await setDoc(ref, data, { merge: true });
    return true;
  } catch (err) {
    console.error("setUserProfile error:", err);
    if (err?.code === "permission-denied" || /permission|insufficient/i.test(err?.message || "")) {
      throw new Error(
        "Permission denied: cannot write profile. Update your Firestore rules to allow authenticated users to write their own users/{uid} document (see README)."
      );
    }
    throw err;
  }
}

// Initialize user role on first sign-in
export async function initializeUserRole(uid) {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  try {
    const snap = await getDoc(ref);
    // Only set role if user document doesn't exist
    if (!snap.exists()) {
      await setDoc(ref, { role: "user" }, { merge: true });
    }
  } catch (err) {
    console.error("initializeUserRole error:", err);
  }
}
