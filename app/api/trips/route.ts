import dbConnect from '@/lib/dbConnect';
import admin from '@/lib/firebase-admin';
import Trip from '@/models/trip.model';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { itinerary } = await request.json();

    if (!itinerary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ uid: uid });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create a new Trip document
    const newTrip = new Trip({
      user: user._id,
      ...itinerary,
    });

    await newTrip.save();

    // Add the new trip's ID to the user's savedTrips array
    user.savedTrips.push(newTrip._id);
    await user.save();

    return NextResponse.json({ message: 'Trip saved successfully', trip: newTrip }, { status: 201 });

  } catch (error) {
    console.error('Failed to save trip:', error);
    return NextResponse.json({ error: 'Failed to save trip' }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await dbConnect();

    const user = await User.findOne({ uid: uid }).populate({
      path: 'savedTrips',
      model: Trip,
      options: { sort: { createdAt: -1 } }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ savedTrips: user.savedTrips }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch saved trips:', error);
    return NextResponse.json({ error: 'Authentication failed or server error' }, { status: 500 });
  }
}