import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const {
  REACT_APP_FIREBASE_API_KEY: apiKey,
  REACT_APP_FIREBASE_AUTH_DOMAIN: authDomain,
  REACT_APP_FIREBASE_PROJECT_ID: projectId,
  REACT_APP_FIREBASE_STORAGE_BUCKET: storageBucket,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  REACT_APP_FIREBASE_APP_ID: appId,
} = process.env;

const missing = ['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId']
  .filter(k => !({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }[k]));

if (missing.length > 0) {
  throw new Error(
    `Missing Firebase env vars: ${missing.map(k => `REACT_APP_FIREBASE_${k.toUpperCase()}`).join(', ')}\n` +
    'Copy admin-panel/.env.example to admin-panel/.env and fill in your Firebase credentials.'
  );
}

const firebaseConfig = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch(console.error);

export default app;
