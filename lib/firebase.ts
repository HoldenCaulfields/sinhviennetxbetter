// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArbTjxUt20KNI1mKLS5sBOhFKxB0pLbUs",
  authDomain: "sinhviennet-fc858.firebaseapp.com",
  databaseURL: "https://sinhviennet-fc858-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sinhviennet-fc858",
  storageBucket: "sinhviennet-fc858.firebasestorage.app",
  messagingSenderId: "322852182802",
  appId: "1:322852182802:web:cdae1e0a267a23dcbcb1cb",
  measurementId: "G-HRTLPKBFB1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export async function initAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}