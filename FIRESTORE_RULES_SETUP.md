# Firebase Firestore Rules - Copy & Paste

## 🎯 Step-by-Step Setup

### 1. Open Firebase Console
- Go to: https://console.firebase.google.com/
- Select your project

### 2. Navigate to Firestore Rules
- Left sidebar: **Firestore Database**
- Top tabs: Click **Rules** tab

### 3. Delete All Existing Rules
Select all and delete (or select current content)

### 4. Copy & Paste These Rules

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

### 5. Click "Publish" Button
- Bottom right corner
- Confirm when prompted

### 6. Restart Dev Server
```bash
# Stop current server: Ctrl+C
npm run dev
```

---

## ✅ What These Rules Do

| Collection | Rule | Meaning |
|-----------|------|---------|
| `users` | `users/{userId}` | Users can only access their own profile |
| `resumes` | `resumes/{userId}` | Users can only access their own resume |

## 🔒 Security Features

✅ Only authenticated users (`request.auth != null`)  
✅ Can only access own documents (`uid == userId`)  
✅ Read permission: Users can load their resume  
✅ Write permission: Users can save/update resume  
✅ No admin override needed  
✅ Prevents access to other users' data  

## 📝 Notes

- `{database}` = automatically replaced with your database name
- `{userId}` = user's Firebase Authentication UID
- `request.auth.uid` = the currently logged-in user's ID
- Rules apply automatically to all documents in that path

## 🧪 Testing After Setup

1. Reload your app
2. Login with your account
3. Go to `/resume`
4. Fill and save resume
5. Check Firebase Console → Firestore → Data tab
6. You should see `resumes` collection with your data

---

## ⚠️ Common Mistakes

❌ **DON'T** forget to click "Publish"  
❌ **DON'T** change `{database}` or `{userId}` - they're placeholders  
❌ **DON'T** add rules only for `users` - you need `resumes` too  
❌ **DON'T** restart server before publishing rules  

---

## 📞 If It Still Doesn't Work

Check console for errors:
1. Open DevTools: F12
2. Go to Console tab
3. Look for error messages
4. Common error: "Permission denied" = Rules not published properly
5. Try: Reload page, clear cache, restart server

**Error Example:**
```
FirebaseError: Missing or insufficient permissions
```

**Fix:**
- Verify rules are published (shows "Last updated X minutes ago")
- Check rule syntax (must match exactly)
- Restart dev server
- Try again
