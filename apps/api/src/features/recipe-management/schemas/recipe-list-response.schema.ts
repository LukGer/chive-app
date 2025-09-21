import { z } from "zod";
import { RecipeResponseSchema } from "./recipe-response.schema";

export const RecipeListResponseSchema = z.object({
  recipes: z.array(RecipeResponseSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

export type RecipeListResponse = z.infer<typeof RecipeListResponseSchema>;
