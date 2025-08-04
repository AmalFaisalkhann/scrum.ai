

//firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDocs, collection } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJBiLon8vYqk5EhDZ47s7uqMZuwljKQF8",
  authDomain: "scrum-92451.firebaseapp.com",
  projectId: "scrum-92451",
  storageBucket: "scrum-92451.firebasestorage.app",
  messagingSenderId: "641839499000",
  appId: "1:641839499000:web:ff95b213adbd6d6dec5d0d",
  measurementId: "G-Y6766EMEHH"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);




// ✅ Add this function at the end:
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users')); // or 'adminUsers' if that's your collection
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};