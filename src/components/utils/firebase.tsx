import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD5wdDpCMk5WwcHhSS5QD5xBK4oqpn7fpQ",
    authDomain: "pizzeria-39338.firebaseapp.com",
    databaseURL:
        "https://pizzeria-39338-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pizzeria-39338",
    storageBucket: "pizzeria-39338.appspot.com",
    messagingSenderId: "219676177674",
    appId: "1:219676177674:web:91ba4b6708043fdd8936f3",
    measurementId: "G-PV0DTEZG1H",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
