import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';
import { convertCurrency, getDestinationCurrency } from '@/lib/currency';
import { sanitizeInput } from '@/lib/sanitize';

// Define the schema for input validation on the backend
const ItineraryRequestSchema = z.object({
  destination: z.string().min(1, { message: "Destination is required." }),
  sourceLocation: z.string().optional(),
  duration: z.coerce.number().min(1),
  budget: z.coerce.number().min(1),
  currency: z.string(),
  startDate: z.string().datetime(),
  interests: z.string().min(1),
  tripType: z.enum(['solo', 'family', 'group']),
  members: z.coerce.number().optional(),
  language: z.string(),
});

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.destination) body.destination = sanitizeInput(body.destination);
    if (body.sourceLocation) body.sourceLocation = sanitizeInput(body.sourceLocation);
    if (body.currency) body.currency = sanitizeInput(body.currency);
    if (body.interests) body.interests = sanitizeInput(body.interests);
    if (body.startDate) body.startDate = sanitizeInput(body.startDate);

    // 1. Validate the incoming request body with Zod
    const validation = ItineraryRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error("Zod Validation Failed:", validation.error.flatten());
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { destination, duration, budget, interests, sourceLocation, tripType, members, currency, startDate, language } = validation.data;

    let convertedBudget = null;
    let destinationCurrency = await getDestinationCurrency(destination);

    if (destinationCurrency) {
      convertedBudget = await convertCurrency(budget, currency, destinationCurrency);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert travel planner, TripGenie, with deep local knowledge. A user wants to plan a trip to ${destination} from ${sourceLocation || 'an unspecified location'}.
    Here are their preferences:
    - Trip Start Date: ${new Date(startDate).toDateString()}
    - Trip Type: ${tripType} trip ${tripType !== 'solo' ? `for ${members} people` : ''}
    - Trip Duration: ${duration} days
    - Total Budget: Approximately ${budget} ${currency} for the entire group of ${members || 1}.
    ${convertedBudget ? `- Destination Local Currency Equivalent: Approximately ${convertedBudget} ${destinationCurrency} for the entire group.` : ''}
    - Main Interests: ${interests}

    Generate a detailed day-by-day itinerary with activities suitable for this trip type (e.g., kid-friendly for family, nightlife for group) in the following language: ${language}.
    **IMPORTANT: Act like a local expert and optimize the plan to avoid peak crowd times.**
    - If a day falls on a weekend (Saturday or Sunday), prioritize visiting popular, crowded attractions on the surrounding weekdays instead.
    - Suggest less crowded alternatives or "hidden gems" for the weekend days to ensure a more enjoyable experience.

    For the 'travel' section of the response, please follow these critical instructions:
    1.  **Prioritize Efficiency:** Find the most **time-efficient and direct route**, even if it involves local transport.
    2.  **Think Like a Local:** Do not just default to the most popular route through major hubs. Consider local buses, auto-rickshaws, ferry services, or smaller state highways that a local expert would recommend.
    3.  **Provide Options:** Briefly mention one or two transport options (e.g., "Take a local bus from Dighi to Borli Panchtan, then an auto-rickshaw to Diveagar.").

    Crucially, you must also provide a cost estimation and budget assessment.
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