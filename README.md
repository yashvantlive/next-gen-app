This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Firebase Authentication (Google) 🔒

This project includes a simple login and signup UI that uses Firebase Authentication (Google Sign-In).

Steps to set up locally:

1. Create a Firebase project at https://console.firebase.google.com/ and enable **Google** under Authentication > Sign-in method.
2. Add a Web App in your Firebase project and copy the config values.
3. Create a `.env.local` file in the project root and set these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Install the Firebase SDK:

```bash
npm install firebase
```

5. Run the dev server:

```bash
npm run dev
```

Visit `/auth/login` or `/auth/signup` to try Google authentication.

Important: after changing `.env` or `.env.local`, **restart** the dev server so Next.js picks up the new environment variables.

If you deploy to Vercel, add the same environment variables under your project settings.

---

## Firestore security rules for user profiles & resumes 🔐

If you store user profiles in `users/{uid}` and resumes in `resumes/{uid}`, use rules that only allow authenticated users to read and write their own documents. Example rule to use in the Firestore Console or `firestore.rules`:

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

Notes:
- This prevents users from reading or modifying other users' profiles and resumes.
- User resumes are stored in a separate `resumes` collection with the user ID as the document ID
- Each user can only access and modify their own resume data
- If you add profile image uploads, add Storage rules and use Firebase Storage to store images (then save the image URL in the user's Firestore document).

Troubleshooting permission errors:
- If you see a browser console error `FirebaseError: Missing or insufficient permissions` when reading/writing profiles or resumes, check that:
  1. Your Firestore rules (see above) are deployed and include both `users/{userId}` AND `resumes/{userId}` rules
  2. You're signed in (Auth state available in the client).
  3. The Firebase project config in `.env.local` matches the project where Firestore rules are set.
  4. Make sure the `resumes` collection exists (Firestore creates it automatically on first write)

After changing rules or `.env` values, restart the dev server and retry the action.


