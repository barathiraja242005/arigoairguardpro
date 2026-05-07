import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  throw new Error(
    `Missing Firebase env vars: ${missing.join(", ")}. Copy .env.example to .env and fill in values.`,
  );
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let anonymousAuthPromise: Promise<User> | null = null;

export function ensureAnonymousAuth(): Promise<User> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  if (anonymousAuthPromise) return anonymousAuthPromise;

  anonymousAuthPromise = new Promise<User>((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve(user);
      }
    });

    signInAnonymously(auth).catch((err) => {
      unsub();
      anonymousAuthPromise = null;
      reject(err);
    });
  });

  return anonymousAuthPromise;
}

void ensureAnonymousAuth();

export { database, auth };
