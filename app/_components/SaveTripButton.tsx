'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function SaveTripButton({ itinerary }: { itinerary: Itinerary }) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveTrip = async () => {
    if (!itinerary || !user) return;
    setIsSaving(true);
    setError(null);

    try {
      await axios.post('/api/trips', {
        itinerary,
        uid: user.uid,
      });
      setIsSaved(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save trip.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null; 
  }
  
  if (error) {
    return <p className="text-xs text-red-400">Error saving trip.</p>
  }

  return (
    <Button 
      onClick={handleSaveTrip} 
      disabled={isSaving || isSaved}
      size="sm"
      className='cursor-pointer'
    >
      {isSaved ? 'Saved!' : (isSaving ? 'Saving...' : 'Save Trip')}
    </Button>
  );
}