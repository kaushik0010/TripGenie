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
    return <div className="text-center p-10">Loading your trips...</div>;
  }

  if (!user) {
    return <div className="text-center p-10">Please sign in to see your saved trips.</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-400">{error}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Saved Trips</h1>
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip._id.toString()} className="bg-slate-800/50 border-slate-700 text-slate-50 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <CardTitle>{trip.tripName}</CardTitle>
                <CardDescription>
                  Saved on: {new Date(trip.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 rounded-lg border-2 border-dashed border-slate-700">
          <h2 className="text-xl font-semibold">No trips saved yet!</h2>
          <p className="text-slate-400 mt-2">
            Go back to the <Link href="/" className="text-cyan-400 hover:underline">home page</Link> to plan your next adventure.
          </p>
        </div>
      )}
    </main>
  );
}