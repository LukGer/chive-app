import { z } from "zod";

export const RecipeStatsSchema = z.object({
  total: z.number().int(),
  byStatus: z.record(z.string(), z.number().int()),
});

export type RecipeStats = z.infer<typeof RecipeStatsSchema>;
