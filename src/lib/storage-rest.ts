/**
 * Firebase Storage REST API helper.
 *
 * Uploads images directly to Firebase Storage via HTTPS fetch.
 * Returns a permanent public download URL.
 * The URL (not base64) is what gets saved in Firestore.
 */

const BUCKET = "fractional-sales-4436e.firebasestorage.app";

/**
 * Upload a base64 data-URL image to Firebase Storage.
 * @param dataUrl  - The base64 image string (e.g., from FileReader or canvas)
 * @param path     - Storage path, e.g. "profiles/{uid}/avatar.jpg"
 * @param idToken  - Firebase Auth ID token for authentication
 * @returns        - The public download URL to store in Firestore
 */
export async function uploadImage(
  dataUrl: string,
  path: string,
  idToken: string
): Promise<string> {
  // Convert base64 data URL → Blob
  const fetchRes = await fetch(dataUrl);
  const blob = await fetchRes.blob();
  const contentType = blob.type || "image/jpeg";

  // Firebase Storage REST upload endpoint
  const encodedPath = encodeURIComponent(path);
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?name=${encodedPath}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": contentType,
    },
    body: blob,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Storage upload failed (${res.status})`
    );
  }

  const data = await res.json();
  const token = data.downloadTokens as string;

  // Construct the permanent download URL
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedPath}?alt=media&token=${token}`;
}
