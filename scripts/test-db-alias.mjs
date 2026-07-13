import fetch from 'node-fetch';
import admin from 'firebase-admin';

// Initialize firebase admin to get a valid custom token or ID token
// (We will simulate an ID token if possible, or just look at the raw error without auth)
async function run() {
  const PROJECT_ID = "fractional-sales-4436e";
  
  console.log("Testing with database ID: 'default'");
  let url1 = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/users/123/Invoices`;
  let res1 = await fetch(url1);
  console.log("default HTTP status:", res1.status);
  console.log("default Body:", await res1.json());
  
  console.log("\nTesting with database ID: '(default)'");
  let url2 = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/123/Invoices`;
  let res2 = await fetch(url2);
  console.log("(default) HTTP status:", res2.status);
  console.log("(default) Body:", await res2.json());
}

run();
