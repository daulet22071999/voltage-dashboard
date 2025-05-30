import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBDbxPGi5krYmyRecbFg-rP-1AqNfM32-g",
    authDomain: "dashboard-rmn.firebaseapp.com",
    databaseURL: "https://dashboard-rmn-default-rtdb.firebaseio.com",
    projectId: "dashboard-rmn",
    storageBucket: "dashboard-rmn.firebasestorage.app",
    messagingSenderId: "588441200735",
    appId: "1:588441200735:web:d821cb20464e0412fd93ea",
    measurementId: "G-SWMX5B3JZS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getDatabase(app);


export { database, ref, db, set, onValue };