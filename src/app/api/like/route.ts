import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const { postId, action } = await request.json();

    if (!postId || !action) {
      return NextResponse.json({ error: 'Missing postId or action' }, { status: 400 });
    }

    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json({ error: 'Invalid action. Must be "like" or "unlike"' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const postRef = adminDb.collection('Posts').doc(postId);

    if (action === 'like') {
      await postRef.update({
        likedBy: admin.firestore.FieldValue.arrayUnion(uid)
      });
    } else {
      await postRef.update({
        likedBy: admin.firestore.FieldValue.arrayRemove(uid)
      });
    }

    return NextResponse.json({ success: true, action });

  } catch (error: any) {
    console.error('Like action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
