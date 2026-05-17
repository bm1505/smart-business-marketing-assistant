import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// SmartBiashara Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyATRI0Hv1RrzZjFrewaT2kUUBiwoqkwiE0",
  authDomain: "smartbiashara-b2300.firebaseapp.com",
  projectId: "smartbiashara-b2300",
  storageBucket: "smartbiashara-b2300.firebasestorage.app",
  messagingSenderId: "123995383943",
  appId: "1:123995383943:web:9267e9c89f2c80e9c37022",
  measurementId: "G-29KZTV1K05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in the app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
