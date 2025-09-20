'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';

export default function BookingSimulation({ itineraryData }: { itineraryData: Itinerary }) {
    const { user } = useAuth()
  const [showConfirmation, setShowConfirmation] = useState(false);

  if(!user) {
    return null;
  }

  if (showConfirmation) {
    return (
      <div className="p-6 text-center bg-green-900/50 text-green-300 rounded-xl border border-green-700">
        <h3 className="text-xl font-bold">✅ Booking Confirmed!</h3>
        <p className="mt-2 text-sm">Your trip to {itineraryData.tripName.split('of ').pop()} has been booked. A confirmation has been sent to your email.</p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
          Proceed to Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle>Confirm Your Booking</DialogTitle>
          <DialogDescription>
            You will be redirected to our trusted partner, EaseMyTrip, to complete your payment securely.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <p><strong>Trip:</strong> {itineraryData.tripName}</p>
          <p><strong>Total Estimated Cost:</strong> {itineraryData.estimatedCost.total}</p>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => setShowConfirmation(true)}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            Confirm & Proceed to Pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}