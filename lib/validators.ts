import * as z from "zod";

export const tripSchema = z.object({
  destination: z.string().optional(),
  duration: z.coerce.number().min(1, "Trip must be at least 1 day."),
  budget: z.coerce.number().min(50, "Budget must be at least $50."),
  interests: z.string().min(10, "Please describe your interests in a bit more detail."),
});

export type TripSchemaType = z.infer<typeof tripSchema>;