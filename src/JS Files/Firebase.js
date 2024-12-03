import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAK85Tzb0N0Qg7S9-SprtnXue3Fll9rFwE",
    authDomain: "car-garage-system.firebaseapp.com",
    projectId: "car-garage-system",
    storageBucket: "car-garage-system.firebasestorage.app",
    messagingSenderId: "581884351958",
    appId: "1:581884351958:web:180e59c04e8cace68fc077",
    measurementId: "G-JE41V4S9T1"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app);