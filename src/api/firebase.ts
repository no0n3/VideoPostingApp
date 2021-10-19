import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlFhUR1XoQwpKRLbI7cGR571sXLUg09wk",
  authDomain: "video-posting-app.firebaseapp.com",
  projectId: "video-posting-app",
  storageBucket: "video-posting-app.appspot.com",
  messagingSenderId: "1076756497531",
  appId: "1:1076756497531:web:ef6c5836a58b42709acede",
  measurementId: "G-3W35H16336"
};

initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
export const authProviders = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider()
};
