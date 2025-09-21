// Types for API responses

type DestinationSuggestion = {
  destination: string;
  reason: string;
};

type Itinerary = {
  tripName: string;
  sourceLocation?: string;
  destination?: string;
  estimatedCost: {
    travel: string;
    accommodation: string;
    food: string;
    activities: string;
    other: string;
    total: string;
  };
  budgetAssessment: string;
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
};