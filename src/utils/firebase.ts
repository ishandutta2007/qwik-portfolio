import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const env = import.meta.env;

let appInstance: any; // per cache singleton

export const initApp = async () => {
  if (appInstance) return appInstance;

  const { initializeApp } = await import("firebase/app");

  const firebaseConfig = {
    apiKey: env._FIREBASE_API_KEY,
    authDomain: `${env._FIREBASE_APP_NAME}.firebaseapp.com`,
    projectId: env._FIREBASE_APP_NAME,
    storageBucket: `${env._FIREBASE_APP_NAME}.appspot.com`,
    messagingSenderId: env._FIREBASE_MESSAGING_SENDER_ID,
    appId: env._FIREBASE_APP_ID,
    databaseURL: env._FIREBASE_DB_URL,
    measurementId: env._FIREBASE_MEASUREMENT_ID,
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
