import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set in environment variables');
    }

    // Parse the JSON string from the environment variable
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

// Export the initialized firestore database instance
const adminDb = admin.apps.length ? admin.firestore() : null;
export { adminDb, admin };
