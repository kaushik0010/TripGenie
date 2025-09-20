import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';
import { sanitizeInput } from '@/lib/sanitize';

// Schema for backend validation
const SuggestionRequestSchema = z.object({
  sourceLocation: z.string().optional(),
  tripType: z.enum(['solo', 'family', 'group']),
  members: z.coerce.number().optional(),
  duration: z.number(),
  budget: z.number(),
  currency: z.string(),
  interests: z.string().min(10),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.sourceLocation) body.sourceLocation = sanitizeInput(body.sourceLocation);
    if (body.currency) body.currency = sanitizeInput(body.currency);
    if (body.interests) body.interests = sanitizeInput(body.interests);

    const validation = SuggestionRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { duration, budget, currency, interests, sourceLocation, tripType, members } = validation.data;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Based on the following travel preferences, suggest 5 potential destinations. The user's starting point is ${sourceLocation || 'not specified'}.
    - Trip Type: ${tripType} trip ${tripType !== 'solo' ? `for ${members} people` : ''}
    - Trip Duration: ${duration} days
    - Total Budget: Approximately ${budget} ${currency} for the entire group of ${members || 1}
    - Main Interests: ${interests}

    Provide a diverse list of suggestions suitable for their budget and trip type. Include a mix of:
    1. A "hidden gem" or a nearby location relative to their starting point.
    2. A popular destination within their country.
    3. Suitable international locations.

    For each destination, provide a short, compelling reason why it's a good fit.
    The response MUST be a valid JSON object following this structure:
    { "suggestions": [ { "destination": "City, Country", "reason": "A brief explanation." } ] }
    Ensure the JSON is well-formed.`;


    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestionsJson = JSON.parse(cleanedJsonString);

    return NextResponse.json(suggestionsJson, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to suggest destinations.' }, { status: 500 });
  }
}