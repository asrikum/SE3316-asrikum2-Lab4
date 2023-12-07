// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB34YRtu0uxawLeAa1v__IVvXNqYsoxHFM",
  authDomain: "react-firebase-login-78299.firebaseapp.com",
  projectId: "react-firebase-login-78299",
  storageBucket: "react-firebase-login-78299.appspot.com",
  messagingSenderId: "95180328375",
  appId: "1:95180328375:web:d7638408924646eef8ac32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);