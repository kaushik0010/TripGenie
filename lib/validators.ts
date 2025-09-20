import * as z from "zod";

export const tripSchema = z.object({
  destination: z.string().optional(),
  sourceLocation: z.string().optional(),
  tripType: z.enum(['solo', 'family', 'group']),
  members: z.string().optional(),
  duration: z.string().min(1, { message: "Please enter a duration." }).transform(Number).pipe(z.number().min(1, "Trip must be at least 1 day.")),
  budget: z.string().min(1, { message: "Please enter a budget." }).transform(Number).pipe(z.number().min(50, "Budget must be at least $50.")),
  currency: z.string(),
  startDate: z.coerce.date(),
  interests: z.string().min(10, "Please describe your interests in a bit more detail."),
})
.refine((data) => {
  if (data.tripType !== 'solo' && (!data.members || Number(data.members) < 2)) {
    return false;
  }
  return true;
}, {
  message: "For group or family trips, please specify at least 2 members.",
  path: ["members"],
});

export type TripSchemaType = z.infer<typeof tripSchema>;