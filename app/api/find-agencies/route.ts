import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=travel%20agencies%20in%20${encodeURIComponent(destination)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    
    // We'll simplify the response to only what we need
    const agencies = response.data.results.map((place: any) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
    }));

    return NextResponse.json({ agencies }, { status: 200 });

  } catch (error) {
    console.error('Failed to find agencies:', error);
    return NextResponse.json({ error: 'Failed to find agencies' }, { status: 500 });
  }
}