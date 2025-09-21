import { z } from "zod";
import { RecipeStatusSchema } from "./recipe-status.schema";

export const RecipeResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  servings: z.number().int().nullable(),
  prepTimeInMinutes: z.number().int().nullable(),
  cookTimeInMinutes: z.number().int().nullable(),
  totalTimeInMinutes: z.number().int().nullable(),
  imageUrl: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  sourceName: z.string().nullable(),
  status: RecipeStatusSchema,
  provenance: z.record(z.string(), z.any()).nullable(),
  confidence: z.number().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
