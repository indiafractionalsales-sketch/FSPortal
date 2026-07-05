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

    const userData = userDoc.data() || {};
    const role = userData.role;

    let profileDoc;
    let data: any = {};

    if (role === 'sp') {
      profileDoc = await adminDb.collection('SP_Profile').doc(targetUid).get();
    } else if (role === 'obo') {
      profileDoc = await adminDb.collection('OBO_Profile').doc(targetUid).get();
    } else if (role === 'tpsp') {
      profileDoc = await adminDb.collection('TPSP_Profile').doc(targetUid).get();
    }

    if (profileDoc && profileDoc.exists) {
      data = profileDoc.data() || {};
    }

    let publicData = {
      fullName: null,
      photoURL: null,
      title: null,
      companyName: null,
      location: null,
      about: null,
      userType: role
    };

    if (role === 'sp') {
      publicData = {
        ...publicData,
        fullName: data.fullName || null,
        photoURL: data.profilePhoto || null,
        title: data.jobTitle || 'Sales Partner',
        companyName: data.companyName || null,
        location: [data.city, data.country].filter(Boolean).join(', ') || null,
        about: data.notes || data.industryExperience || null,
      };
    } else if (role === 'obo') {
      publicData = {
        ...publicData,
        fullName: data.brandName || data.legalName || 'Business Owner',
        photoURL: data.logo || null,
        title: 'Business Owner',
        companyName: data.legalName || null,
        location: data.country || null,
        about: data.website ? `Website: ${data.website}` : null,
      };
    } else if (role === 'tpsp') {
      publicData = {
        ...publicData,
        fullName: data.companyName || 'Service Provider',
        photoURL: data.logo || null,
        title: 'Third Party Service Provider',
        companyName: data.companyName || null,
        location: data.country || null,
        about: data.services || null,
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
