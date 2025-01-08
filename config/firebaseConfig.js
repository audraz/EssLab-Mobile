import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlOupgbFc1e5Cm2iavBOLDwuxS12jvBzQ",
  authDomain: "eab-7be6d.firebaseapp.com",
  projectId: "eab-7be6d",
  storageBucket: "eab-7be6d.appspot.com",
  messagingSenderId: "440960253397",
  appId: "1:440960253397:android:99976bb5069de54ccf915c",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log("Firebase initialized:", app.name);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
