import { NextResponse } from 'next/server';
import { admin, adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUid = searchParams.get('uid');

    if (!targetUid) {
      return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token to ensure only authenticated users can view profiles
    const token = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(token);

    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const userDoc = await adminDb.collection('users').doc(targetUid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = userDoc.data();

    // STRICTLY return only public-facing fields to protect data privacy
    const publicData = {
      fullName: data?.fullName || null,
      photoURL: data?.photoURL || null,
      title: data?.title || null,
      companyName: data?.companyName || null,
      location: data?.location || null,
      about: data?.about || null,
    };

    return NextResponse.json(publicData);

  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
