import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZBPr4eTd5gP4DXiPjmCEtpDoyGkOYVBo",
  authDomain: "eab-ff814.firebaseapp.com",
  projectId: "eab-ff814",
  storageBucket: "eab-ff814.firebasestorage.app",
  messagingSenderId: "164947026755",
  appId: "1:164947026755:web:14ae2cb797f632bee905f6",
  measurementId: "G-B5GL4K7KCY"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log("Firebase initialized:", app.name);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
