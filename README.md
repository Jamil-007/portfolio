# Portfolio

A Firebase-backed portfolio with in-app editing, project analytics, and a Notion-inspired visual system.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth
- Cloud Firestore
- Recharts

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication.
3. Add Email/Password or Google as a sign-in provider.
4. Create a Firestore database.
5. Copy `.env.example` to `.env.local` and fill in the Firebase web app values.
6. Set `NEXT_PUBLIC_ADMIN_EMAIL` to your admin account email.
7. Open `firestore.rules`, replace `REPLACE_WITH_YOUR_ADMIN_EMAIL`, and publish the rules in Firebase.
8. Run the app and open `/login`.
9. After logging in, open `/admin` and use **Seed demo** to add starter content.

If the browser console shows `FirebaseError: [code=permission-denied]`, the app is connected to Firebase but Firestore rules are blocking reads or writes. Publish the rules from `firestore.rules` in Firebase Console → Firestore Database → Rules, then wait a few seconds and refresh the app.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

The public site falls back to demo content if Firebase env vars are not configured, but `/admin` needs Firebase.
