import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';

// Schema for backend validation
const SuggestionRequestSchema = z.object({
  duration: z.coerce.number().min(1),
  budget: z.coerce.number().min(1),
  interests: z.string().min(10),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SuggestionRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const { duration, budget, interests } = validation.data;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Based on the following travel preferences, suggest 5 potential destinations.
    - Trip Duration: ${duration} days
    - Budget: Approximately ${budget} USD per person
    - Main Interests: ${interests}

    For each destination, provide a short, compelling reason why it's a good fit.
    The response MUST be a valid JSON object following this structure:
    {
      "suggestions": [
        {
          "destination": "City, Country",
          "reason": "A brief explanation."
        }
      ]
    }
    Ensure the JSON is well-formed. Do not include any text, markdown, or formatting outside of the main JSON object.`;

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