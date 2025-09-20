'use client';

import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface Coordinates {
  lat: number;
  lng: number;
}

export default function Directions({ path }: { path: Coordinates[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length === 0) return;

    // Create a new Polyline instance
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#06b6d4', // A nice cyan color
      strokeOpacity: 0.8,
      strokeWeight: 3,
    });

    // Add the Polyline to the map
    polyline.setMap(map);

    // Clean up the Polyline when the component unmounts
    return () => {
      polyline.setMap(null);
    };
  }, [map, path]);

  return null; // This component doesn't render anything itself
}