import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
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

    const body = await req.json();
    const { postId, targetUid, rating, comment } = body;

    if (!postId || !targetUid || !rating) {
      return NextResponse.json({ error: 'postId, targetUid, and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Verify the user is the buyer of this post
    const postDoc = await adminDb.collection('Posts').doc(postId).get();
    if (!postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const postData = postDoc.data();
    if (postData?.paymentLockedBy !== uid && postData?.ownerUid !== uid) {
      return NextResponse.json({ error: 'Only deal participants can leave reviews' }, { status: 403 });
    }

    // Check if user already reviewed this post
    const existingReview = await adminDb.collection('Reviews')
      .where('postId', '==', postId)
      .where('reviewerUid', '==', uid)
      .limit(1)
      .get();

    if (!existingReview.empty) {
      return NextResponse.json({ error: 'You have already reviewed this deal' }, { status: 409 });
    }

    // Atomic transaction: save review + update target's average rating
    await adminDb.runTransaction(async (transaction) => {
      // Get the target user's current profile
      const targetUserRef = adminDb!.collection('users').doc(targetUid);
      const targetUserDoc = await transaction.get(targetUserRef);

      let currentAverage = 0;
      let currentTotal = 0;
      if (targetUserDoc.exists) {
        currentAverage = targetUserDoc.data()?.averageRating || 0;
        currentTotal = targetUserDoc.data()?.totalReviews || 0;
      }

      // Calculate new average
      const newTotal = currentTotal + 1;
      const newAverage = ((currentAverage * currentTotal) + rating) / newTotal;

      // Save the review
      const reviewRef = adminDb!.collection('Reviews').doc();
      transaction.set(reviewRef, {
        reviewerUid: uid,
        targetUid,
        postId,
        rating,
        comment: comment || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update target user's rating
      transaction.update(targetUserRef, {
        averageRating: Math.round(newAverage * 10) / 10,
        totalReviews: newTotal,
      });
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}

// GET: Fetch review for a specific post by the current user
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

    const postId = req.nextUrl.searchParams.get('postId');
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const reviewSnapshot = await adminDb.collection('Reviews')
      .where('postId', '==', postId)
      .where('reviewerUid', '==', uid)
      .limit(1)
      .get();

    if (reviewSnapshot.empty) {
      return NextResponse.json({ exists: false });
    }

    const reviewData = reviewSnapshot.docs[0].data();
    return NextResponse.json({
      exists: true,
      review: {
        id: reviewSnapshot.docs[0].id,
        ...reviewData,
        createdAt: reviewData.createdAt?.toDate?.()?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
