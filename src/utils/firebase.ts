import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

let appInstance: any; // cache singleton

export const initApp = async () => {
  if (appInstance) return appInstance;

  const { initializeApp } = await import("firebase/app");

  // usa import.meta.env con VITE_ per le variabili lato client
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: `${process.env.VITE_FIREBASE_APP_NAME}.firebaseapp.com`,
    projectId: process.env.VITE_FIREBASE_APP_NAME,
    storageBucket: `${process.env.VITE_FIREBASE_APP_NAME}.appspot.com`,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    databaseURL: process.env.VITE_FIREBASE_DB_URL,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
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
