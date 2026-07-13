import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  
  // Login as a test user
  const loginRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com', // Let's try to sign up or use an existing test account
      password: 'password123',
      returnSecureToken: true
    })
  });
  
  const loginData = await loginRes.json();
  if (!loginData.idToken) {
    // If sign in fails, let's try to sign up
    const signupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test2@example.com',
        password: 'password123',
        returnSecureToken: true
      })
    });
    const signupData = await signupRes.json();
    if (!signupData.idToken) {
      console.error("Auth failed:", signupData);
      return;
    }
    await testList(signupData.idToken, signupData.localId);
  } else {
    await testList(loginData.idToken, loginData.localId);
  }
}

async function testList(idToken, uid) {
  console.log("Got ID token for UID:", uid);
  const PROJECT_ID = "fractional-sales-4436e";
  
  // 1. Test regular list
  console.log("\nTesting List Invoices:");
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/users/${uid}/Invoices`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${idToken}` } });
  console.log("Status:", res.status);
  console.log("Body:", await res.json());

  // 2. Test runQuery
  console.log("\nTesting runQuery Invoices:");
  const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents:runQuery`;
  const queryRes = await fetch(queryUrl, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: `projects/${PROJECT_ID}/databases/default/documents/users/${uid}`,
      structuredQuery: {
        from: [{ collectionId: "Invoices" }]
      }
    })
  });
  console.log("Status:", queryRes.status);
  console.log("Body:", await queryRes.json());
}

run();
