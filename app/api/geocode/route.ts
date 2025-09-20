import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { locations } = await request.json();

    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json({ error: 'Locations are required' }, { status: 400 });
    }
    
    const geocodingPromises = locations.map(location => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      return axios.get(url);
    });

    const responses = await Promise.all(geocodingPromises);

    const coordinates = responses.map((response, index) => {
      const { results } = response.data;
      if (results && results.length > 0) {
        return {
          name: locations[index],
          ...results[0].geometry.location, // { lat, lng }
        };
      }
      return null;
    }).filter(Boolean); // Filter out any null results

    return NextResponse.json({ coordinates }, { status: 200 });

  } catch (error) {
    console.error('Geocoding failed:', error);
    return NextResponse.json({ error: 'Failed to geocode locations' }, { status: 500 });
  }
}