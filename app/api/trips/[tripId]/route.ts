import { NextResponse, NextRequest } from 'next/server';
import admin from '@/lib/firebase-admin';
import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/trip.model';

export async function GET(request: NextRequest, { params }: { params: { tripId: string } }) {
  try {
    const { tripId } = await params;
    
    // Verify user token
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await dbConnect();
    
    const trip = await Trip.findById(tripId).populate('user');
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Ensure the trip belongs to the authenticated user
    if (trip.user.uid !== uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ trip }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}