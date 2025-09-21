'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ItineraryDisplay from '@/app/_components/ItineraryDisplay';

export default function TripDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const { tripId } = params;
  
  const [trip, setTrip] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!user || !tripId) return;

      try {
        const token = await user.getIdToken();
        const response = await axios.get(`/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrip(response.data.trip);
      } catch (err) {
        setError('Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [user, tripId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-slate-800/50 rounded-lg"></div>
            <div className="h-64 bg-slate-800/50 rounded-lg"></div>
            <div className="h-48 bg-slate-800/50 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center p-10 bg-red-900/20 border border-red-700/30 rounded-lg text-red-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">Unable to load trip</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center p-10 bg-slate-800/30 rounded-lg border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Trip not found</p>
          <p className="text-slate-400 mt-2">The trip you're looking for doesn't exist or may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-slate-50 bg-clip-text text-transparent mb-2">
          Trip Details
        </h1>
        {trip.sourceLocation && trip.destination && (
          <p className="text-slate-400">
            {trip.sourceLocation} → {trip.destination}
          </p>
        )}
      </div>
      <ItineraryDisplay 
        itineraryData={trip} 
        sourceLocation={trip.sourceLocation}
        destination={trip.destination}
      />
    </main>
  );
}