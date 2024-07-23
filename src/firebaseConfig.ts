import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCg7i1h-kFJETFzX808SP5-01efVB_xEFM",
  authDomain: "testtask-6e36c.firebaseapp.com",
  projectId: "testtask-6e36c",
  storageBucket: "testtask-6e36c.appspot.com",
  messagingSenderId: "515212709897",
  appId: "1:515212709897:web:0a1df8c25fcb07f23ce8d8",
  measurementId: "G-3RS0CX3RQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const analytics = getAnalytics(app);

export { db }