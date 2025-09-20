'use client';

import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import api from '@/lib/axios';
import Directions from './Directions';

interface Coordinates {
  name: string;
  lat: number;
  lng: number;
}

export default function TripMap({ itineraryData, sourceLocation, destination }: { itineraryData: Itinerary, sourceLocation?: string, destination?: string }) {
  const [coords, setCoords] = useState<Coordinates[]>([]);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {

      if(!destination) {
        setLoading(false);
        return;
      }

      const activityLocations = itineraryData.itinerary.flatMap(day => 
        day.activities.map(activity => {
          const isSpecific = activity.toLowerCase().includes(destination.split(',')[0].toLowerCase());
          return isSpecific ? activity : `${activity}, ${destination}`;
        })
      );

      const allLocations = [
        ...(sourceLocation ? [sourceLocation] : []), // Add source if it exists
        ...activityLocations
      ];

      if (allLocations.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.post('/api/geocode', { locations: allLocations });
        if (response.data.coordinates.length > 0) {
          setCoords(response.data.coordinates);
          setCenter(response.data.coordinates[0]); // Center map on the first activity
        }
      } catch (error) {
        console.error("Failed to fetch coordinates", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [itineraryData, sourceLocation, destination]);

  if (loading) {
    return <div className="h-96 w-full bg-slate-800 rounded-lg animate-pulse" />;
  }

  const path = coords.map(c => ({ lat: c.lat, lng: c.lng }));

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          defaultCenter={center}
          defaultZoom={10}
          mapId="TRIPGENIE_MAP"
        >
          {coords.map((coord, index) => (
            <AdvancedMarker key={index} position={coord} title={coord.name} />
          ))}

          {path.length > 0 && <Directions path={path} />}

        </Map>
      </APIProvider>
    </div>
  );
}