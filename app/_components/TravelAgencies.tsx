'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { BuildingStorefrontIcon, StarIcon } from '@heroicons/react/24/solid';

interface Agency {
  name: string;
  address: string;
  rating: number;
  user_ratings_total: number;
}

export default function TravelAgencies({ destination }: { destination?: string }) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) {
      setLoading(false);
      return;
    }

    const fetchAgencies = async () => {
      try {
        const response = await api.get(`/api/find-agencies?destination=${destination}`);
        setAgencies(response.data.agencies);
      } catch (error) {
        console.error("Failed to fetch agencies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, [destination]);

  if (loading) {
    return <div className="p-4 text-center text-slate-400">Searching for local agencies...</div>;
  }

  if (agencies.length === 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
      <h3 className="font-bold text-lg flex items-center mb-3">
        <BuildingStorefrontIcon className="h-6 w-6 mr-2 text-cyan-400" />
        Local Tour & Travel Agencies in {destination?.split(',')[0]}
      </h3>
      <div className="space-y-3">
        {agencies.slice(0, 5).map((agency, index) => ( // Show top 5 results
          <div key={index} className="p-3 rounded-lg bg-slate-800/70">
            <p className="font-bold">{agency.name}</p>
            <p className="text-sm text-slate-400">{agency.address}</p>
            {agency.rating && (
              <div className="flex items-center text-sm mt-1">
                <StarIcon className="h-4 w-4 mr-1 text-amber-400" />
                <span>{agency.rating} ({agency.user_ratings_total} reviews)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}