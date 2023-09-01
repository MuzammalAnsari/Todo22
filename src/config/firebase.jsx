// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getConfig } from "@testing-library/react";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAYSbcI5bLeWxYObJtE3pAhFCbRwHrsyoQ",
  authDomain: "finaltodo-8f44a.firebaseapp.com",
  projectId: "finaltodo-8f44a",
  storageBucket: "finaltodo-8f44a.appspot.com",
  messagingSenderId: "29026982750",
  appId: "1:29026982750:web:49727022558b2f36a20dcf",
  measurementId: "G-V6SY8KYQDF"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const config = getConfig(app);

export { analytics, auth, config, firestore }





