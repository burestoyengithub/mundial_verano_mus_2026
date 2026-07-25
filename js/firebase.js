// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7GYqyX9TGF1HJDCVRDA_OMdHqB3KM40s",
  authDomain: "mundial-verano-mus-2026.firebaseapp.com",
  projectId: "mundial-verano-mus-2026",
  storageBucket: "mundial-verano-mus-2026.firebasestorage.app",
  messagingSenderId: "572625238026",
  appId: "1:572625238026:web:036081bbadf6d8e4a247f3",
  measurementId: "G-P4D5J928ZP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Crear conexión Firestore
const db = firebase.firestore();

console.log("Firebase conectado correctamente");