'use client';

import { CalendarDaysIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import TripMap from './TripMap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import api from '@/lib/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TravelAgencies from './TravelAgencies';
import BookingSimulation from './BookingSimulation';

interface ItineraryDisplayProps {
  itineraryData: Itinerary;
  sourceLocation?: string;
  destination?: string;
}

export default function ItineraryDisplay({ itineraryData, sourceLocation, destination }: ItineraryDisplayProps) {

  const { i18n } = useTranslation();
  const [currentItinerary, setCurrentItinerary] = useState(itineraryData);
  const [adjustment, setAdjustment] = useState('');
  const [isAdjusting, setIsAdjusting] = useState<number | null>(null);

  const handleAdjustDay = async (dayPlan: Itinerary['itinerary'][0]) => {
    setIsAdjusting(dayPlan.day);
    try {
      const response = await api.post('/api/adjust-day', {
        originalDayPlan: dayPlan,
        adjustmentPrompt: adjustment,
        language: i18n.language,
      });

      // Update the itinerary state with the new activities for the specific day
      setCurrentItinerary(prev => ({
        ...prev,
        itinerary: prev.itinerary.map(day => 
          day.day === dayPlan.day 
            ? { ...day, activities: response.data.revisedActivities } 
            : day
        )
      }));

    } catch (error) {
      console.error("Failed to adjust itinerary", error);
    } finally {
      setIsAdjusting(null);
      setAdjustment('');
    }
  };

  return (
    <div className="space-y-6">
        <TripMap 
        itineraryData={itineraryData}
        sourceLocation={sourceLocation}
        destination={destination}
        />

        <BookingSimulation itineraryData={itineraryData} />

        <TravelAgencies destination={destination} />
        
      {currentItinerary.itinerary.map((day) => (
        <div key={day.day} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg flex items-center">
              <CalendarDaysIcon className="h-6 w-6 mr-2 text-cyan-400" />
              Day {day.day}: {day.title}
            </h3>
            
            {/* Smart Adjust Button & Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 cursor-pointer">
                  <SparklesIcon className="h-4 w-4 mr-1" /> Adjust
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-slate-50">
                <DialogHeader>
                  <DialogTitle>Smart Adjust Day {day.day}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input 
                    placeholder="e.g., It's raining, or Museum is closed" 
                    value={adjustment}
                    onChange={(e) => setAdjustment(e.target.value)}
                  />
                  <Button onClick={() => handleAdjustDay(day)} disabled={isAdjusting === day.day} className="w-full cursor-pointer">
                    {isAdjusting === day.day ? 'Adjusting...' : 'Update Plan'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ul className="space-y-2 pl-4">
            {isAdjusting === day.day ? (
              <li className="text-slate-400 animate-pulse">Generating new activities...</li>
            ) : (
              day.activities.map((activity, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-300">{activity}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}