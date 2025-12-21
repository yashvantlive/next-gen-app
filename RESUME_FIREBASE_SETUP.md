# Resume Builder - Firebase Setup Guide

## Problem: Resume Data Not Saving

If your resume data is not being saved to Firebase, follow these steps:

## Step 1: Update Firestore Security Rules ✅

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the entire content with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only user can read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Resumes - only user can read/write their own resume
    match /resumes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish** button

## Step 2: Verify Firebase Configuration

Make sure your `.env.local` file has these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 3: Restart Development Server

After updating Firestore rules:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 4: Test Resume Saving

1. Login to your app
2. Complete your profile (onboarding)
3. Go to `/resume` page
4. Fill in resume data
5. Click **Save Resume**
6. Check the success message

## Step 5: Verify Data in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Firestore Database** → **Data** tab
3. You should see a `resumes` collection with a document named with your user ID

Example structure:
```
resumes/
├── abc123xyz... (your user ID)
│   ├── userId: "abc123xyz..."
│   ├── resumeData: {
│   │   ├── personalInfo: {...}
│   │   ├── summary: "..."
│   │   ├── education: [...]
│   │   ├── skills: [...]
│   │   ├── projects: [...]
│   │   └── experience: [...]
│   ├── updatedAt: timestamp
│   └── createdAt: timestamp
```

## Troubleshooting

### Error: "Permission denied: Cannot save resume"

**Solution:**
1. Ensure Firestore rules are published (Step 1)
2. Check that `resumes/{userId}` rule is correctly set
3. Restart dev server
4. Check browser console for detailed error message

### Error: "User ID is required"

**Solution:**
- Make sure you're logged in before accessing resume page
- Check that auth state is properly set

### Resume data not appearing

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs starting with `📝 Saving resume...`
4. Check for errors
5. Visit Firebase Console → Firestore → Data to see if collection exists

## Storage Location

- **Collection Name:** `resumes`
- **Document ID:** Your Firebase user ID (UID)
- **Independent from Profile:** Resume data is completely separate from user profile data in `users/{uid}`

## Features

✅ Save resume to Firestore
✅ Load previously saved resume
✅ Edit and update resume
✅ Delete entire resume
✅ Download as PDF (A4 format)
✅ Validation before save
✅ Error messages with helpful hints

## API Endpoints Used

- `loadResume(userId)` - Load user's resume
- `saveResume(userId, resumeData)` - Save/update resume
- `deleteResume(userId)` - Delete entire resume
- `validateResume(resumeData)` - Validate before saving

All functions are in `src/lib/resumeHelpers.js`
