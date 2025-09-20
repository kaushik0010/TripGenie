'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { isAxiosError } from 'axios';

import { format } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/solid";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SparklesIcon, PaperAirplaneIcon, MapPinIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import { tripSchema, TripSchemaType } from '@/lib/validators';
import SaveTripButton from './SaveTripButton';
import ItineraryDisplay from './ItineraryDisplay';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

type EnrichmentSuggestion = { name: string; reason: string; };

export default function TripForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);

  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [enrichments, setEnrichments] = useState<EnrichmentSuggestion[]>([]);

  const form = useForm<TripSchemaType>({
    resolver: zodResolver(tripSchema) as any,
    defaultValues: {
      destination: '',
      sourceLocation: 'Mumbai, India',
      tripType: 'solo',
      members: '1',
      duration: 7,
      budget: 1500,
      currency: 'INR',
      startDate: new Date(),
      interests: 'Exploring ancient ruins, trying street food, and relaxing on scenic beaches.',
    },
  });

  const tripType = form.watch('tripType');

  const onSubmit: SubmitHandler<TripSchemaType> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setItinerary(null);
    setEnrichments([]);

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

  const handleEnrichItinerary = async () => {
    if (!itinerary) return;
    setIsEnriching(true);
    setError(null);

    try {
      const response = await axios.post('/api/enrich-itinerary', {
        itinerary,
        tripType: form.getValues('tripType'),
        members: form.getValues('members'),
        interests: form.getValues('interests')
      });
      setEnrichments(response.data.suggestions);
    } catch (err: any) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || 'An API error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsEnriching(false);
    }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Location (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mumbai, India"
                          {...field}
                          className="bg-slate-700 border-slate-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Trip Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 text-white border-slate-700" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tripType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select a trip type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-50">
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Conditionally render the 'members' input */}
                {tripType !== 'solo' && (
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Members</FormLabel>
                        <FormControl>
                          <Input 
                          type="number" 
                          min="2" {...field} 
                          className="bg-slate-700 border-slate-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (days)</FormLabel>
                      <FormControl>
                        <Input 
                        type="number" {...field} 
                        className="bg-slate-700 border-slate-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Budget</FormLabel>
                          <FormControl>
                            <Input 
                            type="number" 
                            {...field} 
                            className="bg-slate-700 border-slate-600" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-50">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              <SaveTripButton itinerary={itinerary} />
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 rounded-lg border border-slate-700 bg-slate-900/50">
                <h3 className="text-lg font-semibold flex items-center mb-3"><BanknotesIcon className="h-6 w-6 mr-2 text-green-400" /> Budget Analysis</h3>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <p>Travel: <span className="font-medium text-slate-300">{itinerary.estimatedCost.travel}</span></p>
                  <p>Accommodation: <span className="font-medium text-slate-300">{itinerary.estimatedCost.accommodation}</span></p>
                  <p>Food: <span className="font-medium text-slate-300">{itinerary.estimatedCost.food}</span></p>
                  <p>Activities: <span className="font-medium text-slate-300">{itinerary.estimatedCost.activities}</span></p>
                </div>
                <p className="text-slate-400 text-sm p-3 bg-slate-800/70 rounded-md">
                  <strong>Assessment:</strong> {itinerary.budgetAssessment}
                </p>
              </div>

              <div className="space-y-6">
                <ItineraryDisplay 
                itineraryData={itinerary} 
                sourceLocation={form.getValues('sourceLocation')}
                destination={form.getValues('destination')}
                />
                <div className="pt-6 border-t border-slate-700">
                  {enrichments.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Local Gems & Hidden Spots</h3>
                      <div className="space-y-3">
                        {enrichments.map((item, index) => (<div key={index} className="p-3 rounded-lg bg-slate-900/50"><p className="font-bold">{item.name}</p><p className="text-sm text-slate-400">{item.reason}</p></div>))}
                      </div>
                    </div>
                  ) : (
                    <Button 
                    onClick={handleEnrichItinerary} 
                    disabled={isEnriching} 
                    variant="outline" 
                    className="w-full border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer">
                      {isEnriching ? 'Discovering...' : '✨ Find Hidden Gems'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
