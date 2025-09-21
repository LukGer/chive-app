import { recipeStatusEnum } from "@/database/schema";
import { z } from "zod";

export const RecipeStatusSchema = z.enum(recipeStatusEnum.enumValues);

export type RecipeStatus = z.infer<typeof RecipeStatusSchema>;
