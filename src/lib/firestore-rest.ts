/**
 * Firestore REST API helpers.
 *
 * Replaces the Firebase Firestore SDK for all read/write operations.
 * Uses plain HTTPS fetch instead of WebSocket/gRPC, which resolves
 * "client is offline" errors in restricted network environments.
 */

const PROJECT_ID = "fractional-sales-4436e";

// Helper to construct the dynamic base URL
const getBaseUrl = (databaseId: string = "default") => 
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${databaseId}/documents`;

// ─── Type Conversion: JS → Firestore REST format ────────────────────────────

type FsValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FsValue> } }
  | { arrayValue: { values: FsValue[] } };

function toFsValue(value: unknown): FsValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (typeof value === "string") return { stringValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFsValue) } };
  }
  if (typeof value === "object") {
    const fields: Record<string, FsValue> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields[k] = toFsValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toFsDoc(data: Record<string, unknown>) {
  const fields: Record<string, FsValue> = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFsValue(v);
  }
  return { fields };
}

// ─── Type Conversion: Firestore REST format → JS ────────────────────────────

function fromFsValue(value: FsValue): unknown {
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return parseInt(value.integerValue as string, 10);
  if ("doubleValue" in value) return value.doubleValue;
  if ("stringValue" in value) return value.stringValue;
  if ("arrayValue" in value) {
    const arr = (value as { arrayValue: { values?: FsValue[] } }).arrayValue;
    return arr.values?.map(fromFsValue) ?? [];
  }
  if ("mapValue" in value) {
    const map = (value as { mapValue: { fields?: Record<string, FsValue> } }).mapValue;
    return fromFsDoc(map);
  }
  return null;
}

function fromFsDoc(doc: { fields?: Record<string, FsValue> }): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields ?? {})) {
    result[k] = fromFsValue(v);
  }
  return result;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Save (create or overwrite) a Firestore document via REST API.
 * Equivalent to SDK's setDoc().
 */
export async function saveDocument(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
  idToken: string,
  databaseId: string = "default"
): Promise<void> {
  const url = `${getBaseUrl(databaseId)}/${collection}/${docId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toFsDoc(data)),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Firestore save failed (${res.status})`
    );
  }
}

/**
 * Fetch a Firestore document via REST API.
 * Equivalent to SDK's getDoc().
 * Returns null if the document doesn't exist.
 */
export async function getDocument(
  collection: string,
  docId: string,
  idToken: string,
  databaseId: string = "default"
): Promise<Record<string, unknown> | null> {
  const url = `${getBaseUrl(databaseId)}/${collection}/${docId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Firestore fetch failed (${res.status})`
    );
  }

  const doc = await res.json();
  if (!doc.fields) return null;
  return fromFsDoc(doc);
}

/**
 * Query a Firestore collection via REST API with ordering and cursor-based pagination.
 * Equivalent to SDK's query() + startAfter() + limit().
 * Returns an array of plain JS objects plus the raw last document for use as next cursor.
 */
export async function queryCollection(
  collection: string,
  idToken: string,
  options: {
    orderByField?: string;
    orderDirection?: "ASCENDING" | "DESCENDING";
    limit?: number;
    startAfterDoc?: Record<string, unknown> | null;
    where?: { field: string; op: "EQUAL"; value: any }[];
    databaseId?: string;
  } = {}
): Promise<{ docs: Record<string, unknown>[]; lastDoc: Record<string, unknown> | null }> {
  const {
    orderByField = "createdAt",
    orderDirection = "DESCENDING",
    limit = 10,
    startAfterDoc = null,
    where = [],
    databaseId = "default",
  } = options;

  const url = `${getBaseUrl(databaseId)}:runQuery`;

  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId: collection }],
    orderBy: [{ field: { fieldPath: orderByField }, direction: orderDirection }],
    limit,
  };

  if (where.length > 0) {
    structuredQuery.where = {
      compositeFilter: {
        op: "AND",
        filters: where.map(w => ({
          fieldFilter: {
            field: { fieldPath: w.field },
            op: w.op,
            value: toFsValue(w.value)
          }
        }))
      }
    };
  }

  // Cursor pagination: startAfter the last document's value for the order field
  if (startAfterDoc && startAfterDoc[orderByField] !== undefined) {
    structuredQuery.startAt = {
      values: [toFsValue(startAfterDoc[orderByField])],
      before: false, // startAfter semantics
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ structuredQuery }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Firestore query failed (${res.status})`);
  }

  const results = await res.json();

  const docs: Record<string, unknown>[] = [];
  for (const result of results) {
    if (result.document?.fields) {
      const data = fromFsDoc(result.document);
      // Attach the document name/path as __id for reference
      const nameParts = (result.document.name as string).split("/");
      data.__id = nameParts[nameParts.length - 1];
      docs.push(data);
    }
  }

  const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
  return { docs, lastDoc };
}
