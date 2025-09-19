import dbConnect from '@/lib/dbConnect';
import Trip from '@/models/trip.model';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { itinerary, uid } = await request.json();

    if (!itinerary || !uid) {
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