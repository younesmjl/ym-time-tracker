import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_4cIr373IbWUqCc2n2Z-aui9mhiYbgXU",
  authDomain: "ym-time-tracker.firebaseapp.com",
  projectId: "ym-time-tracker",
  storageBucket: "ym-time-tracker.appspot.com",
  messagingSenderId: "194215358367",
  appId: "1:194215358367:web:a7bb4f3df6e0a77f8e17aa",
  measurementId: "G-3VVJY390SF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

export const Auth = auth;

export async function register(email, password) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return [res, null];
  } catch (error) {
    return [null, error];
  }
}
