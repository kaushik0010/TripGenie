'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ITrip } from '@/models/trip.model';

export default function MyTripsPage() {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const response = await axios.get('/api/trips',{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setTrips(response.data.savedTrips);
      } catch (err) {
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchTrips();
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-700 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-800/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center p-10 bg-slate-800/30 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-slate-400">Please sign in to see your saved trips.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center p-10 bg-red-900/20 border border-red-700/30 rounded-lg text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-slate-50 bg-clip-text text-transparent">My Saved Trips</h1>
        <p className="text-slate-400">Your personalized travel experiences</p>
      </div>
      
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link key={trip._id.toString()} href={`/my-trips/${trip._id.toString()}`}>
              <Card className="bg-slate-800/40 border-slate-700 text-slate-50 hover:border-cyan-500 transition-all duration-300 h-full hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group">
                <CardHeader className="h-full flex flex-col justify-between">
                  <div>
                    <CardTitle className="text-xl group-hover:text-cyan-400 transition-colors line-clamp-2 mb-3">
                      {trip.tripName}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-400 text-sm mt-auto">
                    Saved on: {new Date(trip.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/30">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No trips saved yet!</h2>
          <p className="text-slate-400 mb-4">
            Start planning your next adventure to see it here.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors"
          >
            Plan a Trip
          </Link>
        </div>
      )}
    </main>
  );
}