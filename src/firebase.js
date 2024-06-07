// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, onValue, update, off } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtKH83at_WWi9au5Men25gpyLZjpJKQTk",
    authDomain: "vampires-and-villagers.firebaseapp.com",
    databaseURL: "https://vampires-and-villagers-default-rtdb.firebaseio.com",
    projectId: "vampires-and-villagers",
    storageBucket: "vampires-and-villagers.appspot.com",
    messagingSenderId: "205478640705",
    appId: "1:205478640705:web:537581d4e01a2dac4d1ac0",
    measurementId: "G-P793ZTGWZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const real = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserLocalPersistence);

export { db, auth, real, ref, set, onValue, update, off };
