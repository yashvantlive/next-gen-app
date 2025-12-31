import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Internal initialization (Not exported to avoid conflicts)
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// --- AUTH FUNCTIONS ---

export async function signInWithGoogle() {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, googleProvider);
    return res;
  } catch (err) {
    console.error('Popup failed, trying redirect...', err);
    if (err.message.includes('Cross-Origin-Opener-Policy') || err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return { redirected: true };
    }
    throw err;
  }
}

export function logOut() {
  return firebaseSignOut(auth);
}
export const signOut = logOut;

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

// --- FIRESTORE HELPER FUNCTIONS ---

export async function getUserProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  try {
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    return null;
  }
}

export async function setUserProfile(uid, data) {
  if (!uid) throw new Error("UID required");
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
  return true;
}

export async function initializeUserRole(uid) {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { role: "user", createdAt: new Date().toISOString() }, { merge: true });
  }
}

// ✅ FIX: Removed 'app' and 'firebaseApp' from exports completely.
// Only exporting the tools your app actually uses.
export { auth, db, storage, googleProvider };