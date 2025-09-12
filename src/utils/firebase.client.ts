// firebase.client.ts
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

let appInstance: any;

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
  return getDatabase(app);
};

export const getAuthInstance = async () => {
  const app = await initApp();
  return getAuth(app);
};
