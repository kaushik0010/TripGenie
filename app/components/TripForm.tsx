'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SparklesIcon, PaperAirplaneIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { tripSchema, TripSchemaType } from '@/lib/validators';

// Types for API responses
type DestinationSuggestion = {
  destination: string;
  reason: string;
};

type Itinerary = {
  tripName: string;
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
};

export default function TripForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const form = useForm<TripSchemaType>({
    resolver: zodResolver(tripSchema) as any,
    defaultValues: {
      destination: '',
      duration: 7,
      budget: 1500,
      interests: 'Exploring ancient ruins, trying street food, and relaxing on scenic beaches.',
    },
  });

  const onSubmit: SubmitHandler<TripSchemaType> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setItinerary(null);

    try {
      if (!data.destination) {
        // AI Suggestion Mode
        const { data: result } = await axios.post('/api/suggest-destinations', data);
        setSuggestions(result.suggestions);
      } else {
        // Itinerary Generation Mode
        const { data: result } = await axios.post('/api/generate-itinerary', data);
        setItinerary(result);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (destination: string) => {
    form.setValue('destination', destination);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="w-full max-w-2xl">
      <Card className="bg-slate-800/50 border-slate-700 text-slate-50">
        <CardHeader>
          <CardTitle>Plan Your Next Adventure</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Rome, Italy or leave blank for ideas"
                        {...field}
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-slate-700 border-slate-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget ($ USD)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-slate-700 border-slate-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you love to do..."
                        {...field}
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
                {isLoading ? (
                  'Thinking...'
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    {form.getValues('destination') ? 'Generate Itinerary' : 'Suggest Destinations'}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-8">
        {isLoading && (
          <Card className="bg-slate-800/50 border-slate-700 text-slate-50 text-center animate-pulse">
            <CardContent className="p-6">
              <p>🤖 Crafting your perfect trip...</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Card className="bg-red-900/50 border-red-700 text-red-300 text-center">
            <CardContent className="p-6">
              <p><strong>Error:</strong> {error}</p>
            </CardContent>
          </Card>
        )}
        {suggestions.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 text-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-cyan-400" /> AI Destination Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.destination)}
                  className="p-4 rounded-lg border border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <h3 className="font-bold flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" /> {suggestion.destination}
                  </h3>
                  <p className="text-sm text-slate-400">{suggestion.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {itinerary && (
          <Card className="bg-slate-800/50 border-slate-700 text-slate-50">
            <CardHeader>
              <CardTitle>{itinerary.tripName}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm bg-slate-900/50 p-4 rounded-md">
                {JSON.stringify(itinerary, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
