async function test() {
  const projectId = 'fractional-sales-4436e';
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/Posts/dummy/Comments`);
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
