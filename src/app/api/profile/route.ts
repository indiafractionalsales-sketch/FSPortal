import { NextResponse } from 'next/server';
import { admin, adminDb, getDbForId } from '@/lib/firebase-admin';

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
    const databaseId = userData.databaseId || 'default';

    console.log('>>> [API PROFILE] UID:', targetUid);
    console.log('>>> [API PROFILE] Role:', role);
    console.log('>>> [API PROFILE] Database ID:', databaseId);

    // Get the correct firestore database instance for this user
    const db = getDbForId(databaseId);
    if (!db) {
      console.error('>>> [API PROFILE] Failed to get Firestore db instance for:', databaseId);
      return NextResponse.json({ error: 'Failed to access user database' }, { status: 500 });
    }

    let profileDoc;
    let data: any = {};

    if (role === 'sp') {
      profileDoc = await db.collection('SP_Profile').doc(targetUid).get();
    } else if (role === 'obo') {
      profileDoc = await db.collection('OBO_Profile').doc(targetUid).get();
    } else if (role === 'tpsp') {
      profileDoc = await db.collection('TPSP_Profile').doc(targetUid).get();
    }

    if (profileDoc) {
      console.log('>>> [API PROFILE] Profile doc exists:', profileDoc.exists);
      if (profileDoc.exists) {
        data = profileDoc.data() || {};
        console.log('>>> [API PROFILE] Profile data keys:', Object.keys(data));
      }
    } else {
      console.log('>>> [API PROFILE] Profile doc was not fetched (invalid role)');
    }

    let publicData = {
      fullName: null,
      photoURL: null,
      banner: null,
      title: null,
      companyName: null,
      location: null,
      about: null,
      products: [],
      userType: role
    };

    if (role === 'sp') {
      publicData = {
        ...publicData,
        fullName: data.fullName || null,
        photoURL: data.profilePhoto || null,
        banner: data.banner || null,
        title: data.jobTitle || 'Sales Partner',
        companyName: data.companyName || null,
        location: [data.city, data.country].filter(Boolean).join(', ') || null,
        about: data.notes || data.industryExperience || null,
        products: data.products || [],
      };
    } else if (role === 'obo') {
      publicData = {
        ...publicData,
        fullName: data.brandName || data.legalName || 'Business Owner',
        photoURL: data.logo || null,
        banner: data.banner || null,
        title: 'Business Owner',
        companyName: data.legalName || null,
        location: data.country || null,
        about: data.website ? `Website: ${data.website}` : null,
        products: data.products || [],
      };
    } else if (role === 'tpsp') {
      publicData = {
        ...publicData,
        fullName: data.companyName || 'Service Provider',
        photoURL: data.logo || null,
        banner: data.banner || null,
        title: 'Third Party Service Provider',
        companyName: data.companyName || null,
        location: data.country || null,
        about: data.services || null,
        products: data.products || [],
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
