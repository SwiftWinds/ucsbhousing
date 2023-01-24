import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPKaYilcWpJoPBu_IGvZDMqv6V1EZvMq0",
  authDomain: "ucsb-housing.firebaseapp.com",
  projectId: "ucsb-housing",
  storageBucket: "ucsb-housing.appspot.com",
  messagingSenderId: "46278874494",
  appId: "1:46278874494:web:01013fbebb3230e7354f2f",
  measurementId: "G-NWVG3NHKTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);