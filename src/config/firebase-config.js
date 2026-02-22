// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANC3N6xfQpStePV2M6VtPVuWmpKxpbBZk",
  authDomain: "expense-tracker-5b523.firebaseapp.com",
  projectId: "expense-tracker-5b523",
  storageBucket: "expense-tracker-5b523.firebasestorage.app",
  messagingSenderId: "318762209637",
  appId: "1:318762209637:web:2c1c2f6e1d307f04a7d18c",
  measurementId: "G-5S44D4XP66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
const analytics = getAnalytics(app);
