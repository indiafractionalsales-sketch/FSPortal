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

    const data = userDoc.data() || {};
    const userType = data.userType;

    let publicData = {
      fullName: null,
      photoURL: null,
      title: null,
      companyName: null,
      location: null,
      about: null,
      userType: userType
    };

    if (userType === 'sp' && data.spData) {
      publicData = {
        ...publicData,
        fullName: data.spData.fullName || null,
        photoURL: data.spData.profilePhoto || null,
        title: data.spData.jobTitle || 'Sales Partner',
        companyName: data.spData.companyName || null,
        location: [data.spData.city, data.spData.country].filter(Boolean).join(', ') || null,
        about: data.spData.notes || data.spData.industryExperience || null,
      };
    } else if (userType === 'obo' && data.oboData) {
      publicData = {
        ...publicData,
        fullName: data.oboData.brandName || data.oboData.legalName || 'Business Owner',
        photoURL: data.oboData.logo || null,
        title: 'Business Owner',
        companyName: data.oboData.legalName || null,
        location: data.oboData.country || null,
        about: data.oboData.website ? `Website: ${data.oboData.website}` : null,
      };
    } else if (userType === 'tpsp' && data.tpspData) {
      publicData = {
        ...publicData,
        fullName: data.tpspData.companyName || 'Service Provider',
        photoURL: data.tpspData.logo || null,
        title: 'Third Party Service Provider',
        companyName: data.tpspData.companyName || null,
        location: data.tpspData.country || null,
        about: data.tpspData.services || null,
      };
    } else {
      // Fallback if data is malformed
      publicData.fullName = "Unknown User";
    }

    return NextResponse.json(publicData);

  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
