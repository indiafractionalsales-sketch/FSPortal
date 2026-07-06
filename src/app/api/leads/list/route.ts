import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin, getUserDatabaseId, getDbForId } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const status = searchParams.get('status'); // optional filter

    // Route to the SP's country-specific database
    const dbId = await getUserDatabaseId(uid);
    const spDb = getDbForId(dbId) || adminDb;

    // Build query — always scoped to this SP
    let q = spDb.collection('Leads').where('capturedByUid', '==', uid);
    if (postId) q = q.where('postId', '==', postId);
    if (status) q = q.where('status', '==', status);
    q = q.orderBy('createdAt', 'desc');

    const snap = await q.get();
    const leads = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to plain objects for JSON serialization
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      processedAt: doc.data().processedAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ leads, databaseId: dbId });

  } catch (error: any) {
    console.error('Leads list error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch leads' }, { status: 500 });
  }
}
