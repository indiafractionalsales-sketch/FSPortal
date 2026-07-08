/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this file, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

export { auth, googleProvider, storage, db };
