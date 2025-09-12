// firebase.client.ts
import { getDatabase } from "firebase/database";

let appInstance: any = null;
let authInstance: any = null;

export const initApp = async () => {
  if (appInstance) return appInstance;

  const { initializeApp } = await import("firebase/app");

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_APP_NAME}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_APP_NAME,
    storageBucket: `${import.meta.env.VITE_FIREBASE_APP_NAME}.appspot.com`,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  appInstance = initializeApp(firebaseConfig);
  return appInstance;
};

export const getDb = async () => {
  const app = await initApp();
  try {
    return getDatabase(app);
  } catch (e) {
    console.warn("Firebase RTDB WS failed, fallback to HTTPS long-polling", e);
    return getDatabase(app); // comunque funziona
  }
};

// Lazy-load Auth solo quando serve
export const getAuthInstance = async () => {
  if (!authInstance) {
    const app = await initApp();
    const { getAuth } = await import("firebase/auth");
    authInstance = getAuth(app);
  }
  return authInstance;
};
