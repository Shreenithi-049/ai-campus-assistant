import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase Configuration
 * 
 * IMPORTANT SECURITY NOTE:
 * - All Firebase config values are loaded from environment variables
 * - Never commit real API keys or secrets to version control
 * - Create a .env file locally using .env.example as a template
 * - Environment variables must use EXPO_PUBLIC_ prefix to be accessible in Expo
 * 
 * For team members:
 * 1. Copy .env.example to .env
 * 2. Fill in your Firebase project credentials from Firebase Console
 * 3. Never commit your .env file (it's in .gitignore)
 */

// Validate that all required environment variables are present
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0) {
  console.error(
    '❌ Missing required Firebase environment variables:',
    missingVars.join(', ')
  );
  console.error(
    '📝 Please create a .env file with the required variables. See .env.example for reference.'
  );
  throw new Error(
    `Missing Firebase configuration. Please set: ${missingVars.join(', ')}`
  );
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
