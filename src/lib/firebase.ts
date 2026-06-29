import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCgsX-X3l8yZiVrkI6C3t4vo5RXt2f-cus",
  authDomain: "studio-5489234154-a618d.firebaseapp.com",
  projectId: "studio-5489234154-a618d",
  storageBucket: "studio-5489234154-a618d.firebasestorage.app",
  messagingSenderId: "985695796084",
  appId: "1:985695796084:web:6b26206a0421ae6b664a21",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
