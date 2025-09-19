// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcwdmofoZJXs_I8wn5hkt0ICQ9PLetGJI",
  authDomain: "tripgenie-app.firebaseapp.com",
  projectId: "tripgenie-app",
  storageBucket: "tripgenie-app.firebasestorage.app",
  messagingSenderId: "4277873851",
  appId: "1:4277873851:web:ae5bb3c12fc1f344030d9e",
  measurementId: "G-BFR94F5ESY"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app)

export {app, auth};