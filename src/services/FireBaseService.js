import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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

export async function login(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return [res, null];
  } catch (error) {
    return [null, error];
  }
}

const errorsTranslations = {
  "auth/email-already-in-use":
    "L'email indiqué est déjà lié à un compte existant",
  "auth/invalid-email": "L'email n'a pas un bon format",
  "auth/operation-not-allowed":
    "La connexion via email & mot de passe n'est pas activée",
  "auth/weak-password":
    "Le mot de passe est trop faible (moins de 6 caractères)",
  "auth/user-disabled": "Le compte lié à cet email est désactivé",
  "auth/user-not-found": "Le compte lié à cet email n'existe pas",
  "auth/wrong-password": "Le mot de passe ne correspond pas à ce compte",
};

export function translateErrorCode(errorCode) {
  if (errorsTranslations[errorCode]) {
    return errorsTranslations[errorCode];
  } else {
    return `Erreur inconnue au sein de Firebase. (${errorCode})`;
  }
}
