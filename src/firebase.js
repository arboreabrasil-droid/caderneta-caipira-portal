import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXo7pGdrcgMi7vRpZPBS7P9_QAcOIydUE",
  authDomain: "caderneta-caipira.firebaseapp.com",
  projectId: "caderneta-caipira",
  storageBucket: "caderneta-caipira.firebasestorage.app",
  messagingSenderId: "497801207115",
  appId: "1:497801207115:web:c601e9886418f1c654dcce"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
export const db = getFirestore(app);
