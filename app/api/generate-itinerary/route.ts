import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';

// Define the schema for input validation on the backend
const ItineraryRequestSchema = z.object({
    destination: z.string().min(1, { message: "Destination is required." }),
    duration: z.coerce.number().min(1),
    budget: z.coerce.number().min(1),
    interests: z.string().min(1),
});

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate the incoming request body with Zod
        const validation = ItineraryRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { destination, duration, budget, interests } = validation.data;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are an expert travel planner named TripGenie.
    A user wants to plan a trip. Here are their preferences:
    - Destination: ${destination}
    - Trip Duration: ${duration} days
    - Budget: Approximately ${budget} USD per person
    - Main Interests: ${interests}

    Please generate a detailed day-by-day itinerary for this trip.
    The response MUST be a valid JSON object following this structure:
    {
      "tripName": "A descriptive name for the trip, like 'Cultural Tour of Kyoto'",
      "itinerary": [
        {
          "day": 1,
          "title": "Arrival and First Impressions",
          "activities": [
            "Arrive at the airport and transfer to the hotel.",
            "Take a short walk around the local area.",
            "Enjoy a welcome dinner at a traditional restaurant."
          ]
        }
      ]
    }
    Ensure the JSON is well-formed. Do not include any text, markdown, or formatting outside of the main JSON object.`;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        // Clean the response to ensure it's valid JSON
        const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse the JSON string to an object
        const itineraryJson = JSON.parse(cleanedJsonString);

        return NextResponse.json(itineraryJson, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to generate itinerary. Please try again.' },
            { status: 500 }
        );
    }
}