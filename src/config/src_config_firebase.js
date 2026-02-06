// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXo7pGdrcgMi7vRpZPBS7P9_QAcOIydUE",
  authDomain: "caderneta-caipira.firebaseapp.com",
  projectId: "caderneta-caipira",
  storageBucket: "caderneta-caipira.firebasestorage.app",
  messagingSenderId: "497801207115",
  appId: "1:497801207115:web:c601e9886418f1c654dcce",
  measurementId: "G-N5SE4DWSYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
