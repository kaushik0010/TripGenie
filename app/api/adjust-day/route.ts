import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as z from 'zod';
import { sanitizeInput } from '@/lib/sanitize';

const AdjustDayRequestSchema = z.object({
  originalDayPlan: z.object({
    day: z.number(),
    title: z.string(),
    activities: z.array(z.string()),
  }),
  adjustmentPrompt: z.string().min(3),
  language: z.string(),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.adjustmentPrompt) {
      body.adjustmentPrompt = sanitizeInput(body.adjustmentPrompt);
    }
    
    const validation = AdjustDayRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { originalDayPlan, adjustmentPrompt, language } = validation.data;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `A traveler's plan for Day ${originalDayPlan.day} (${originalDayPlan.title}) was originally:
    - ${originalDayPlan.activities.join('\n- ')}

    A real-time event has occurred. The new constraint is: "${adjustmentPrompt}".

    Please regenerate the list of activities for this day to accommodate this change.
    The response MUST be a valid JSON object with a single key "revisedActivities" which is an array of strings.
    Generate the response in the following language: ${language}.

    Example: { "revisedActivities": ["Visit the indoor museum instead.", "Enjoy a long lunch at a famous local restaurant.", "Watch a movie at a classic cinema hall."] }
    Ensure the JSON is well-formed.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const revisedPlan = JSON.parse(cleanedJsonString);

    return NextResponse.json(revisedPlan, { status: 200 });

  } catch (error) {
    console.error('Failed to adjust day:', error);
    return NextResponse.json({ error: 'Failed to adjust day' }, { status: 500 });
  }
}