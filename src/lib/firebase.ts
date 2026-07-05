import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAUreCKl5BY4VBHJdc_ax6hfazSpLedq0",
  authDomain: "fractional-sales-4436e.firebaseapp.com",
  projectId: "fractional-sales-4436e",
  storageBucket: "fractional-sales-4436e.firebasestorage.app",
  messagingSenderId: "65179773854",
  appId: "1:65179773854:web:493dacf63eb48e8f16c48f",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, googleProvider, storage };
