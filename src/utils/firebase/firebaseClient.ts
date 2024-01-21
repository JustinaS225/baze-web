import { getApps, initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Your Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize the Firebase client app
var app = initializeApp(firebaseConfig);
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Get the Firebase client services
export const auth = getAuth(app);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export let analytics: Analytics;

if (typeof window !== 'undefined') {
  isSupported().then((isSupported) => {
    if (isSupported && Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED)) {
      analytics = getAnalytics(app);
    }
  });
}