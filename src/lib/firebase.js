import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDSUJj7h1_a_Rorn9hnTPmksjt_IIbu6t4",
    authDomain: "schedule-manager-2025.firebaseapp.com",
    projectId: "schedule-manager-2025",
    storageBucket: "schedule-manager-2025.firebasestorage.app",
    messagingSenderId: "1009272913102",
    appId: "1:1009272913102:web:7eceb6ced363ea66a0e49f",
    measurementId: "G-LTKKGEE3WC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
