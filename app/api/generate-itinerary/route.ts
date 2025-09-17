import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';
import { convertCurrency, getDestinationCurrency } from '@/lib/currency';

// Define the schema for input validation on the backend
const ItineraryRequestSchema = z.object({
  destination: z.string().min(1, { message: "Destination is required." }),
  sourceLocation: z.string().optional(),
  duration: z.coerce.number().min(1),
  budget: z.coerce.number().min(1),
  currency: z.string(),
  interests: z.string().min(1),
  tripType: z.enum(['solo', 'family', 'group']),
  members: z.coerce.number().optional(),
});

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate the incoming request body with Zod
    const validation = ItineraryRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error("Zod Validation Failed:", validation.error.flatten());
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { destination, duration, budget, interests, sourceLocation, tripType, members, currency } = validation.data;

    let convertedBudget = null;
    let destinationCurrency = await getDestinationCurrency(destination);

    if (destinationCurrency) {
      convertedBudget = await convertCurrency(budget, currency, destinationCurrency);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert travel planner, TripGenie. A user wants to plan a trip to ${destination} from ${sourceLocation || 'an unspecified location'}.
    Here are their preferences:
    - Trip Type: ${tripType} trip ${tripType !== 'solo' ? `for ${members} people` : ''}
    - Trip Duration: ${duration} days
    - Total Budget: Approximately ${budget} ${currency} for the entire group of ${members || 1}.
    ${convertedBudget ? `- Destination Local Currency Equivalent: Approximately ${convertedBudget} ${destinationCurrency} for the entire group.` : ''}
    - Main Interests: ${interests}

    Generate a detailed day-by-day itinerary with activities suitable for this trip type (e.g., kid-friendly for family, nightlife for group).
    Crucially, you must provide a cost estimation and budget assessment.
    **IMPORTANT: The 'estimatedCost' and 'budgetAssessment' MUST be for the TOTAL number of members (${members || 1}), NOT per person.**

    The response MUST be a valid JSON object following this exact structure:
    {
      "tripName": "A descriptive name for the trip",
      "estimatedCost": {
        "travel": "A cost range in ${destinationCurrency || currency} (e.g., 50,000 - 70,000)",
        "accommodation": "A cost range in ${destinationCurrency || currency}",
        "food": "A cost range in ${destinationCurrency || currency}",
        "activities": "A cost range in ${destinationCurrency || currency}",
        "other": "A cost range in ${destinationCurrency || currency}",
        "total": "A total estimated cost range in ${destinationCurrency || currency}"
      },
      "budgetAssessment": "A brief analysis of their budget. For example: 'This budget is well-suited for a comfortable trip, allowing for a mix of experiences. To save more, consider hostels or street food.' or 'This budget is tight; prioritize free activities and public transport.'",
      "itinerary": [
        { "day": 1, "title": "...", "activities": ["...", "..."] }
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