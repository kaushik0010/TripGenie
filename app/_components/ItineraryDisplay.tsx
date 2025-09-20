import { CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import TripMap from './TripMap';

interface ItineraryDisplayProps {
  itineraryData: Itinerary;
  sourceLocation?: string;
  destination?: string;
}

export default function ItineraryDisplay({ itineraryData, sourceLocation, destination }: ItineraryDisplayProps) {
  return (
    <div className="space-y-6">
        <TripMap 
        itineraryData={itineraryData}
        sourceLocation={sourceLocation}
        destination={destination}
        />
        
      {itineraryData.itinerary.map((day) => (
        <div key={day.day} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
          <h3 className="font-bold text-lg flex items-center mb-2">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-cyan-400" />
            Day {day.day}: {day.title}
          </h3>
          <ul className="space-y-2 pl-4">
            {day.activities.map((activity, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-slate-300">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}