import { z } from "zod";
import { RecipeStatusSchema } from "./recipe-status.schema";

export const RecipeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: RecipeStatusSchema.optional(),
  sortBy: z.enum(["title", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type RecipeListQuery = z.infer<typeof RecipeListQuerySchema>;
