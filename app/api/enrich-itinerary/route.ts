import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';

// Define a detailed schema for the itinerary object to ensure data integrity
const ItinerarySchema = z.object({
  tripName: z.string(),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      activities: z.array(z.string()),
    })
  ),
});

// Schema for the incoming request body
const EnrichRequestSchema = z.object({
  interests: z.string().min(10),
  itinerary: ItinerarySchema,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = EnrichRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { interests, itinerary } = validation.data;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a local travel expert. A traveler has the following itinerary planned for ${itinerary.tripName}:
    ---
    ITINERARY CONTEXT:
    ${JSON.stringify(itinerary.itinerary, null, 2)}
    ---
    The traveler's main interests are: ${interests}.

    Based on their interests and the existing plan, suggest 3 to 5 "hidden gems" or "off-the-beaten-path" activities or places they could visit.
    These suggestions should NOT be duplicates of activities already mentioned in their itinerary.
    For each suggestion, provide a name and a brief, compelling reason.

    The response MUST be a valid JSON object following this structure:
    {
      "suggestions": [
        {
          "name": "Name of the place or activity",
          "reason": "A brief explanation of why this fits their interests."
        }
      ]
    }
    Ensure the JSON is well-formed. Do not include any text, markdown, or formatting outside of the main JSON object.`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const enrichmentJson = JSON.parse(cleanedJsonString);

    return NextResponse.json(enrichmentJson, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to enrich itinerary.' }, { status: 500 });
  }
}